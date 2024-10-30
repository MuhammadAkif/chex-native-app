import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, ExpandedCardStyles} from '../../Assets/Styles';

const {black, orangePeel} = colors;
const {itemPickerContainer} = ExpandedCardStyles;

const ItemPickerLabel = ({
  label = 'Exterior Front',
  addNoteText = 'Add Note',
  onAddNotePress,
}) => (
  <View style={{...itemPickerContainer, ...styles.container}}>
    <Text style={{...styles.label, ...styles.fontSize}}>{label}</Text>
    {/*<TouchableOpacity onPress={onAddNotePress} style={styles.addNoteContainer}>*/}
    {/*  <Text style={styles.plusText}>+ </Text>*/}
    {/*  <Text style={{...styles.note, ...styles.fontSize}}>{addNoteText}</Text>*/}
    {/*</TouchableOpacity>*/}
  </View>
);
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'),
    alignItems: 'center',
    paddingBottom: hp('1%'),
  },
  label: {
    fontWeight: '600',
    color: black,
  },
  note: {
    fontWeight: '600',
    color: orangePeel,
  },
  fontSize: {
    fontSize: hp('1.8%'),
  },
  plusText: {
    fontSize: hp('2.5%'),
    bottom: hp('0.1%'),
    color: orangePeel,
  },
  addNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ItemPickerLabel;
