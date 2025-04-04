import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../../Assets/Styles';

const {white, black} = colors;

const HelpButton = ({onPress, text = '?'}) => (
  <TouchableOpacity style={styles.helpButton} onPress={onPress}>
    <Text style={styles.helpButtonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  helpButton: {
    position: 'absolute',
    bottom: hp('2%'),
    right: wp('4%'),
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  helpButtonText: {
    color: white,
    fontSize: hp('3%'),
    fontWeight: 'bold',
  },
});

export default HelpButton;
