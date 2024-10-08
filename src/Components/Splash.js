import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

import {IMAGES} from '../Assets/Images';
import {colors} from '../Assets/Styles';

const {white} = colors;

const Splash = () => (
  <>
    <FastImage
      source={IMAGES.splash}
      resizeMode={'contain'}
      style={[StyleSheet.absoluteFill, {backgroundColor: white}]}
    />
    <StatusBar
      backgroundColor="transparent"
      barStyle="light-content"
      translucent={true}
    />
  </>
);
export default Splash;
