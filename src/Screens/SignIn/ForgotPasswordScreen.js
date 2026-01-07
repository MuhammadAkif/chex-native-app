import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BackgroundImageView, PrimaryGradientButton, InputFieldRequiredError, SignInLogo } from '../../Components';
import CustomInput from '../../Components/CustomInput';
import { colors } from '../../Assets/Styles';
import { Platforms } from '../../Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const { OS } = Platform;
const { ANDROID } = Platforms;
const { white } = colors;

const ForgetPasswordScreen = ({
  values,
  handleChange,
  emailRef,
  handleSubmit,
  handleBlur,
  errors,
  touched,
  styles,
  isKeyboardActive,
  isSubmitting,
  handleKnowYourPassword,
  handleOnPress,
}) => {
  const { t } = useTranslation();
  const flex = OS === ANDROID ? 2 : isKeyboardActive ? 1 : 1.5;

  return (
    <BackgroundImageView>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container} keyboardShouldPersistTaps="always">
        <View
          style={{
            ...styles.headerContainer,
            flex: flex,
          }}>
          <SignInLogo titleText={t('forgotPassword.title')} textStyle={{ fontSize: hp('3%') }} containerStyle={styles.logoContainer} />
          <Text style={styles.registerTitleText}>{t('forgotPassword.subtitle')}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.inputAndErrorTextContainer}>
            <CustomInput
              ref={emailRef}
              value={values?.email}
              onChangeText={handleChange}
              onBlur={handleBlur}
              valueName={'email'}
              placeholder={t('common.email')}
              onSubmitEditing={handleSubmit}
            />
            <InputFieldRequiredError touched={touched.email} error={errors.email} />
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
          <PrimaryGradientButton buttonStyle={styles.registerButtonText} text={t('common.submit')} onPress={handleSubmit} disabled={isSubmitting} />
        </View>
      </KeyboardAwareScrollView>
    </BackgroundImageView>
  );
};

export default ForgetPasswordScreen;
