import React, {useEffect, useRef, useState} from 'react';
import {Alert, Keyboard, Platform, StyleSheet} from 'react-native';
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
import {baseURL, loginURL} from '../../Constants';
import {SIGN_IN_ACTION} from '../../Store/Actions';

const SignInContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isKeyboardActive, setKeyboardActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValues = {
    name: '',
    password: '',
  };

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
    };
  }, []);
  // Focus handling starts here
  const handlePasswordFocus = () => passwordRef?.current?.focus();
  // Focus handling ends here
  const checkUserData = async (body, resetForm) => {
    axios
      .post(loginURL, {
        username: body.username,
        password: body.password,
      })
      .then(response => {
        setIsSubmitting(false);
        dispatch(SIGN_IN_ACTION(response.data));
        resetForm();
        navigation.navigate(ROUTES.HOME);
      })
      .catch(err => {
        setIsSubmitting(false);
        Alert.alert('Login Failed', err?.response?.data?.errors[0]);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signInValidationSchema}
      onSubmit={(values, {resetForm}) => {
        setIsSubmitting(true);
        let body = {
          username: values.name,
          password: values.password,
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
            Platform.OS === 'android' && isKeyboardActive
              ? androidKeyboardOpenStyle
              : styles
          }
          isKeyboardActive={isKeyboardActive}
          isSubmitting={isSubmitting}
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
    flex: Platform.OS === 'android' ? 2 : 1.5,
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

export default SignInContainer;
