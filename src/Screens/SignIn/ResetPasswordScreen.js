import React from 'react';
import {View, Text, Platform, TouchableOpacity, Keyboard} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {
  BackgroundImageView,
  PrimaryGradientButton,
  InputFieldRequiredError,
  SignInLogo,
} from '../../Components';
import CustomInput from '../../Components/CustomInput';
import {colors, PreviewStyles} from '../../Assets/Styles';
import CustomPasswordInput from '../../Components/CustomPasswordInput';
import {Platforms} from '../../Constants';
import {BackArrow} from '../../Assets/Icons';

const {OS} = Platform;
const {ANDROID, IOS} = Platforms;
const {white} = colors;
const {headerContainer} = PreviewStyles;

const ResetPasswordScreen = ({
  values,
  handleChange,
  emailRef,
  passwordRef,
  confirmPasswordRef,
  handleConfirmPasswordFocus,
  handlePasswordFocus,
  handleSubmit,
  handleBlur,
  errors,
  touched,
  styles,
  isKeyboardActive,
  isSubmitting,
  hidePasswordHandler,
  hideConfirmPasswordHandler,
  hidePassword,
  hideConfirmPassword,
  handleKnowYourPassword,
  handleNavigationBackPress,
}) => (
  <BackgroundImageView>
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => Keyboard.dismiss()}>
      <View style={[headerContainer, {paddingTop: hp('2%')}]}>
        <BackArrow
          height={hp('8%')}
          width={wp('8%')}
          color={white}
          onPress={handleNavigationBackPress}
        />
      </View>
      <View
        style={{
          ...styles.headerContainer,
          flex:
            OS === ANDROID
              ? 1
              : OS === IOS && isKeyboardActive
              ? 0.5
              : OS === IOS
              ? 1
              : 1.5,
        }}>
        <SignInLogo
          titleText={'Reset Password'}
          textStyle={{fontSize: hp('3%')}}
          containerStyle={styles.logoContainer}
        />
        <Text
          style={{
            ...styles.registerTitleText,
            bottom: OS === IOS && isKeyboardActive ? hp('1%') : 0,
          }}>
          Please check your email for unique pin and type below
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <CustomInput
          ref={emailRef}
          value={values?.verificationCode}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'verificationCode'}
          placeholder={'Verification Code'}
          onSubmitEditing={handlePasswordFocus}
        />
        <InputFieldRequiredError
          touched={touched.verificationCode}
          error={errors.verificationCode}
        />
        <CustomPasswordInput
          ref={passwordRef}
          value={values?.password}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'password'}
          placeholder={'Password'}
          secureTextEntry={hidePassword}
          enterKeyHint={'done'}
          hidePasswordHandler={hidePasswordHandler}
          isPasswordHidden={hidePassword}
          onSubmitEditing={handleConfirmPasswordFocus}
        />
        <InputFieldRequiredError
          touched={touched.password}
          error={errors.password}
        />
        <CustomPasswordInput
          ref={confirmPasswordRef}
          value={values?.confirmPassword}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'confirmPassword'}
          placeholder={'Confirm Password'}
          secureTextEntry={hideConfirmPassword}
          enterKeyHint={'done'}
          hidePasswordHandler={hideConfirmPasswordHandler}
          isPasswordHidden={hideConfirmPassword}
          onSubmitEditing={handleSubmit}
        />
        <InputFieldRequiredError
          touched={touched.confirmPassword}
          error={errors.confirmPassword}
        />
        <TouchableOpacity
          onPress={handleKnowYourPassword}
          disabled={isSubmitting}
          style={styles.forgetPasswordContainer}>
          <Text
            style={{color: white, fontSize: hp('1.8%')}}
            disabled={isSubmitting}>
            Know Your Password?{' '}
            <Text style={styles.forgotPasswordText} disabled={isSubmitting}>
              Login
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <PrimaryGradientButton
          buttonStyle={styles.registerButtonText}
          text={'Reset'}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </TouchableOpacity>
  </BackgroundImageView>
);

export default ResetPasswordScreen;
