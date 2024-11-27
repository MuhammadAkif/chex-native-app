import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const {white, orangePeel, brightGreen} = colors;

// Constants for status labels
const LABELS = {
  REQUIRED: 'Required',
  OPTIONAL: 'Optional',
};

const RequiredIndicator = ({required = false, text = null}) => {
  // Determine the label text and background color based on the 'required' prop
  const labelText = required ? LABELS.REQUIRED : LABELS.OPTIONAL;
  const backgroundColor = required ? orangePeel : brightGreen;

  // If required is null, return null to render nothing
  if (required === null) {
    return null;
  }

  return (
    <View style={[styles.label, {backgroundColor}]}>
      <Text style={styles.text}>{text || labelText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: hp('50%'),
  },
  text: {
    fontSize: hp('1.3%'),
    color: white,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

export default RequiredIndicator;
