import React, { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { checkVersion } from 'react-native-check-version';
import 'react-native-devsettings';
import BootSplash from 'react-native-bootsplash';
import { useDispatch, useSelector } from 'react-redux';
import { DiscardInspectionModal, Splash, Toast } from './src/Components';
import AlertPopup from './src/Components/AlertPopup';
import { SESSION_EXPIRED, SMARTLOOK_PROJECT_ID, UPDATE_APP } from './src/Constants';
import { ROUTES } from './src/Navigation/ROUTES';
import Navigation from './src/Navigation/index';
import { clearNewInspection, hideToast, signOut } from './src/Store/Actions';
import { hasCameraAndMicrophoneAllowed } from './src/Utils';
import { resetNavigation } from './src/services/navigationService';
import smartlookService from './src/services/smartlookService';
import {OneSignal, LogLevel} from 'react-native-onesignal';

const { TITLE, MESSAGE, BUTTON } = UPDATE_APP;
const { TITLE: title, MESSAGE: message, BUTTON: button } = SESSION_EXPIRED;
const { SIGN_IN } = ROUTES;

function App() {
  const dispatch = useDispatch();

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize('3f8c33e1-1334-4cf6-a0c4-347d101bcbef');
  OneSignal.Notifications.requestPermission(false).then(r => console.log(r));
  // @ts-ignore
  const { sessionExpired } = useSelector(state => state?.auth);
  const [displayGif, setDisplayGif] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState('');


  useEffect(() => {
    if (SMARTLOOK_PROJECT_ID) {
      smartlookService.init(SMARTLOOK_PROJECT_ID);
    } else {
      console.warn('Smartlook: SMARTLOOK_PROJECT_ID environment variable is not set. Smartlook will not be initialized.');
    }
  }, []);

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
    await BootSplash.hide({ fade: true });

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
