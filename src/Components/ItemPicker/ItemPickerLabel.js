import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { colors, ExpandedCardStyles } from '../../Assets/Styles';

const { black, orangePeel } = colors;
const { itemPickerContainer } = ExpandedCardStyles;

const ItemPickerLabel = ({
  label,
  addNoteText,
  labelVisible = false,
  onAddNotePress,
}) => {
  const { t } = useTranslation();
  const defaultLabel = label || t('exteriorItems.front.title'); // Default fallback
  const defaultAddNoteText = addNoteText || t('common.addImage');

  return (
    <View style={[itemPickerContainer, styles.container]}>
      <Text style={[styles.label, styles.fontSize]}>{defaultLabel}</Text>
      {labelVisible && (
        <TouchableOpacity
          onPress={onAddNotePress}
          accessibilityLabel={'This is label'}
          style={styles.addNoteContainer}>
          <Text style={[styles.note, styles.labelSize]}>
            + {defaultAddNoteText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
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
    flex: 1
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
