import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';
import FastImage from 'react-native-fast-image';

import {Types} from './src/Store/Types';
import Navigation from './src/Navigation/index';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {colors} from './src/Assets/Styles';

function App() {
  const dispatch = useDispatch();
  const [displayGif, setDisplayGif] = useState(true);

  useEffect(() => {
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
    <Navigation />
  );
}

export default App;
