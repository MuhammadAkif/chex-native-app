import React, {useEffect, useRef, useState} from 'react';
import {Alert, BackHandler, Keyboard, Platform, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import axios from 'axios';

import {SignInScreen} from '../../Screens';
import {signInValidationSchema} from '../../Utils';
import {ROUTES} from '../../Navigation/ROUTES';
import {colors} from '../../Assets/Styles';
import {ANDROID, API_ENDPOINTS, HARDWARE_BACK_PRESS} from '../../Constants';
import {showToast, signIn} from '../../Store/Actions';

const {LOGIN_URL} = API_ENDPOINTS;
const {WELCOME, FORGET_PASSWORD, HOME} = ROUTES;
const {white, cobaltBlueLight} = colors;
const SignInContainer = ({navigation, route}) => {
  const {canGoBack, goBack, navigate} = navigation;
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isKeyboardActive, setKeyboardActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const initialValues = {
    name: '',
    password: '',
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (route.params) {
      dispatch(showToast(route?.params?.toastMessage, 'success'));
    }
  }, [route.params]);

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
  const handleForgetPassword = () => navigate(FORGET_PASSWORD);
  const checkUserData = async (body, resetForm) => {
    axios
      .post(LOGIN_URL, {
        username: body.username,
        password: body.password,
      })
      .then(response => {
        dispatch(signIn(response.data));
        resetForm();
        navigate(HOME);
      })
      .catch(err => {
        const isWrongPassword =
          err?.response?.data?.errors[0] === 'password is  incorrect';
        if (isWrongPassword) {
          Alert.alert('Login Failed', 'Wrong password. Please try again.');
        } else {
          Alert.alert('Login Failed', err?.response?.data?.errors[0]);
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signInValidationSchema}
      onSubmit={(values, {resetForm}) => {
        setIsSubmitting(true);
        let body = {
          username: values.name.trim(),
          password: values.password.trim(),
        };
        checkUserData(body, resetForm).then();
      }}>
      {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
        <SignInScreen
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
          handleForgetPassword={handleForgetPassword}
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
    flex: Platform.OS === ANDROID ? 2 : 1.5,
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
    flex: 0.1,
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
    flex: 1.5,
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
  forgotPasswordText: {
    color: white,
    textDecorationLine: 'underline',
  },
});

export default SignInContainer;
