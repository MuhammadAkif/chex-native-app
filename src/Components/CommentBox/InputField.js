import React from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
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
  <View style={styles.container}>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      multiline={multiline}
      editable={editable}
      style={styles.input}
      placeholderTextColor={gray}
      onSubmitEditing={onSubmitEditing}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: gray,
    height: hp('30%'),
    width: wp('80%'),
    padding: hp('1%'),
  },
  input: {
    color: black,
    fontSize: hp('1.8%'),
  },
});

export default InputField;
