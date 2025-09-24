import React, {forwardRef} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, errorStyle} from '../Assets/Styles';
import AppText from './text';

const {steelGray, black, lightSkyBlue} = colors;

const CustomInput = forwardRef(
  (
    {
      label,
      placeholder,
      placeholderTextColor,
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
      editable = true,
      rightIcon,
      onRightIconPress,
      maxLength,
    },
    ref
  ) => (
    <View>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <View style={[styles.container, inputContainerStyle]}>
        <TextInput
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || steelGray}
          value={value}
          onChange={onChange}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          // textAlign={'left'}
          numberOfLines={1}
          multiline={false}
          onChangeText={onChangeText?.(valueName)}
          onBlur={onBlur?.(valueName)}
          secureTextEntry={secureTextEntry}
          style={[styles.input, inputStyle, {color: black, opacity: !editable ? 0.6 : 1}]}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint || 'next'}
          onSubmitEditing={onSubmitEditing}
          keyboardType={keyboardType}
          editable={editable}
          maxLength={maxLength}
        />

        {rightIcon && (
          <TouchableOpacity style={styles.rightIconContainer} onPress={onRightIconPress} activeOpacity={0.7}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {touched && error && <AppText style={[errorStyle.errorsTextStyle, styles.error]}>{error}</AppText>}
    </View>
  )
);

const styles = StyleSheet.create({
  container: {
    height: hp('7%'),
    width: wp('90%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: lightSkyBlue,
    borderRadius: 5,
    paddingHorizontal: wp('4%'),
  },
  input: {
    height: hp('7%'),
    width: wp('75%'),
    fontSize: hp('2%'),
    flex: 1,
  },
  rightIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: wp('2%'),
  },
  label: {marginBottom: 8},
  error: {marginTop: 3},
});

export default CustomInput;
