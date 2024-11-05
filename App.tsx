import React, {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {useDispatch} from 'react-redux';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';
import {checkVersion} from 'react-native-check-version';

import Navigation from './src/Navigation/index';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {DiscardInspectionModal, Splash, Toast} from './src/Components';
import {UPDATE_APP} from './src/Constants';
import {clearNewInspection, hideToast} from './src/Store/Actions';

const {TITLE, MESSAGE, BUTTON} = UPDATE_APP;

function App() {
  const dispatch = useDispatch();
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
    </>
  );
}

export default App;
