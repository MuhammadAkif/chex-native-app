import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {buttonTextStyle} from '../Assets/Styles';

const PrimaryGradientButton = ({
  buttonStyle,
  textStyle,
  onPress,
  text,
  disabled,
}) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <LinearGradient
      colors={['#FF7A00', '#F90']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[styles.buttonContainer, buttonStyle]}>
      <Text style={[buttonTextStyle, textStyle]}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PrimaryGradientButton;
