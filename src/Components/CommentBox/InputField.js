import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';

const {gray, black} = colors;

const InputField = ({
  value,
  onChange,
  placeholder,
  maxLength,
  editable,
  onSubmitEditing,
  multiline = true,
}) => (
  <TextInput
    value={value}
    onChangeText={onChange}
    placeholder={placeholder}
    maxLength={maxLength}
    multiline={multiline}
    editable={editable}
    style={styles.input}
    onSubmitEditing={onSubmitEditing}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: gray,
    height: hp('30%'),
    width: wp('80%'),
    padding: hp('1%'),
    color: black,
  },
});

export default InputField;
