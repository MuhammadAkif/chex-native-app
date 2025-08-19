import React, {useEffect, useRef, useState} from 'react';
import {Alert, BackHandler, Keyboard, Platform, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {SignInScreen} from '../../Screens';
import {signInValidationSchema} from '../../Utils';
import {ROUTES} from '../../Navigation/ROUTES';
import {colors} from '../../Assets/Styles';
import {HARDWARE_BACK_PRESS, Platforms} from '../../Constants';
import {showToast, signIn} from '../../Store/Actions';
import {CommonActions} from '@react-navigation/native';
import {useKeyboard} from '../../hooks/useKeyboard';

const {OS} = Platform;
const {ANDROID} = Platforms;
const {WELCOME, FORGET_PASSWORD, HOME} = ROUTES;
const {white, cobaltBlueLight} = colors;

const SignInContainer = ({navigation, route}) => {
  const {canGoBack, goBack, navigate} = navigation;
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();
  const {keyboardShown} = useKeyboard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const initialValues = {
    name: '',
    password: '',
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, handle_Hardware_Back_Press);
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

  // Focus handling starts here
  const handlePasswordFocus = () => passwordRef?.current?.focus();
  // Focus handling ends here
  const hidePasswordHandler = () => setHidePassword(!hidePassword);
  const handleForgetPassword = () => navigate(FORGET_PASSWORD);
  const checkUserData = async (body, resetForm) => {
    const {username, password} = body;

    dispatch(signIn(username, password))
      .then(res => onCheckUserDataSuccess(resetForm))
      .catch(onCheckUserDataFail)
      .finally(() => setIsSubmitting(false));
  };
  function onCheckUserDataSuccess(resetForm) {
    resetForm();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: HOME}],
      }),
    );
  }
  function onCheckUserDataFail(err) {
    const {errors = null} = err?.response?.data;
    const isWrongPassword = errors[0] === 'password is  incorrect';
    if (isWrongPassword) {
      Alert.alert('Login Failed', 'Wrong password. Please try again.');
    } else {
      Alert.alert('Login Failed', errors[0]);
    }
  }
  function onSubmit(values, resetForm) {
    setIsSubmitting(true);
    Keyboard.dismiss();

    let body = {
      username: values.name.trim(),
      password: values.password.trim(),
    };
    checkUserData(body, resetForm).then();
  }
  return (
    <Formik initialValues={initialValues} validationSchema={signInValidationSchema} onSubmit={(values, {resetForm}) => onSubmit(values, resetForm)}>
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
          styles={OS === ANDROID && keyboardShown ? androidKeyboardOpenStyle : styles}
          isKeyboardActive={keyboardShown}
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
    flex: OS === ANDROID ? 2 : 1.5,
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
