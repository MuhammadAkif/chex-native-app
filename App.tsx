import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import {checkVersion} from 'react-native-check-version';
import 'react-native-devsettings';
import BootSplash from 'react-native-bootsplash';
import {useDispatch, useSelector} from 'react-redux';
import {DiscardInspectionModal, Splash, Toast} from './src/Components';
import AlertPopup from './src/Components/AlertPopup';
import {SESSION_EXPIRED, UPDATE_APP} from './src/Constants';
import {ROUTES} from './src/Navigation/ROUTES';
import Navigation from './src/Navigation/index';
import {clearNewInspection, hideToast, signOut} from './src/Store/Actions';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {resetNavigation} from './src/services/navigationService';
import {initializeFullStory} from './src/services/fullstoryService';

const {TITLE, MESSAGE, BUTTON} = UPDATE_APP;
const {TITLE: title, MESSAGE: message, BUTTON: button} = SESSION_EXPIRED;
const {SIGN_IN} = ROUTES;

function App() {
  const dispatch = useDispatch();
  // @ts-ignore
  const {sessionExpired} = useSelector(state => state?.auth);
  const [displayGif, setDisplayGif] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState('');

  useEffect(() => {
    // Initialize FullStory early in app lifecycle
    // FullStory is disabled in development mode to avoid Metro Server issues
    initializeFullStory();

    (async () => {
      await initializeApp();
    })();

    return () => {
      dispatch(clearNewInspection());
      dispatch(hideToast());
      // Cleanup FullStory listeners on unmount
      // Note: cleanupFullStory is imported but cleanup happens automatically
      // when app unmounts, so explicit cleanup is optional
    };
  }, [displayGif]);

  async function initializeApp() {
    await versionCheck();
    await BootSplash.hide({fade: true});

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
      <View>
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
      </View>
    </>
  );
}

export default App;
