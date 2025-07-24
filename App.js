import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {checkVersion} from 'react-native-check-version';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import {DiscardInspectionModal, Splash, Toast} from './src/Components';
import AlertPopup from './src/Components/AlertPopup';
import VehicleTypeModal from './src/Components/VehicleTypeModal';
import {SESSION_EXPIRED, UPDATE_APP} from './src/Constants';
import {ROUTES} from './src/Navigation/ROUTES';
import Navigation from './src/Navigation/index';
import {
  clearNewInspection,
  hideToast,
  setNewInspectionId,
  setSelectedVehicleKind,
  setVehicleTypeModalVisible,
  signOut,
} from './src/Store/Actions';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {
  navigate,
  navigationRef,
  resetNavigation,
} from './src/services/navigationService';

const {TITLE, MESSAGE, BUTTON} = UPDATE_APP;
const {TITLE: title, MESSAGE: message, BUTTON: button} = SESSION_EXPIRED;
const {SIGN_IN} = ROUTES;

function App() {
  const dispatch = useDispatch();
  // @ts-ignore
  const {sessionExpired} = useSelector(state => state?.auth);
  const [displayGif, setDisplayGif] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState('');
  const {vehicleTypeModalVisible, selectedVehicleKind, newInspectionId} =
    useSelector(state => state.newInspection);

  useEffect(() => {
    (async () => {
      await initializeApp();
    })();

    return () => {
      dispatch(clearNewInspection());
      dispatch(hideToast());
    };
  }, [displayGif]);

  useEffect(() => {
    if (!vehicleTypeModalVisible && newInspectionId && selectedVehicleKind) {
      const doNavigate = () => {
        if (navigationRef.isReady()) {
          if (selectedVehicleKind.toLowerCase() === 'truck') {
            navigate(ROUTES.DVIR_VEHICLE_INFO, {
              routeName: ROUTES.INSPECTION_SELECTION,
            });
          } else {
            navigate(ROUTES.NEW_INSPECTION, {
              routeName: ROUTES.INSPECTION_SELECTION,
            });
          }
          dispatch(setNewInspectionId(null));
        }
      };
      doNavigate();
    }
  }, [vehicleTypeModalVisible, selectedVehicleKind, newInspectionId]);

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

  const handleVehicleTypeSelect = (type: string) => {
    dispatch(setVehicleTypeModalVisible(false));
    dispatch(setSelectedVehicleKind(type.toLowerCase()));
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
      <AlertPopup
        visible={sessionExpired}
        onYesPress={onSessionExpirePress}
        title={title}
        message={message}
        yesButtonText={button}
      />
      <VehicleTypeModal
        visible={vehicleTypeModalVisible}
        onSelect={handleVehicleTypeSelect}
      />
    </>
  );
}

export default App;
