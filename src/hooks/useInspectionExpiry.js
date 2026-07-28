import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { INSPECTION_EXPIRY_MINUTES } from '../Constants';
import { ROUTES } from '../Navigation/ROUTES';
import { getInspectionDetails } from '../services/inspection';
import { clearNewInspection, setInspectionDetail } from '../Store/Actions';

// React Native warns about very long timers, so the watcher re-arms in chunks of at most a
// minute; the final tick still lands exactly on the expiry moment.
const MAX_TIMER_MS = 60000;

/**
 * Flags the in-progress inspection as expired once it is older than INSPECTION_EXPIRY_MINUTES.
 *
 * `createdAt` arrives from the API as a UTC ISO string ("2026-07-27T09:01:42.941Z"). dayjs turns
 * that into an absolute instant, so diffing it against dayjs() is correct on a device in any
 * timezone — no manual offset handling needed.
 *
 * @param {Object}   [options]
 * @param {Function} [options.onAcknowledge] screen-specific cleanup (local state) run when the
 *                                           driver dismisses the modal, before navigating back.
 * @param {boolean}  [options.autoLoadDetail=true] fetch the inspection details when the store has
 *                                           an inspection id but no createdAt. Set false on screens
 *                                           that already load the details themselves.
 * @returns {{isInspectionExpired: boolean, handleExpiredInspectionPress: Function}}
 */
export const useInspectionExpiry = ({ onAcknowledge, autoLoadDetail = true } = {}) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isScreenFocused = useIsFocused();
    const { inspectionDetail, selectedInspectionID } = useSelector(state => state.newInspection) || {};
    const [isInspectionExpired, setIsInspectionExpired] = useState(false);
    const backfilledForRef = useRef(null);

    const createdAtISO = inspectionDetail?.createdAt;
    const detailId = inspectionDetail?.id;

    // BACKFILL: not every entry point loads the inspection details (a freshly created inspection
    // and the truck "already in progress" resume both navigate straight to the screen), and
    // without createdAt there is nothing to count from. Fetch it once, quietly.
    useEffect(() => {
        if (!autoLoadDetail || !isScreenFocused || !selectedInspectionID || createdAtISO) {
            return;
        }
        if (backfilledForRef.current === selectedInspectionID) {
            return;
        }
        backfilledForRef.current = selectedInspectionID;

        let isCancelled = false;
        getInspectionDetails(selectedInspectionID)
            .then(response => {
                if (isCancelled) {
                    return;
                }
                const inspection = response?.data?.inspection || null;
                if (inspection) {
                    dispatch(setInspectionDetail(inspection));
                }
            })
            .catch(error => {
                // Expiry is a safeguard, never a blocker: on failure leave the screen usable and
                // allow another attempt the next time it regains focus.
                backfilledForRef.current = null;
                console.log('Inspection expiry: could not load inspection details =>', error?.message);
            });

        return () => {
            isCancelled = true;
        };
    }, [autoLoadDetail, isScreenFocused, selectedInspectionID, createdAtISO, dispatch]);

    // WATCHER: schedules a timer for the exact expiry moment instead of polling, and re-checks
    // whenever the app returns to the foreground (JS timers are frozen while backgrounded).
    useEffect(() => {
        // Only guard the inspection the screen is actually working on. If the payload carries an
        // id it must match, otherwise a persisted detail from an earlier inspection could fire.
        const isSameInspection = !detailId || String(detailId) === String(selectedInspectionID);

        if (!createdAtISO || !selectedInspectionID || !isSameInspection || !isScreenFocused) {
            setIsInspectionExpired(false);
            return;
        }

        const expiresAt = dayjs(createdAtISO).add(INSPECTION_EXPIRY_MINUTES, 'minute');
        let timeoutId = null;

        const check = () => {
            const msRemaining = expiresAt.diff(dayjs());

            if (msRemaining <= 0) {
                setIsInspectionExpired(true);
                return;
            }

            setIsInspectionExpired(false);
            timeoutId = setTimeout(check, Math.min(msRemaining, MAX_TIMER_MS));
        };

        check();

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState !== 'active') {
                return;
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            check();
        });

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            subscription.remove();
        };
    }, [createdAtISO, detailId, selectedInspectionID, isScreenFocused]);

    // Same destination as the LogoHeader back arrow (navigation.goBack).
    const handleExpiredInspectionPress = () => {
        setIsInspectionExpired(false);
        if (onAcknowledge) { onAcknowledge(); }
        dispatch(clearNewInspection());
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate(ROUTES.TABS);
        }
    };

    return { isInspectionExpired, handleExpiredInspectionPress };
};

export default useInspectionExpiry;
