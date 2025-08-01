import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {checkVersion} from 'react-native-check-version';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';

import {DiscardInspectionModal, Splash, Toast} from './src/Components';
import AlertPopup from './src/Components/AlertPopup';
import VehicleTypeModal from './src/Components/VehicleTypeModal';
import {SESSION_EXPIRED, UPDATE_APP, VEHICLE_TYPES} from './src/Constants';
import {ROUTES} from './src/Navigation/ROUTES';
import Navigation from './src/Navigation/index';
import {store} from './src/Store';
import {clearNewInspection, hideToast, setCompanyId, setSelectedVehicleKind, setVehicleTypeModalVisible, signOut} from './src/Store/Actions';
import {hasCameraAndMicrophoneAllowed, onNewInspectionPressFail, onNewInspectionPressSuccess} from './src/Utils';
import {createInspection} from './src/services/inspection';
import {navigate, navigationRef, resetNavigation} from './src/services/navigationService';

const {TITLE, MESSAGE, BUTTON} = UPDATE_APP;
const {TITLE: title, MESSAGE: message, BUTTON: button} = SESSION_EXPIRED;
const {SIGN_IN} = ROUTES;

function App() {
  const dispatch = useDispatch();
  // @ts-ignore
  const {sessionExpired} = useSelector(state => state?.auth);
  const [displayGif, setDisplayGif] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState('');
  const {vehicleTypeModalVisible} = useSelector((state: any) => state?.newInspection || {});
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    vehicleType: '',
  });

  useEffect(() => {
    (async () => {
      await initializeApp();
    })();

    return () => {
      dispatch(clearNewInspection());
      dispatch(hideToast());
    };
  }, [displayGif]);

  async function initializeApp() {
    await versionCheck();
    SplashScreen.hide();
    if (displayGif) {
      const timeoutId = setTimeout(() => setDisplayGif(false), 3500);
      return () => clearTimeout(timeoutId);
    } else {
      dispatch(clearNewInspection());
      dispatch(hideToast());
      await hasCameraAndMicrophoneAllowed();
    }
  }

  async function versionCheck() {
    const version = await checkVersion();
    if (version.needsUpdate) {
      setUpdateAvailable(version.url);
    }
  }

  const handleUpdatePress = async () => {
    if (updateAvailable) {
      await Linking.openURL(updateAvailable);
    }
  };
  const onSessionExpirePress = () => {
    // @ts-ignore
    dispatch(signOut());
    resetNavigation(SIGN_IN);
  };

  const handleVehicleTypeSelect = async (type: string) => {
    dispatch(setSelectedVehicleKind(type.toLowerCase()));

    if (type.toLowerCase() === VEHICLE_TYPES.TRUCK) {
      dispatch(setVehicleTypeModalVisible(false));
      // Navigate immediately for truck, no API call
      if (navigationRef.isReady()) {
        navigate(ROUTES.DVIR_VEHICLE_INFO, {
          routeName: ROUTES.INSPECTION_SELECTION,
        });
      }
    } else {
      // For van/sedan/other, call API and navigate after success
      const state = store.getState();
      const companyId = state?.auth?.user?.data?.companyId;
      dispatch(setCompanyId(companyId));
      setLoadingState({isLoading: true, vehicleType: type});
      try {
        const response = await createInspection(companyId, {vehicleType: type.toLowerCase()});
        onNewInspectionPressSuccess(
          response,
          dispatch,
          navigate, // navigation is handled in App.tsx
        );
      } catch (err) {
        onNewInspectionPressFail(err, dispatch);
      } finally {
        dispatch(setVehicleTypeModalVisible(false));
        setLoadingState({isLoading: false, vehicleType: ''});
      }
    }
  };

  return displayGif ? (
    <Splash />
  ) : (
    <>
      <Navigation />
      <Toast />
      {updateAvailable && (
        <DiscardInspectionModal
          onYesPress={handleUpdatePress}
          title={TITLE}
          description={MESSAGE}
          yesButtonText={BUTTON}
          dualButton={false}
          onNoPress={undefined}
          noButtonText={undefined}
          noButtonStyle={undefined}
        />
      )}
      <AlertPopup visible={sessionExpired} onYesPress={onSessionExpirePress} title={title} message={message} yesButtonText={button} />
      <VehicleTypeModal visible={vehicleTypeModalVisible} onSelect={handleVehicleTypeSelect} loadingState={loadingState} />
    </>
  );
}

export default App;
