import React from 'react';
import {View, Text} from 'react-native';

import {
  BackgroundImageView,
  PrimaryGradientButton,
  InputFieldRequiredError,
  SignInLogo,
} from '../../Components';
import CustomInput from '../../Components/CustomInput';

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
  handleRegisterPress,
  handleForgetPasswordPress,
  styles,
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
          // keyboardType={'email-address'}
        />
        <InputFieldRequiredError touched={touched.name} error={errors.name} />
        <CustomInput
          ref={passwordRef}
          value={values?.password}
          onChangeText={handleChange}
          onBlur={handleBlur}
          valueName={'password'}
          placeholder={'********'}
          onSubmitEditing={handleSubmit}
          secureTextEntry={true}
          enterKeyHint={'done'}
        />
        <InputFieldRequiredError
          touched={touched.password}
          error={errors.password}
        />
        <View
          style={styles.forgetPasswordContainer}
          onTouchStart={handleForgetPasswordPress}>
          <Text style={styles.text}>Forget Password?</Text>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <PrimaryGradientButton
          buttonStyle={styles.registerButtonText}
          text={'Sign In'}
          onPress={handleSubmit}
        />
        <Text style={styles.text}>
          Don't have an account?
          <Text onPress={handleRegisterPress}> Register</Text>
        </Text>
      </View>
    </View>
  </BackgroundImageView>
);

export default SignInScreen;
