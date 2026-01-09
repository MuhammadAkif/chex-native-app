import {StatusBar, View} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styles} from './styles';
import {CardWrapper, CustomInput, IconWrapper, LoadingIndicator, LogoHeader, PhoneInput, PrimaryGradientButton} from '../../../Components';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES, STACKS} from '../../../Navigation/ROUTES';
import {Logout} from '../../../Assets/Icons';
import {colors} from '../../../Assets/Styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import AppText from '../../../Components/text';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import {showToast, signOut} from '../../../Store/Actions';
import api from '../../../services/api';
import {API_ENDPOINTS} from '../../../Constants';
import {useFocusEffect} from '@react-navigation/native';
import {Types} from '../../../Store/Types';
import smartlookService from '../../../services/smartlookService';

const validate = (values, t) => {
  const errors = {};

  if (!values?.name?.trim?.()) {
    errors.name = t('profile.errors.firstNameRequired');
  }

  if (!values?.lastName?.trim?.()) {
    errors.lastName = t('profile.errors.lastNameRequired');
  }

  if (!values.email.trim()) {
    errors.email = t('profile.errors.emailRequired');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = t('profile.errors.invalidEmail');
  }

  const cleanedPhone = values?.phone.replace(/\D/g, '');

  if (!cleanedPhone.trim()) {
    errors.phone = t('profile.errors.phoneRequired');
  } else if (!/^\d{10,15}$/.test(cleanedPhone)) {
    errors.phone = t('profile.errors.phoneDigits');
  }

  return errors;
};

const MyProfile = ({navigation}) => {
  const {t} = useTranslation();
  const userState = useSelector(state => state?.auth?.user?.data);
  const [isLoading, setIsLoading] = useState(false);
  const initialData = {
    name: userState?.name,
    lastName: userState?.lastName,
    email: userState?.email,
    phone: userState?.phone?.replace(/\D/g, '').slice(-10),
  };

  const dispatch = useDispatch();

  // Track whether user left the screen with unsaved (dirty) form changes
  const wasDirtyRef = useRef(false);
  // Keep latest Formik helpers available to focus/blur effects
  const formikHelpersRef = useRef({resetForm: null, dirty: false});

  const handleLogout = () => {
    navigation.replace(STACKS.AUTH_STACK);

    setTimeout(() => {
      smartlookService.resetUser();
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
        dispatch(showToast(t('profile.profileUpdatedToast'), 'success'));
        dispatch({type: Types.UPDATE_USER, payload: {data: user, token}});
        // Reinitialize Formik with latest saved values from API
        const updatedInitialData = {
          name: user?.name,
          lastName: user?.lastName,
          email: user?.email,
          phone: user?.phone?.replace(/\D/g, '').slice(-10),
        };
        if (formikHelpersRef.current?.resetForm) {
          formikHelpersRef.current.resetForm({values: updatedInitialData});
          wasDirtyRef.current = false;
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('ERROR:', error);
    }
  };

  // On focus, if we previously left with dirty changes, reset to initial values
  useFocusEffect(
    useCallback(() => {
      if (wasDirtyRef.current && formikHelpersRef.current?.resetForm && !isLoading) {
        formikHelpersRef.current.resetForm({values: initialData});
        wasDirtyRef.current = false;
      }

      // On blur, remember if the form was dirty
      return () => {
        wasDirtyRef.current = !!formikHelpersRef.current?.dirty;
      };
    }, [initialData])
  );

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
                {t('profile.title')}
              </AppText>
            </View>

            <Formik initialValues={initialData} validate={values => validate(values, t)} onSubmit={handleSubmitForm}>
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
                resetForm,
                dirty,
              }) => {
                // Keep helpers fresh for focus/blur effects
                formikHelpersRef.current = {resetForm, dirty};
                return (
                  <>
                    <View style={styles.inputsContainer}>
                      <CustomInput
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={'#BDBDBD'}
                        inputStyle={styles.input}
                        placeholder={t('profile.firstNamePlaceholder')}
                        label={t('profile.firstNameLabel')}
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
                        placeholder={t('profile.lastNamePlaceholder')}
                        label={t('profile.lastNameLabel')}
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
                        placeholder={t('profile.emailPlaceholder')}
                        label={t('profile.emailLabel')}
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
                        placeholder={t('profile.phonePlaceholder')}
                        label={t('profile.phoneLabel')}
                        value={values.phone}
                        onChangeText={(masked, unmasked) => {
                          setFieldValue('phone', masked, true);
                        }}
                        onBlur={e => {
                          setFieldTouched('phone', true, true);
                        }}
                        valueName="phone"
                        touched={touched.phone}
                        error={errors.phone}
                        maxLength={50}
                      />
                    </View>
                    <PrimaryGradientButton
                      onPress={handleSubmit}
                      text={t('profile.updateProfileButton')}
                      buttonStyle={styles.nextButton}
                      buttonDisabled={!dirty}
                    />
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
