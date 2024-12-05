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
  addNoteText = 'Add Image',
  labelVisible = false,
  onAddNotePress,
}) => (
  <View style={[itemPickerContainer, styles.container]}>
    <Text style={[styles.label, styles.fontSize]}>{label}</Text>
    {labelVisible && (
      <TouchableOpacity
        onPress={onAddNotePress}
        accessibilityLabel={'This is label'}
        style={styles.addNoteContainer}>
        <Text style={[styles.note, styles.labelSize]}>+ {addNoteText}</Text>
      </TouchableOpacity>
    )}
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
  labelSize: {
    fontSize: hp('1.4%'),
  },
  addNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ItemPickerLabel;
