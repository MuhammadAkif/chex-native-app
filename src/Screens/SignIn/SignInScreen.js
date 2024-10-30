import React from 'react';
import {View, Text, Platform, TouchableOpacity, Keyboard} from 'react-native';

import {
  BackgroundImageView,
  PrimaryGradientButton,
  InputFieldRequiredError,
  SignInLogo,
} from '../../Components';
import CustomInput from '../../Components/CustomInput';
import CustomPasswordInput from '../../Components/CustomPasswordInput';
import {Platforms, PROJECT_NAME} from '../../Constants';

const {OS} = Platform;
const {ANDROID, IOS} = Platforms;

const SignInScreen = ({
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
            flex: OS === ANDROID ? 2 : OS === IOS && isKeyboardActive ? 1 : 1.5,
          },
        ]}>
        <SignInLogo
          titleText={PROJECT_NAME.CHEX}
          dotTitleText={PROJECT_NAME.AI}
          subtitleText={'Virtual Inspections'}
          containerStyle={styles.logoContainer}
        />
        <Text style={styles.registerTitleText}>Sign in</Text>
      </View>
      <View style={styles.bodyContainer}>
        <CustomInput
          ref={emailRef}
          value={values?.name}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'name'}
          placeholder={'John Doe'}
          onSubmitEditing={handlePasswordFocus}
        />
        <InputFieldRequiredError touched={touched.name} error={errors.name} />
        <CustomPasswordInput
          ref={passwordRef}
          value={values?.password}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'password'}
          placeholder={'********'}
          onSubmitEditing={handleSubmit}
          secureTextEntry={hidePassword}
          enterKeyHint={'done'}
          hidePasswordHandler={hidePasswordHandler}
          isPasswordHidden={hidePassword}
        />
        <InputFieldRequiredError
          touched={touched.password}
          error={errors.password}
        />
        <TouchableOpacity
          onPress={handleForgetPassword}
          style={styles.forgetPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forget Password</Text>
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
  </BackgroundImageView>
);

export default SignInScreen;
