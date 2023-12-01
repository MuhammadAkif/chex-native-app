import React, {forwardRef} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const CustomInput = forwardRef(
  (
    {
      placeholder,
      inputStyle,
      inputMode,
      value,
      onChange,
      onChangeText,
      onBlur,
      secureTextEntry,
      onSubmitEditing,
      keyboardType,
      valueName,
      touched,
      error,
      enterKeyHint,
      onPressIn,
      onPressOut,
      inputContainerStyle,
      hidePasswordHandler,
    },
    ref,
  ) => (
    <View style={[styles.container, inputContainerStyle]}>
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor={colors.steelGray}
        value={value}
        onChange={onChange}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        // textAlign={'left'}
        numberOfLines={1}
        multiline={false}
        onChangeText={onChangeText(valueName)}
        onBlur={onBlur(valueName)}
        secureTextEntry={secureTextEntry}
        style={[styles.input, inputStyle, {color: colors.black}]}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint || 'next'}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
      />
    </View>
  ),
);

const styles = StyleSheet.create({
  container: {
    height: hp('7%'),
    width: wp('90%'),
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.lightSkyBlue,
    borderRadius: 5,
  },
  input: {
    height: hp('7%'),
    width: wp('80%'),
    fontSize: hp('2%'),
  },
});

export default CustomInput;
