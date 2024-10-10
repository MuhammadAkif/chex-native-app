import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const {black} = colors;

const Mandatory = ({text = '*', style}) => (
  <Text style={{...styles.text, ...style}}>{text}</Text>
);
const styles = StyleSheet.create({
  text: {
    color: black,
    fontSize: hp('2%'),
  },
});
export default Mandatory;
