import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Keyboard, Platform, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {ForgotPasswordScreen} from '../../Screens';
import {forgetPasswordSchema} from '../../Utils';
import {ROUTES} from '../../Navigation/ROUTES';
import {colors} from '../../Assets/Styles';
import {HARDWARE_BACK_PRESS, Platforms} from '../../Constants';
import {forgotPassword} from '../../services/authServices';
import {useUIActions} from '../../hooks/UI';

const {OS} = Platform;
const {ANDROID} = Platforms;
const {cobaltBlueLight, gray, white} = colors;
const {WELCOME, RESET_PASSWORD, SIGN_IN} = ROUTES;

const ForgotPasswordContainer = ({navigation}) => {
  const {showToast} = useUIActions();
  const {canGoBack, goBack, navigate} = navigation;
  const emailRef = useRef();
  const [isKeyboardActive, setKeyboardActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValues = {
    email: '',
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
  // Add event listeners when the component mounts
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => handleKeyboard(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => handleKeyboard(false),
    );

    // Remove event listeners when the component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      goBack();
      return true;
    } else {
      navigate(WELCOME);
    }
    return false;
  }
  // Function to handle keyboard visibility changes
  function handleKeyboard(value) {
    setKeyboardActive(value);
  }
  const handleVerificationCodeSend = async (email, resetForm) => {
    await forgotPassword(email)
      .then(response =>
        onVerificationCodeSendSuccess(response, resetForm, email),
      )
      .catch(onVerificationCodeSendFail)
      .finally(() => setIsSubmitting(false));
  };
  function onVerificationCodeSendSuccess(response, resetForm, email) {
    const toastMessage = 'Verification code has been sent to your account';
    resetForm();
    showToast(toastMessage, 'success');
    navigate(RESET_PASSWORD, {
      email: email,
    });
  }
  function onVerificationCodeSendFail(response) {
    showToast('Email not found', 'error');
  }
  const handleKnowYourPassword = () => navigate(SIGN_IN);
  const handleOnPress = () => Keyboard.dismiss();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgetPasswordSchema}
      onSubmit={(values, {resetForm}) => {
        setIsSubmitting(true);
        handleVerificationCodeSend(values.email, resetForm).then();
      }}>
      {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
        <ForgotPasswordScreen
          values={values}
          handleChange={handleChange}
          emailRef={emailRef}
          handleSubmit={handleSubmit}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          styles={
            OS === ANDROID && isKeyboardActive
              ? androidKeyboardOpenStyle
              : styles
          }
          isKeyboardActive={isKeyboardActive}
          isSubmitting={isSubmitting}
          handleKnowYourPassword={handleKnowYourPassword}
          handleOnPress={handleOnPress}
        />
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cobaltBlueLight,
  },
  headerContainer: {
    flex: OS === ANDROID ? 2 : 1.5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-end',
  },
  registerTitleText: {
    fontSize: hp('2.5%'),
    color: gray,
  },
  bodyContainer: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  footerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  termsText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  registerButtonText: {
    borderRadius: 30,
  },
  footerEmptyView: {
    flex: 0.5,
  },
  termsOfUseContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    alignItems: 'center',
  },
  checkBox: {
    height: hp('3%'),
    width: wp('6.5%'),
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: white,
    marginRight: 5,
  },
  termsOfUseText: {
    fontSize: hp('1.8%'),
    color: white,
  },
  text: {
    fontSize: hp('1.8%'),
    color: white,
  },
  forgetPasswordContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotPasswordText: {
    color: white,
    textDecorationLine: 'underline',
  },
});

const androidKeyboardOpenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cobaltBlueLight,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-end',
  },
  registerTitleText: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: white,
  },
  bodyContainer: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  footerContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
  termsText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  registerButtonText: {
    borderRadius: 30,
  },
  footerEmptyView: {
    flex: 0.5,
  },
  termsOfUseContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    alignItems: 'center',
  },
  checkBox: {
    height: hp('3%'),
    width: wp('6.5%'),
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: white,
    marginRight: 5,
  },
  termsOfUseText: {
    fontSize: hp('1.8%'),
    color: white,
  },
  text: {
    fontSize: hp('1.8%'),
    color: white,
  },
  forgetPasswordContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default ForgotPasswordContainer;
