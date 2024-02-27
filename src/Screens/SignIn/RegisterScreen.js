import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {
  BackgroundImageView,
  PrimaryGradientButton,
  SignInLogo,
} from '../../Components';
import {colors} from '../../Assets/Styles';
import CustomInput from '../../Components/CustomInput';
import {Check} from '../../Assets/Icons';
import {ANDROID} from '../../Constants';

const isAndroid = Platform.OS === ANDROID;

const RegisterScreen = ({
  values,
  handleChange,
  firstNameRef,
  lastNameRef,
  emailRef,
  phoneNumberRef,
  passwordRef,
  handleLastNameFocus,
  handleEmailFocus,
  handlePhoneNumberFocus,
  handlePasswordFocus,
  handleSubmit,
  handleBlur,
  errors,
  touched,
  handleIsTermsSelected,
  isTermsSelected,
}) => (
  <BackgroundImageView>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SignInLogo
          titleText={'CHEX'}
          dotTitleText={'.AI'}
          subtitleText={'Virtual Inspections'}
          containerStyle={styles.logoContainer}
        />
        <Text style={styles.registerTitleText}>Register</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.bodyContainer}>
        {/*<ScrollView contentContainerStyle={styles.bodyInnerContainer}>*/}
        <CustomInput
          ref={firstNameRef}
          value={values?.firstName}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'firstName'}
          placeholder={'John'}
          onSubmitEditing={handleLastNameFocus}
          keyboardType={isAndroid ? 'default' : 'ascii-capable'}
          touched={touched}
          error={errors && errors.firstName}
        />
        <CustomInput
          ref={lastNameRef}
          value={values?.lastName}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'lastName'}
          placeholder={'Doe'}
          onSubmitEditing={handleEmailFocus}
          touched={touched}
          error={errors && errors.lastName}
        />
        <CustomInput
          ref={emailRef}
          value={values?.email}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'email'}
          placeholder={'Example@email.com'}
          onSubmitEditing={handlePhoneNumberFocus}
          keyboardType={'email-address'}
          touched={touched}
          error={errors && errors.email}
        />
        <CustomInput
          ref={phoneNumberRef}
          value={values?.phoneNumber}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'phoneNumber'}
          placeholder={'(123) 456-7890'}
          onSubmitEditing={handlePasswordFocus}
          keyboardType={'number-pad'}
          touched={touched}
          error={errors && errors.phoneNumber}
        />
        <CustomInput
          ref={passwordRef}
          value={values?.password}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'password'}
          placeholder={'********'}
          onSubmitEditing={handleSubmit}
          secureTextEntry={true}
          touched={touched}
          error={errors && errors.password}
          enterKeyHint={'done'}
        />
        {/*</ScrollView>*/}
      </KeyboardAvoidingView>
      <View style={styles.footerContainer}>
        <View style={styles.termsOfUseContainer}>
          <View style={styles.checkBox} onTouchStart={handleIsTermsSelected}>
            {isTermsSelected && (
              <Check height={hp('3%')} width={wp('5%')} color={colors.orange} />
            )}
          </View>
          <Text style={styles.termsOfUseText} onPress={handleIsTermsSelected}>
            I accept <Text style={styles.termsText}>Terms of Use</Text>
          </Text>
        </View>
        <PrimaryGradientButton
          buttonStyle={styles.registerButtonText}
          text={'Register'}
          onPress={handleSubmit}
        />
        <View style={styles.footerEmptyView} />
      </View>
    </View>
  </BackgroundImageView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 27, 81, 0.8)',
  },
  headerContainer: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-end',
  },
  registerTitleText: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: colors.white,
  },
  bodyContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  bodyInnerContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  footerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  termsText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  registerButtonText: {
    borderRadius: 30,
  },
  footerEmptyView: {
    flex: 0.5,
  },
  termsOfUseContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    alignItems: 'center',
  },
  checkBox: {
    height: hp('3%'),
    width: wp('6.5%'),
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.white,
    marginRight: 5,
  },
  termsOfUseText: {
    fontSize: hp('1.8%'),
    color: colors.white,
  },
});

export default RegisterScreen;
