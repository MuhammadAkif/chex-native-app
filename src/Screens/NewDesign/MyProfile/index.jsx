import {StatusBar, View} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {CardWrapper, CustomInput, IconWrapper, LoadingIndicator, LogoHeader, PhoneInput, PrimaryGradientButton} from '../../../Components';
import {useDispatch, useSelector} from 'react-redux';
import {STACKS} from '../../../Navigation/ROUTES';
import {Logout} from '../../../Assets/Icons';
import {colors} from '../../../Assets/Styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import AppText from '../../../Components/text';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import {signOut} from '../../../Store/Actions';
import api from '../../../services/api';
import {API_ENDPOINTS} from '../../../Constants';
import authReducer from '../../../Store/Reducers/AuthReducer';

const validate = values => {
  const errors = {};

  if (!values?.name?.trim?.()) {
    errors.name = 'First name is required';
  }

  if (!values?.lastName?.trim?.()) {
    errors.lastName = 'Last name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^\d{10,15}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Phone number must be between 10–15 digits';
  }

  return errors;
};

const MyProfile = ({navigation}) => {
  const userState = useSelector(state => state?.auth?.user?.data);
  const [isLoading, setIsLoading] = useState(false);
  const initialData = {
    name: userState?.name,
    lastName: userState?.lastName,
    email: userState?.email,
    phoneNumber: userState?.phone?.replace(/\D/g, '').slice(-10),
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    navigation.replace(STACKS.AUTH_STACK);

    setTimeout(() => {
      dispatch(signOut());
    }, 100);
  };

  const handleSubmitForm = (values, {setSubmitting, resetForm}) => {
    setSubmitting(false);

    updateProfileAPI(values);
  };

  const updateProfileAPI = async data => {
    try {
      setIsLoading(true);
      const response = await api.patch(API_ENDPOINTS.UPDATE_MY_PROFILE, data);
      setIsLoading(false);

      const user = response?.data?.user;
      const token = response?.data?.token;
      if (response?.status === 200 && user && token) {
        dispatch({type: 'UPDATE_USER', payload: {data: user, token}});
      }
    } catch (error) {
      setIsLoading(false);
      console.log('ERROR:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LoadingIndicator isLoading={isLoading} />
      <View style={styles.blueHeaderContainer}>
        <LogoHeader
          showLeft={false}
          onRightPress={handleLogout}
          rightIcon={
            <IconWrapper>
              <Logout width={22} height={22} color={colors.white} />
            </IconWrapper>
          }
        />
      </View>
      <View style={styles.cardWrapper}>
        <CardWrapper style={styles.whiteContainerContent}>
          <KeyboardAwareScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
            style={styles.scrollContainer}>
            <View style={styles.infoContainer}>
              <AppText fontSize={wp(4.5)} fontWeight={'600'}>
                User Profile
              </AppText>
            </View>

            <Formik initialValues={initialData} validate={validate} onSubmit={handleSubmitForm}>
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                submitCount,
                setFieldError,
                setFieldTouched,
              }) => {
                return (
                  <>
                    <View style={styles.inputsContainer}>
                      <CustomInput
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={'#BDBDBD'}
                        inputStyle={styles.input}
                        placeholder="Enter First Name"
                        label="First Name"
                        value={values.name}
                        onChangeText={handleChange}
                        onBlur={handleBlur}
                        valueName="name"
                        touched={touched.name}
                        error={errors.name}
                        maxLength={100}
                      />

                      <CustomInput
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={'#BDBDBD'}
                        inputStyle={styles.input}
                        placeholder="Enter Last Name"
                        label="Last Name"
                        value={values.lastName}
                        onChangeText={handleChange}
                        onBlur={handleBlur}
                        valueName="lastName"
                        touched={touched.lastName}
                        error={errors.lastName}
                        maxLength={100}
                      />

                      <CustomInput
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={'#BDBDBD'}
                        inputStyle={styles.input}
                        placeholder="Enter Email"
                        label="Email"
                        value={values.email}
                        onChangeText={handleChange}
                        onBlur={handleBlur}
                        valueName="email"
                        touched={touched.email}
                        error={errors.email}
                        editable={false}
                      />

                      <PhoneInput
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={'#BDBDBD'}
                        inputStyle={styles.input}
                        placeholder="Enter Phone"
                        label="Phone"
                        value={values.phoneNumber}
                        onChangeText={(masked, unmasked) => {
                          setFieldValue('phoneNumber', unmasked);
                        }}
                        onBlur={e => {
                          setFieldTouched('phoneNumber', true, true);
                        }}
                        valueName="phoneNumber"
                        touched={touched.phoneNumber}
                        error={errors.phoneNumber}
                        maxLength={50}
                      />
                    </View>
                    <PrimaryGradientButton onPress={handleSubmit} text="Update Profile" buttonStyle={styles.nextButton} />
                  </>
                );
              }}
            </Formik>
          </KeyboardAwareScrollView>
        </CardWrapper>
      </View>
    </View>
  );
};

export default MyProfile;
