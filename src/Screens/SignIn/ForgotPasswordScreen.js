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
import {ANDROID} from '../../Constants';
import {Toast} from '../../Components';

const ForgetPasswordScreen = ({
  navigation,
  values,
  handleChange,
  emailRef,
  passwordRef,
  handlePasswordFocus,
  handleSubmit,
  handleBlur,
  errors,
  touched,
  styles,
  isKeyboardActive,
  isSubmitting,
  hidePasswordHandler,
  hidePassword,
  handleForgetPassword,
  modalMessage,
  handleOkPress,
  handleKnowYourPassword,
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
                ? 2
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
          Type Email for password reset
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <CustomInput
          ref={emailRef}
          value={values?.email}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'email'}
          placeholder={'Email'}
          onSubmitEditing={handleSubmit}
        />
        <InputFieldRequiredError touched={touched.email} error={errors.email} />
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
          text={
            isSubmitting ? (
              <ActivityIndicator color={colors.white} size={'small'} />
            ) : (
              'Submit'
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

export default ForgetPasswordScreen;
