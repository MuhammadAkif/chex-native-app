import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';
import {checkVersion} from 'react-native-check-version';

import Navigation from './src/Navigation/index';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {DiscardInspectionModal, Splash, Toast} from './src/Components';
import {SESSION_EXPIRED, UPDATE_APP} from './src/Constants';
import {resetNavigation} from './src/services/navigationService';
import {ROUTES} from './src/Navigation/ROUTES';
import AlertPopup from './src/Components/AlertPopup';
import {useUIActions, useUIState} from './src/hooks/UI';
import {useNewInspectionActions} from './src/hooks/newInspection';
import {useAuthActions} from './src/hooks/auth';
import {useAuthState} from './src/hooks';
import LoadingIndicator from './src/Components/LoadingIndicator';
import DeviceConnectionMonitor from './src/Components/DeviceConnectionMonitor';
import useGeoLocation from './src/hooks/location/useGeoLocation';
import MyApp from './src/Components/MyApp';

const {TITLE, MESSAGE, BUTTON} = UPDATE_APP;
const {TITLE: title, MESSAGE: message, BUTTON: button} = SESSION_EXPIRED;
const {SIGN_IN} = ROUTES;

function App() {
  const {logout} = useAuthActions();
  const {clearToast} = useUIActions();
  const {resetInspection} = useNewInspectionActions();
  const {isSessionExpired, token} = useAuthState();
  const {isLoading} = useUIState();
  const [displayGif, setDisplayGif] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState('');
  const {permissionGranted} = useGeoLocation();
  console.log('permissionGranted', permissionGranted);

  useEffect(() => {
    (async () => {
      await initializeApp();
    })();

    return () => {
      resetAllStates();
    };
  }, [displayGif]);

  function resetAllStates() {
    resetInspection();
    clearToast();
  }

  async function initializeApp() {
    await versionCheck();
    SplashScreen.hide();
    if (displayGif) {
      const timeoutId = setTimeout(() => setDisplayGif(false), 3500);
      return () => clearTimeout(timeoutId);
    } else {
      resetAllStates();
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
    logout();
    resetNavigation(SIGN_IN);
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
        visible={isSessionExpired}
        onYesPress={onSessionExpirePress}
        title={title}
        message={message}
        yesButtonText={button}
      />
      {token && <DeviceConnectionMonitor />}
      <LoadingIndicator isLoading={isLoading} />
    </>
  );
}

export default App;
