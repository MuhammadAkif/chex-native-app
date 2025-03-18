import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';

import {Splash} from './src/Components';
import {Platforms} from './src/Constants';
import SafetyTagIOS from './src/Components/SafetyTag/SafetyTagIOS';
import SafetyTagScanner from './src/Components/SafetyTag/SafetyTagScanner';
import {requestPermissions} from './src/Utils/helpers';

const {OS} = Platform;
const {IOS, ANDROID} = Platforms;

function App() {
  // @ts-ignore
  const [displayGif, setDisplayGif] = useState(true);

  useEffect(() => {
    (async () => {
      await initializeApp();
    })();
  }, [displayGif]);

  async function initializeApp() {
    SplashScreen.hide();
    OS === ANDROID && requestPermissions().then();
    if (displayGif) {
      const timeoutId = setTimeout(() => setDisplayGif(false), 3500);
      return () => clearTimeout(timeoutId);
    }
  }

  return displayGif ? (
    <Splash />
  ) : OS === IOS ? (
    <SafetyTagIOS />
  ) : (
    <SafetyTagScanner />
  );
}

export default App;
