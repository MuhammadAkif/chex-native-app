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
import {ANDROID} from '../../Constants';
import {Toast} from '../../Components';
import {BackArrow} from '../../Assets/Icons';

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
  modalMessage,
  handleOkPress,
  handleKnowYourPassword,
  handleNavigationBackPress,
}) => (
  <BackgroundImageView>
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => Keyboard.dismiss()}>
      <View style={[PreviewStyles.headerContainer, {paddingTop: hp('2%')}]}>
        <BackArrow
          height={hp('8%')}
          width={wp('8%')}
          color={colors.white}
          onPress={handleNavigationBackPress}
        />
      </View>
      <View
        style={[
          styles.headerContainer,
          {
            flex:
              Platform.OS === ANDROID
                ? 1
                : Platform.OS === 'ios' && isKeyboardActive
                ? 0.5
                : Platform.OS === 'ios'
                ? 1
                : 1.5,
          },
        ]}>
        <SignInLogo
          titleText={'Forget Password'}
          textStyle={{fontSize: hp('3%')}}
          containerStyle={styles.logoContainer}
        />
        <Text
          style={[
            styles.registerTitleText,
            {
              bottom: Platform.OS === 'ios' && isKeyboardActive ? hp('1%') : 0,
            },
          ]}>
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
            style={{color: colors.white, fontSize: hp('1.8%')}}
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
          text={'Sign In'}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </TouchableOpacity>
    {modalMessage?.isVisible && (
      <Toast
        onCrossPress={handleOkPress}
        message={modalMessage.message || modalMessage.error}
        isError={modalMessage.error !== ''}
        isForgetPassword={true}
      />
    )}
  </BackgroundImageView>
);

export default ResetPasswordScreen;
