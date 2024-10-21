import {StyleSheet, Text} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {colors} from '../Assets/Styles';
import React from 'react';

const {gray} = colors;

const EmptyComponent = ({text = 'No Inspections available', style = {}}) => (
  <Text style={{...styles.noDataText, ...style}}>{text}</Text>
);

const styles = StyleSheet.create({
  noDataText: {
    fontSize: hp('2%'),
    color: gray,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
});

export default EmptyComponent;
