import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Keyboard, Platform, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import axios from 'axios';

import {ForgotPasswordScreen} from '../../Screens';
import {forgetPasswordSchema} from '../../Utils';
import {ROUTES} from '../../Navigation/ROUTES';
import {colors} from '../../Assets/Styles';
import {ANDROID, API_ENDPOINTS, HARDWARE_BACK_PRESS} from '../../Constants';

const {FORGET_PASSWORD_URL} = API_ENDPOINTS;
const {WELCOME, RESET_PASSWORD, SIGN_IN} = ROUTES;

const ForgotPasswordContainer = ({navigation}) => {
  const {canGoBack, goBack, navigate} = navigation;
  const emailRef = useRef();
  const passwordRef = useRef();
  const modalMessageInitialState = {isVisible: false, message: '', error: ''};
  const [isKeyboardActive, setKeyboardActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [modalMessage, setModalMessage] = useState(modalMessageInitialState);
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
  useEffect(() => {
    let timeoutID = setTimeout(
      () => setModalMessage(modalMessageInitialState),
      5000,
    );
    return () => {
      clearTimeout(timeoutID);
    };
  }, [modalMessage]);
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
  const handleKeyboardDidShow = () => {
    setKeyboardActive(true);
  };

  const handleKeyboardDidHide = () => {
    setKeyboardActive(false);
  };

  // Add event listeners when the component mounts
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardDidHide,
    );

    // Remove event listeners when the component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      setHidePassword(true);
    };
  }, []);
  // Focus handling starts here
  const handlePasswordFocus = () => passwordRef?.current?.focus();
  // Focus handling ends here
  const hidePasswordHandler = () => setHidePassword(!hidePassword);
  const handleVerificationCodeSend = async (email, resetForm) => {
    axios
      .post(FORGET_PASSWORD_URL, {email: email})
      .then(response => {
        setIsSubmitting(false);
        resetForm();
        navigate(RESET_PASSWORD, {
          email: email,
          toastMessage: 'Verification code has been sent to your account',
        });
      })
      .catch(err => {
        setIsSubmitting(false);
        setModalMessage(prev => ({
          ...prev,
          isVisible: true,
          error: 'Email not found',
        }));
      });
  };
  const handleOkPress = () => setModalMessage(modalMessageInitialState);
  const handleKnowYourPassword = () => navigate(SIGN_IN);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgetPasswordSchema}
      onSubmit={(values, {resetForm}) => {
        setIsSubmitting(true);
        handleVerificationCodeSend(values.email, resetForm);
      }}>
      {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
        <ForgotPasswordScreen
          navigation={navigation}
          values={values}
          handleChange={handleChange}
          emailRef={emailRef}
          passwordRef={passwordRef}
          handlePasswordFocus={handlePasswordFocus}
          handleSubmit={handleSubmit}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          styles={
            Platform.OS === ANDROID && isKeyboardActive
              ? androidKeyboardOpenStyle
              : styles
          }
          isKeyboardActive={isKeyboardActive}
          isSubmitting={isSubmitting}
          hidePasswordHandler={hidePasswordHandler}
          hidePassword={hidePassword}
          modalMessage={modalMessage}
          handleOkPress={handleOkPress}
          handleKnowYourPassword={handleKnowYourPassword}
        />
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 27, 81, 0.8)',
  },
  headerContainer: {
    flex: Platform.OS === ANDROID ? 2 : 1.5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-end',
  },
  registerTitleText: {
    fontSize: hp('2.5%'),
    color: colors.gray,
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
    backgroundColor: colors.white,
    marginRight: 5,
  },
  termsOfUseText: {
    fontSize: hp('1.8%'),
    color: colors.white,
  },
  text: {
    fontSize: hp('1.8%'),
    color: colors.white,
  },
  forgetPasswordContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotPasswordText: {
    color: colors.white,
    textDecorationLine: 'underline',
  },
});

const androidKeyboardOpenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 27, 81, 0.8)',
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
    color: colors.white,
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
    backgroundColor: colors.white,
    marginRight: 5,
  },
  termsOfUseText: {
    fontSize: hp('1.8%'),
    color: colors.white,
  },
  text: {
    fontSize: hp('1.8%'),
    color: colors.white,
  },
  forgetPasswordContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default ForgotPasswordContainer;
