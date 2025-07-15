import React, {useMemo, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TripDetailScreen} from '../../Screens';
import TripService from '../../services/tripService';
import {endTripAsync, startTripAsync, addComment, setStartLocation} from '../../Store/Actions/TripAction';
import {getNearbyPopulatedPlace} from '../../services/geonames';
import { addTripComment } from '../../services/tripApi';
import AlertPopup from '../../Components/AlertPopup';
import InfoModal from '../../Components/PopUpModals/InfoModal';
import BackgroundGeolocation from 'react-native-background-geolocation';

const TripDetailContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const trip = useSelector(state => state?.trip) || {};
  const [tripStarted, setTripStarted] = useState(trip?.isTracking);
  // Timer state for duration refresh
  const [now, setNow] = useState(Date.now());

  // Loading state for start trip
  const [startTripLoading, setStartTripLoading] = useState(false);

  // Permission dialog state
  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [pendingStartTrip, setPendingStartTrip] = useState(false);

  // Background permission modal state
  const [backgroundPermissionDialogVisible, setBackgroundPermissionDialogVisible] = useState(false);
  const [pendingBackgroundContinue, setPendingBackgroundContinue] = useState(null);

  // Comment modal state
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Place name state
  const [startLocationName, setStartLocationName] = useState('Not Available');
  const [endLocationName, setEndLocationName] = useState('Not Finished');


  const handleNavigationBackPress = () => {
    navigation.goBack();
  };

  const handleViewTripHistory = () => {
    navigation.navigate('TRIP_HISTORY');
  };

  // Custom dialog callback for TripService
  const showCustomPermissionDialog = (onContinue) => {
    setPendingStartTrip(() => () => {
      setPermissionDialogVisible(false);
      onContinue();
    });
    setPermissionDialogVisible(true);
  };

  // Custom dialog callback for background location permission
  const showBackgroundPermissionDialog = (onContinue) => {
    setPendingBackgroundContinue(() => () => {
      setBackgroundPermissionDialogVisible(false);
      onContinue();
    });
    setBackgroundPermissionDialogVisible(true);
  };

  const onPressStartAndEnd = async () => {
    try {
      if (tripStarted) {
        await TripService.stopLocationTracking();

        // Use Date.now() as endTime
        const endTime = Date.now();

        // Get the last location for end location
        let endLocName = endLocationName;
        let lat = endLocation?.latitude
        let lng = endLocation?.longitude

        if (trip.locations && trip.locations.length > 0) {
          const lastLoc = trip.locations[trip.locations.length - 1];
          const res = await getNearbyPopulatedPlace(lastLoc.latitude, lastLoc.longitude);
          endLocName = res?.data?.geonames?.[0]?.name || endLocName;
          lat = lastLoc.latitude,
          lng = lastLoc.longitude
        }

        const tripData = {
          id: trip?.tripId,
          status: 'COMPLETED',
          duration: trip.startTime ? endTime - trip.startTime : 0,
          endTime,
          distance: (trip.totalDistance || 0).toFixed(2),
          lat,
          lng,
          location: endLocName,
          avgSpeed:
            trip.startTime && trip.totalDistance
              ? Math.round(
                  trip.totalDistance /
                    ((endTime - trip.startTime) / 3600000)
                )
              : 0,
        };

        dispatch(endTripAsync(tripData));
        setTripStarted(false);
      } else  {
        setStartTripLoading(true);
        await TripService.initializeForTrip();
        // Centralized permission logic
        const granted = await TripService.requestLocationPermissionsWithModal(showCustomPermissionDialog, showBackgroundPermissionDialog);
        if (!granted) { setStartTripLoading(false); return; }
        // Fetch current location immediately and set as startLocation
        try {
          const currentLocation = await BackgroundGeolocation.getCurrentPosition({
            timeout: 10,
            maximumAge: 0,
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          });
          if (currentLocation && currentLocation.coords) {
            dispatch(setStartLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              timestamp: currentLocation.timestamp,
              speed: currentLocation.coords.speed || 0,
              accuracy: currentLocation.coords.accuracy,
            }));
          }
        } catch (e) {
          console.warn('[TripDetailContainer] Could not fetch current location immediately:', e);
        }
        await TripService.startLocationTracking();
        dispatch(startTripAsync());
        setTripStarted(true);
        // Reset timer to now when trip starts
        setNow(Date.now());
        setStartTripLoading(false);
      }
    } catch (error) {
      setStartTripLoading(false);
      console.error('[TripDetailContainer] Error toggling trip:', error);
    }
  };

  // Comment modal handlers
  const openCommentModal = () => setCommentModalVisible(true);
  const closeCommentModal = () => setCommentModalVisible(false);
  const handleCommentInputChange = text => setCommentInput(text);
  
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      // Call the API to add comment
      await addTripComment(trip?.tripId, commentInput.trim());
      dispatch(addComment({text: commentInput.trim(), timestamp: Date.now()}));
      setCommentInput('');
    } catch (e) {
      // Optionally show error
      console.error('Failed to add comment:', e.response.data);
    } finally {
      setCommentLoading(false);
      setCommentModalVisible(false);
    }
  };

  // Live data formatting
  const {startTime, totalDistance, startLocation, endLocation, comments = []} = trip;

  // Update timer every 30 seconds when trip is started
  useEffect(() => {
    if (!tripStarted) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [tripStarted]);

  const formattedDuration = useMemo(() => {
    if (!startTime || !tripStarted) return '-';
    const durationMs = Math.max(0, now - startTime);
    const mins = Math.floor(durationMs / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins} mins`;
  }, [startTime, tripStarted, now]);

  const formattedDistance = tripStarted
    ? `${(totalDistance || 0).toFixed(2)} km`
    : '-';

  const startTimeText = tripStarted
    ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    : 'Not Started';

  const endTimeText = tripStarted
    ? '-'
    : trip.endTime
    ? new Date(trip.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    : 'Not Finished';

  // Fetch place names when startLocation or endLocation changes
  useEffect(() => {
    const fetchStartLocationName = async () => {
      if (startLocation && startLocation.latitude && startLocation.longitude) {
        try {
          const res = await getNearbyPopulatedPlace(startLocation.latitude, startLocation.longitude);
          const name = res?.data?.geonames?.[0]?.name;
          setStartLocationName(name || 'Unknown Place');
        } catch (e) {
          setStartLocationName('Unknown Place');
        }
      } else {
        setStartLocationName('Not Available');
      }
    };
    fetchStartLocationName();
  }, [startLocation]);

  useEffect(() => {
    const fetchEndLocationName = async () => {
      if (!trip.isActive && endLocation && endLocation.latitude && endLocation.longitude) {
        try {
          const res = await getNearbyPopulatedPlace(endLocation.latitude, endLocation.longitude);
          const name = res?.data?.geonames?.[0]?.name;
          setEndLocationName(name || 'Unknown Place');
        } catch (e) {
          setEndLocationName('Unknown Place');
        }
      } else {
        setEndLocationName('Not Finished');
      }
    };
   fetchEndLocationName();
  }, [endLocation, trip.isActive]);

  return (
    <>
      <TripDetailScreen
        tripStarted={tripStarted}
        handleNavigationBackPress={handleNavigationBackPress}
        onPressStartAndEnd={onPressStartAndEnd}
        startTime={startTimeText}
        endTime={endTimeText}
        duration={formattedDuration}
        distance={formattedDistance}
        startLocationName={startLocationName}
        endLocationName={endLocationName}
        comments={comments}
        commentModalVisible={commentModalVisible}
        openCommentModal={openCommentModal}
        closeCommentModal={closeCommentModal}
        commentInput={commentInput}
        handleCommentInputChange={handleCommentInputChange}
        handleCommentSubmit={handleCommentSubmit}
        onPressViewTripHistory={handleViewTripHistory}
        navigation={navigation}
        startTripLoading={startTripLoading}
        commentLoading={commentLoading}
      />
      <AlertPopup
        visible={permissionDialogVisible}
        title={"Location Permission Required"}
        message={"This app requires 'Always' location access to track your trip in the background. Please grant this permission in settings."}
        yesButtonText={"Go to Settings"}
        onYesPress={() => {
          if (pendingStartTrip) pendingStartTrip();
        }}
        cancelButtonText={"Cancel"}
        onCancelPress={() => setPermissionDialogVisible(false)}
      />

      <InfoModal
        isVisible={backgroundPermissionDialogVisible}
        title={"Background Permission Required"}
        description={"Background Permission are required to track the trip in background"}
        onOkPress={() => {
          if (pendingBackgroundContinue) pendingBackgroundContinue();
        }}
      />
    </>
  );
};

export default TripDetailContainer;
