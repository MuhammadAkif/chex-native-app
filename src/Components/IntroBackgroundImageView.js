import React from 'react';
import {View, StyleSheet, StatusBar, Dimensions, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Platforms} from '../Constants';
import {IMAGES} from '../Assets/Images';

const {OS} = Platform;
const {WINDOW, IOS} = Platforms;
const {width} = Dimensions.get(WINDOW);
const is_iOS =
  OS === IOS && width === 375
    ? width / 1.1 - 2.5
    : width === 414
    ? width / 1.1 - 2
    : wp('90%');

const IntroBackGroundImageView = ({children}) => (
  <>
    <FastImage
      source={IMAGES.intro_Background}
      priority={'normal'}
      resizeMode={'contain'}
      style={styles.image}
    />
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
      {children}
    </View>
  </>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: hp('50%'),
    right: is_iOS,
    top: hp('10%'),
  },
  //   This design is working fine on both platforms
  // image: {
  //   ...StyleSheet.absoluteFillObject,
  //   height: hp('60%'),
  //   right: wp('87%'),
  //   // right: wp('88.5%'),
  //   top: hp('10%'),
  // },
});
export default IntroBackGroundImageView;
