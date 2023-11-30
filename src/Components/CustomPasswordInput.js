import React, {forwardRef} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';
import {HidePassword, ShowPassword} from '../Assets/Icons';

const CustomPasswordInput = forwardRef(
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
      isPasswordHidden,
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
      <TouchableOpacity onPress={hidePasswordHandler}>
        {isPasswordHidden ? (
          <HidePassword
            height={hp('3%')}
            width={wp('6%')}
            color={colors.gray}
          />
        ) : (
          <ShowPassword
            height={hp('3%')}
            width={wp('6%')}
            color={colors.gray}
          />
        )}
      </TouchableOpacity>
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
    width: wp('65%'),
    fontSize: hp('2%'),
  },
});

export default CustomPasswordInput;
