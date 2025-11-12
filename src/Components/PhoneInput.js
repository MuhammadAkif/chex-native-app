import React from 'react';
import {StyleSheet, View} from 'react-native';
import MaskInput from 'react-native-mask-input';
import AppText from './text';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../Assets/Styles';

const USA_PHONE_MASK = ['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

const PhoneInput = ({value, onChangeText, onBlur, touched, error, inputContainerStyle, inputStyle, label}) => {
  return (
    <View>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <View style={[styles.container, inputContainerStyle]}>
        <MaskInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={(masked, unmasked) => {
            // masked: "+1 (123) 456-7890"
            // unmasked: "1234567890"
            onChangeText(masked, unmasked);
          }}
          mask={USA_PHONE_MASK}
          keyboardType="number-pad"
          placeholder="+1 (___) ___-____"
          onBlur={onBlur}
          maxLength={USA_PHONE_MASK.length}
        />
      </View>
      {touched && error ? <AppText style={styles.error}>{error}</AppText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp('7%'),
    width: wp('90%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.lightSkyBlue,
    borderRadius: 5,
    paddingHorizontal: wp('4%'),
  },
  input: {
    height: hp('7%'),
    width: wp('75%'),
    fontSize: hp('2%'),
    flex: 1,
  },
  error: {
    color: colors.red,
    marginTop: 3,
  },
  label: {marginBottom: 8},
});

export default PhoneInput;
