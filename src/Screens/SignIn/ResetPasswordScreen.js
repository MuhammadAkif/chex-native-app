import React from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  BackgroundImageView,
  PrimaryGradientButton,
  InputFieldRequiredError,
  SignInLogo,
} from '../../Components';
import CustomInput from '../../Components/CustomInput';
import {colors} from '../../Assets/Styles';
import CustomPasswordInput from '../../Components/CustomPasswordInput';
import {ANDROID} from '../../Constants';
import {Toast} from '../../Components';

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
}) => (
  <BackgroundImageView>
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => Keyboard.dismiss()}>
      <View
        style={[
          styles.headerContainer,
          {
            flex:
              Platform.OS === ANDROID
                ? 1.5
                : Platform.OS === 'ios' && isKeyboardActive
                ? 1
                : 1.5,
          },
        ]}>
        <SignInLogo
          titleText={'Forget Password'}
          textStyle={{fontSize: hp('3%')}}
          containerStyle={styles.logoContainer}
        />
        <Text style={styles.registerTitleText}>
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
      </View>
      <View style={styles.footerContainer}>
        <PrimaryGradientButton
          buttonStyle={styles.registerButtonText}
          text={
            isSubmitting ? (
              <ActivityIndicator color={colors.white} size={'small'} />
            ) : (
              'Sign In'
            )
          }
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