import React from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

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
        <View style={styles.forgetPasswordContainer} />
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
  </BackgroundImageView>
);

export default SignInScreen;
