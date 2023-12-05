import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {buttonTextStyle, colors} from '../Assets/Styles';

const HeaderTitle = () => (
  <Text style={[buttonTextStyle, styles.logoContainer]}>
    CHEX<Text style={styles.titleText_AI}>.AI</Text>
  </Text>
);
const styles = StyleSheet.create({
  logoContainer: {
    color: colors.white,
    fontSize: hp('3%'),
  },
  titleText_AI: {
    color: 'hsla(36, 100%, 50%, 1)',
    letterSpacing: 0.6,
  },
});

export default HeaderTitle;
