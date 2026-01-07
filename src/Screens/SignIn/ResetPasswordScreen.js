import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { BackgroundImageView, PrimaryGradientButton, InputFieldRequiredError, SignInLogo } from '../../Components';
import CustomInput from '../../Components/CustomInput';
import { colors, PreviewStyles } from '../../Assets/Styles';
import CustomPasswordInput from '../../Components/CustomPasswordInput';
import { Platforms } from '../../Constants';
import { BackArrow } from '../../Assets/Icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const { OS } = Platform;
const { ANDROID, IOS } = Platforms;
const { white } = colors;
const { headerContainer } = PreviewStyles;

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
}) => {
  const { t } = useTranslation();

  return (
    <BackgroundImageView>
      <View style={[headerContainer, styles.container, { paddingTop: OS == 'ios' ? 35 : StatusBar.currentHeight + 15, flex: undefined }]}>
        <BackArrow height={hp('8%')} width={wp('8%')} color={white} onPress={handleNavigationBackPress} />
      </View>

      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container} keyboardShouldPersistTaps="always">
        <View
          style={{
            ...styles.headerContainer,
            flex: OS === ANDROID ? 1 : OS === IOS && isKeyboardActive ? 0.5 : OS === IOS ? 1 : 1.5,
          }}>
          <SignInLogo titleText={t('resetPassword.title')} textStyle={{ fontSize: hp('3%') }} containerStyle={styles.logoContainer} />
          <Text
            style={{
              ...styles.registerTitleText,
              bottom: OS === IOS && isKeyboardActive ? hp('1%') : 0,
            }}>
            {t('resetPassword.subtitle')}
          </Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.inputAndErrorTextContainer}>
            <CustomInput
              ref={emailRef}
              value={values?.verificationCode}
              onChangeText={handleChange}
              onBlur={handleBlur}
              valueName={'verificationCode'}
              placeholder={t('resetPassword.verificationCodePlaceholder')}
              onSubmitEditing={handlePasswordFocus}
            />
            <InputFieldRequiredError touched={touched.verificationCode} error={errors.verificationCode} />
          </View>

          <View style={styles.inputAndErrorTextContainer}>
            <CustomPasswordInput
              ref={passwordRef}
              value={values?.password}
              onChangeText={handleChange}
              onBlur={handleBlur}
              valueName={'password'}
              placeholder={t('common.password')}
              secureTextEntry={hidePassword}
              enterKeyHint={'done'}
              hidePasswordHandler={hidePasswordHandler}
              isPasswordHidden={hidePassword}
              onSubmitEditing={handleConfirmPasswordFocus}
              maxLength={20}
            />
            <InputFieldRequiredError touched={touched.password} error={errors.password} />
          </View>
          <View style={styles.inputAndErrorTextContainer}>
            <CustomPasswordInput
              ref={confirmPasswordRef}
              value={values?.confirmPassword}
              onChangeText={handleChange}
              onBlur={handleBlur}
              valueName={'confirmPassword'}
              placeholder={t('common.confirmPassword')}
              secureTextEntry={hideConfirmPassword}
              enterKeyHint={'done'}
              hidePasswordHandler={hideConfirmPasswordHandler}
              isPasswordHidden={hideConfirmPassword}
              onSubmitEditing={handleSubmit}
              maxLength={20}
            />
            <InputFieldRequiredError touched={touched.confirmPassword} error={errors.confirmPassword} />
          </View>

          <TouchableOpacity onPress={handleKnowYourPassword} disabled={isSubmitting} style={styles.forgetPasswordContainer}>
            <Text style={{ color: white, fontSize: hp('1.8%') }} disabled={isSubmitting}>
              {t('forgotPassword.knowPassword')}{' '}
              <Text style={styles.forgotPasswordText} disabled={isSubmitting}>
                {t('forgotPassword.loginLink')}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <PrimaryGradientButton buttonStyle={styles.registerButtonText} text={t('common.reset')} onPress={handleSubmit} disabled={isSubmitting} />
        </View>
      </KeyboardAwareScrollView>
    </BackgroundImageView>
  );
};

export default ResetPasswordScreen;
