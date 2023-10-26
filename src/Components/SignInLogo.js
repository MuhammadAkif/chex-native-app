import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const SignInLogo = ({
  containerStyle,
  textStyle,
  nestedTextStyle,
  titleText,
  dotTitleText,
  subtitleText,
}) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={[styles.titleText, textStyle]}>
      {titleText}
      <Text style={[styles.titleText, styles.titleText_AI, nestedTextStyle]}>
        {dotTitleText}
      </Text>
    </Text>
    <Text style={styles.subTitleText}>{subtitleText}</Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    height: hp('20%'),
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: hp('8%'),
    color: 'hsla(0, 0%, 100%, 1)',
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  titleText_AI: {
    color: 'hsla(36, 100%, 50%, 1)',
    letterSpacing: 0.6,
  },
  subTitleText: {
    fontSize: hp('3%'),
    color: colors.white,
    letterSpacing: 0.6,
  },
});

export default SignInLogo;
