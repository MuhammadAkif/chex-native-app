import React from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {BackgroundImageView, PrimaryGradientButton, InputFieldRequiredError, SignInLogo} from '../../Components';
import CustomInput from '../../Components/CustomInput';
import CustomPasswordInput from '../../Components/CustomPasswordInput';
import {Platforms, PROJECT_NAME} from '../../Constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

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
}) => {
  return (
    <BackgroundImageView>
      <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}} style={styles.container} keyboardShouldPersistTaps="always">
        <View style={[styles.headerContainer]}>
          <SignInLogo
            titleText={PROJECT_NAME.CHEX}
            dotTitleText={PROJECT_NAME.AI}
            subtitleText={'Virtual Inspections'}
            containerStyle={styles.logoContainer}
          />
          <Text style={styles.registerTitleText}>Sign in</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.inputAndErrorTextContainer}>
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
          </View>

          <View style={styles.inputAndErrorTextContainer}>
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
            <InputFieldRequiredError touched={touched.password} error={errors.password} />
          </View>

          <TouchableOpacity onPress={handleForgetPassword} style={styles.forgetPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <PrimaryGradientButton buttonStyle={styles.registerButtonText} text={'Sign In'} onPress={handleSubmit} disabled={isSubmitting} />
        </View>
      </KeyboardAwareScrollView>
    </BackgroundImageView>
  );
};

export default SignInScreen;
