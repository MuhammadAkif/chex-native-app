import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {buttonTextStyle, colors} from '../Assets/Styles';

const {white} = colors;

const SecondaryButton = ({text, buttonStyle, textStyle, onPress, disabled}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[styles.registerButton, buttonStyle]}>
    <Text style={[buttonTextStyle, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  registerButton: {
    height: hp('6%'),
    width: wp('80%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: white,
  },
});

export default SecondaryButton;
