import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Keyboard, Platform, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';

import {resetPasswordSchema} from '../../Utils';
import {ROUTES} from '../../Navigation/ROUTES';
import {colors} from '../../Assets/Styles';
import {HARDWARE_BACK_PRESS, Platforms} from '../../Constants';
import {ResetPasswordScreen} from '../../Screens';
import {showToast} from '../../Store/Actions';
import {resetPassword} from '../../services/authServices';

const {OS} = Platform;
const {ANDROID} = Platforms;
const {WELCOME, FORGET_PASSWORD, SIGN_IN} = ROUTES;
const {gray, white, cobaltBlueLight} = colors;

const ResetPasswordContainer = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {canGoBack, goBack, navigate} = navigation;
  const email = route?.params?.email;
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [isKeyboardActive, setKeyboardActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const initialValues = {
    verificationCode: '',
    password: '',
    confirmPassword: '',
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
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
  function handleKeyboardDidShow() {
    setKeyboardActive(true);
  }
  function handleKeyboardDidHide() {
    setKeyboardActive(false);
  }

  const handlePasswordFocus = () => passwordRef?.current?.focus();
  const handleConfirmPasswordFocus = () => confirmPasswordRef?.current?.focus();
  // Focus handling ends here
  const hidePasswordHandler = () => setHidePassword(!hidePassword);
  const hideConfirmPasswordHandler = () =>
    setHideConfirmPassword(!hideConfirmPassword);
  const handleForgetPassword = () => navigate(FORGET_PASSWORD);
  const handleResetPassword = async (body, resetForm) => {
    let {verificationCode, password, confirmPassword} = body;

    await resetPassword(verificationCode, confirmPassword, email, password)
      .then(response => onResetPasswordSuccess(response, resetForm))
      .catch(onResetPasswordFail)
      .finally(() => setIsSubmitting(false));
  };
  function onResetPasswordSuccess(response, resetForm) {
    resetForm();
    navigate(SIGN_IN, {
      toastMessage: 'Your password has been changed successfully',
      passwordChanged: true,
    });
  }
  function onResetPasswordFail(err) {
    const {errors = 'Failed to reset password'} = err?.response?.data;
    const message = errors || 'Something went wrong, Please try again.';
    dispatch(showToast(message, 'error'));
  }
  const handleKnowYourPassword = () => navigate(SIGN_IN);
  const handleNavigationBackPress = () => goBack();
  function onSubmit(values, resetForm) {
    setIsSubmitting(true);
    handleResetPassword(values, resetForm).then();
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
      onSubmit={(values, {resetForm}) => onSubmit(values, resetForm)}>
      {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
        <ResetPasswordScreen
          values={values}
          handleChange={handleChange}
          emailRef={emailRef}
          passwordRef={passwordRef}
          confirmPasswordRef={confirmPasswordRef}
          handlePasswordFocus={handlePasswordFocus}
          handleConfirmPasswordFocus={handleConfirmPasswordFocus}
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
          hidePasswordHandler={hidePasswordHandler}
          hideConfirmPasswordHandler={hideConfirmPasswordHandler}
          hidePassword={hidePassword}
          handleForgetPassword={handleForgetPassword}
          hideConfirmPassword={hideConfirmPassword}
          handleKnowYourPassword={handleKnowYourPassword}
          handleNavigationBackPress={handleNavigationBackPress}
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
    flex: OS === ANDROID ? 2 : 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
  },
  registerTitleText: {
    paddingHorizontal: wp('2%'),
    fontSize: hp('2.2%'),
    color: gray,
  },
  bodyContainer: {
    flex: 1,
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
    flex: 0.3,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-end',
  },
  registerTitleText: {
    paddingHorizontal: wp('2%'),
    fontSize: hp('2.2%'),
    color: gray,
  },
  bodyContainer: {
    flex: 1.5,
    // flex: 0.9,
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
export default ResetPasswordContainer;
