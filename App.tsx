import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, Linking} from 'react-native';
import {useDispatch} from 'react-redux';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';
import FastImage from 'react-native-fast-image';
import {checkVersion} from 'react-native-check-version';

import {Types} from './src/Store/Types';
import Navigation from './src/Navigation/index';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {colors} from './src/Assets/Styles';
import {DiscardInspectionModal} from './src/Components';
import {UPDATE_APP} from './src/Constants';

function App() {
  const dispatch = useDispatch();
  const [displayGif, setDisplayGif] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState('');

  useEffect(() => {
    versionCheck().then();
    SplashScreen.hide();
    if (displayGif) {
      setTimeout(() => {
        setDisplayGif(false);
      }, 3500);
    } else {
      dispatch({type: Types.CLEAR_NEW_INSPECTION});
      hasCameraAndMicrophoneAllowed().then();
    }
    return () => {
      dispatch({type: Types.CLEAR_NEW_INSPECTION});
    };
  }, [displayGif]);

  async function versionCheck() {
    const version = await checkVersion();
    if (version.needsUpdate) {
      setUpdateAvailable(version?.url);
    }
  }
  const handleUpdatePress = async () => {
    await Linking.openURL(updateAvailable);
  };

  return displayGif ? (
    <>
      <FastImage
        source={require('./src/Assets/Images/chexDSPSlpash-speed55s-no-repeat.gif')}
        resizeMode={'contain'}
        style={[StyleSheet.absoluteFill, {backgroundColor: colors.white}]}
      />
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
    </>
  ) : (
    <>
      <Navigation />
      {updateAvailable && (
        <DiscardInspectionModal
          onYesPress={handleUpdatePress}
          title={UPDATE_APP.TITLE}
          description={UPDATE_APP.MESSAGE}
          yesButtonText={UPDATE_APP.BUTTON}
          dualButton={false}
        />
      )}
    </>
  );
}

export default App;
