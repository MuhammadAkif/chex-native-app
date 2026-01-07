import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { BackgroundImageView, PrimaryGradientButton, InputFieldRequiredError, SignInLogo } from '../../Components';
import CustomInput from '../../Components/CustomInput';
import CustomPasswordInput from '../../Components/CustomPasswordInput';
import { PROJECT_NAME } from '../../Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

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
  const { t } = useTranslation();

  return (
    <BackgroundImageView>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container} keyboardShouldPersistTaps="always">
        <View style={[styles.headerContainer]}>
          <SignInLogo
            titleText={PROJECT_NAME.CHEX}
            dotTitleText={PROJECT_NAME.AI}
            subtitleText={t('welcome.subtitle')}
            containerStyle={styles.logoContainer}
          />
          <Text style={styles.registerTitleText}>{t('signIn.title')}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.inputAndErrorTextContainer}>
            <CustomInput
              ref={emailRef}
              value={values?.name}
              onChangeText={handleChange}
              onBlur={handleBlur}
              valueName={'name'}
              placeholder={t('signIn.namePlaceholder')}
              onSubmitEditing={handlePasswordFocus}
              maxLength={100}
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
              maxLength={20}
            />
            <InputFieldRequiredError touched={touched.password} error={errors.password} />
          </View>

          <TouchableOpacity onPress={handleForgetPassword} style={styles.forgetPasswordContainer}>
            <Text style={styles.forgotPasswordText}>{t('signIn.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <PrimaryGradientButton buttonStyle={styles.registerButtonText} text={t('common.signIn')} onPress={handleSubmit} disabled={isSubmitting} />
        </View>
      </KeyboardAwareScrollView>
    </BackgroundImageView>
  );
};

export default SignInScreen;
