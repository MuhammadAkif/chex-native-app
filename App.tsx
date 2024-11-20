import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {useDispatch} from 'react-redux';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';
import {checkVersion} from 'react-native-check-version';

import Navigation from './src/Navigation/index';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {
  DiscardInspectionModal,
  AlertPopup,
  Splash,
  Toast,
} from './src/Components';
import {SESSION_EXPIRED, UPDATE_APP} from './src/Constants';
import {clearNewInspection, hideToast, signOut} from './src/Store/Actions';
import {resetNavigation} from './src/services/navigationService';
import {ROUTES} from './src/Navigation/ROUTES';
import {useAuth} from './src/hooks';

const {TITLE, MESSAGE, BUTTON} = UPDATE_APP;
const {TITLE: title, MESSAGE: message, BUTTON: button} = SESSION_EXPIRED;
const {SIGN_IN} = ROUTES;

function App() {
  const dispatch = useDispatch();
  // @ts-ignore
  const {isSessionExpired} = useAuth();
  const [displayGif, setDisplayGif] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState('');

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
    </>
  );
}

export default App;
