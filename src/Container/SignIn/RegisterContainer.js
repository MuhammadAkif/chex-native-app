import React, {useRef, useState} from 'react';
import {Alert} from 'react-native';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';

import {RegisterScreen} from '../../Screens';
import {validationSchema} from '../../Utils';

const RegisterContainer = () => {
  const navigation = useNavigation();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const passwordRef = useRef();
  const [isTermsSelected, setIsTermsSelected] = useState(false);
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  };

  // Focus handling starts here
  const handleLastNameFocus = () => lastNameRef?.current?.focus();
  const handleEmailFocus = () => emailRef?.current?.focus();
  const handlePhoneNumberFocus = () => phoneNumberRef?.current?.focus();
  const handlePasswordFocus = () => passwordRef?.current?.focus();
  // Focus handling ends here

  const handleIsTermsSelected = () => setIsTermsSelected(!isTermsSelected);
  const handleRegisterPress = (values, {isSubmitting, resetForm}) => {
    if (!isTermsSelected) {
      Alert.alert('Sign Up Failed', 'Please Select Terms of Use');
      return;
    }
    console.log('Register Pressed');
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleRegisterPress}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <RegisterScreen
          values={values}
          handleChange={handleChange}
          firstNameRef={firstNameRef}
          lastNameRef={lastNameRef}
          emailRef={emailRef}
          phoneNumberRef={phoneNumberRef}
          passwordRef={passwordRef}
          handleLastNameFocus={handleLastNameFocus}
          handleEmailFocus={handleEmailFocus}
          handlePhoneNumberFocus={handlePhoneNumberFocus}
          handlePasswordFocus={handlePasswordFocus}
          handleSubmit={handleSubmit}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          handleIsTermsSelected={handleIsTermsSelected}
          isTermsSelected={isTermsSelected}
        />
      )}
    </Formik>
  );
};

export default RegisterContainer;
