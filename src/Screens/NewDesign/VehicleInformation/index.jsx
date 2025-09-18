import {View, StatusBar, ScrollView, Image, Pressable, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {styles} from './styles';
import {
  CardWrapper,
  CustomInput,
  DiscardInspectionModal,
  IconWrapper,
  LoadingIndicator,
  LogoHeader,
  PrimaryGradientButton,
  SecondaryButton,
} from '../../../Components';
import AppText from '../../../Components/text';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../Assets/Styles';
import {IMAGES} from '../../../Assets/Images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {BellWhiteIcon, CameraOutlineIcon, CircleTickIcon} from '../../../Assets/Icons';
import {Formik} from 'formik';
import {VEHICLE_TYPES} from '../../../Constants';
import {createInspection, getVehicleInformationAgainstLicenseId} from '../../../services/inspection';
import useDebounce from '../../../hooks/useDebounce';
import {ROUTES, TABS} from '../../../Navigation/ROUTES';
import {useDispatch, useSelector} from 'react-redux';
import {file_Details, numberPlateSelected, setCompanyId, setVehicleType} from '../../../Store/Actions';
import {handle_Session_Expired, OdometerDetails, onNewInspectionPressSuccess} from '../../../Utils';
import {navigate} from '../../../services/navigationService';
import {useIsFocused, useRoute} from '@react-navigation/native';

const validate = values => {
  const errors = {};
  if (!values.licensePlateNumber.trim()) {
    errors.licensePlateNumber = 'Truck ID/License Plate is required';
  }
  if (!values.mileage.trim()) {
    errors.mileage = 'Mileage is required';
  } else if (isNaN(values.mileage) || Number(values.mileage) < 0) {
    errors.mileage = 'Mileage must be a positive number';
  }
  if (!values.vin.trim()) {
    errors.vin = 'VIN is required';
  }
  return errors;
};

const intialData = {
  licensePlateNumber: '',
  mileage: '',
  vin: '',
  vehicleType: '',
};

const VehicleTypes = [
  {id: VEHICLE_TYPES.VAN, name: 'VAN', image: IMAGES.Van},
  {id: VEHICLE_TYPES.TRUCK, name: 'TRUCK', image: IMAGES.Truck},
  {id: VEHICLE_TYPES.SEDAN, name: 'SEDAN', image: IMAGES.Sedan},
  {id: VEHICLE_TYPES.OTHER, name: 'OTHER', image: IMAGES.other_vehicle},
];

const VehicleInformation = props => {
  const {navigation} = props;
  const authState = useSelector(state => state?.auth);
  const dispatch = useDispatch();
  const route = useRoute();
  const user = authState?.user?.data;
  const companyId = user?.companyId;
  const [showVehicleType, setShowVehicleType] = useState(false);
  const [hasApiDetectedVehicleType, setHasApiDetectedVehicleType] = useState(false);
  const [isFetchingVehicleInfo, setIsFetchingVehicleInfo] = useState(false);
  const [isInspectionInProgressModalVisible, setIsInspectionInProgressModalVisible] = useState(false);
  const [errorModalDetail, setErrorModalDetail] = useState({title: '', message: '', inspectionId: ''});
  const [isLoading, setIsLoading] = useState(false);
  const vehicleTypesScrollRef = useRef(null);
  const isScreenFocused = useIsFocused();

  // Dimensions used to calculate scroll offset (keep in sync with styles.js)
  const VEHICLE_ITEM_WIDTH = wp(38);
  const VEHICLE_ITEM_GAP = 10;

  useEffect(() => {
    if (route?.params?.isMileageCapture && isScreenFocused) {
      const {isLicensePlate, isOdometer, displayAnnotation, fileId, annotationDetails, is_Exterior, routeName} = route.params;
      console.log('ROUTE:', route?.params);
    }
  }, [route, isScreenFocused]);

  const scrollToVehicleType = useCallback(
    typeId => {
      const index = VehicleTypes.findIndex(v => v.id === typeId);
      if (index < 0) return;
      const x = index * (VEHICLE_ITEM_WIDTH + VEHICLE_ITEM_GAP);
      vehicleTypesScrollRef.current?.scrollTo({x, y: 0, animated: true});
    },
    [VEHICLE_ITEM_GAP, VEHICLE_ITEM_WIDTH]
  );

  const handleSubmitForm = (values, {setSubmitting, resetForm}) => {
    setSubmitting(false);

    setIsLoading(true);
    createInspection(companyId, values)
      .then(response => {
        dispatch(setCompanyId(companyId));
        onNewInspectionPressSuccess(response, dispatch, navigate);
      })
      .catch(error => {
        const {
          statusCode = null,
          hasAdded = 'existing',
          inspectionId = null,
          errorMessage = 'An error occurred',
          message = 'An error occurred',
        } = error?.response?.data || {};

        if (statusCode === 409) {
          const vehicleType = hasAdded || 'existing';
          dispatch(setVehicleType(vehicleType));
          setTimeout(() => setIsInspectionInProgressModalVisible(true), 100);
          setErrorModalDetail({title: message, message: errorMessage, inspectionId});
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleYesPressOfInProgressInspection = async () => {
    setIsInspectionInProgressModalVisible(false);

    dispatch(setCompanyId(companyId));
    dispatch(numberPlateSelected(errorModalDetail.inspectionId));
    setErrorModalDetail({message: '', title: '', inspectionId: ''});
    navigation.navigate(ROUTES.NEW_INSPECTION, {isInProgress: true});
  };

  const handlePressMileageCameraIcon = () => {
    const details = {
      title: OdometerDetails.title,
      type: 'odometer',
      uri: '',
      source: OdometerDetails.source,
      fileId: '',
      category: OdometerDetails.category,
      subCategory: OdometerDetails.subCategory,
      groupType: OdometerDetails.groupType,
      instructionalText: OdometerDetails.instructionalText,
    };
    navigation.navigate(ROUTES.CAMERA, {
      modalDetails: details,
      returnTo: ROUTES.VEHICLE_INFORMATION,
      returnToParams: {isMileageCapture: true},
    });
  };

  return (
    <View style={styles.blueContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LoadingIndicator isLoading={isLoading} />

      <KeyboardAwareScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.container}>
        {/* BLUE HEADER */}
        <View style={styles.blueHeaderContainer}>
          <LogoHeader
            showLeft={false}
            rightIcon={
              <IconWrapper>
                <BellWhiteIcon />
              </IconWrapper>
            }
          />
        </View>

        {/* WHITE CONTAINER */}
        <CardWrapper style={styles.whiteContainerContent}>
          <View style={styles.infoContainer}>
            <AppText fontSize={wp(4.5)} fontWeight={'600'}>
              Vehicle Information
            </AppText>
            <AppText fontSize={wp(3)} color={colors.steelGray}>
              Please provide the vehicle information below to begin your inspection. All fields are required to ensure accurate compliance.
            </AppText>
          </View>

          <Formik
            initialValues={intialData}
            validate={values => {
              const errors = validate(values);
              if (showVehicleType && !values.vehicleType) {
                errors.vehicleType = 'Please select a vehicle type';
              }
              return errors;
            }}
            onSubmit={handleSubmitForm}>
            {({values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, submitCount}) => {
              const fetchVehicleInfo = useCallback(
                async licensePlateNumber => {
                  const plate = licensePlateNumber?.trim();
                  if (!plate) return;
                  try {
                    setIsFetchingVehicleInfo(true);
                    const response = await getVehicleInformationAgainstLicenseId(plate);
                    const apiVehicleType = response?.data?.vehicleType ?? null;
                    const apiVin = response?.data?.vin ?? null;
                    const normalized = typeof apiVehicleType === 'string' ? apiVehicleType.toLowerCase() : null;
                    if (normalized && Object.values(VEHICLE_TYPES).includes(normalized)) {
                      setFieldValue('vehicleType', normalized, false);
                      setFieldValue('vin', apiVin, false);
                      setHasApiDetectedVehicleType(true);
                      setShowVehicleType(true);
                      requestAnimationFrame(() => scrollToVehicleType(normalized));
                    } else {
                      setFieldValue('vehicleType', '', false);
                      setHasApiDetectedVehicleType(false);
                      setShowVehicleType(true);
                    }
                  } catch (error) {
                    setFieldValue('vehicleType', '', false);
                    setHasApiDetectedVehicleType(false);
                    setShowVehicleType(true);
                  } finally {
                    setIsFetchingVehicleInfo(false);
                  }
                },
                [setFieldValue, scrollToVehicleType]
              );

              const debouncedFetchVehicleInfo = useDebounce(fetchVehicleInfo, 600);

              const handleLicensePlateChangeFactory = useCallback(
                name => text => {
                  setFieldValue(name, text);
                  const plate = text?.trim?.() || '';
                  if (plate.length <= 3) {
                    debouncedFetchVehicleInfo.cancel?.();
                    setShowVehicleType(false);
                    setFieldValue('vehicleType', '', false);
                    setHasApiDetectedVehicleType(false);
                    setIsFetchingVehicleInfo(false);
                    return;
                  }
                  debouncedFetchVehicleInfo(text);
                },
                [setFieldValue, debouncedFetchVehicleInfo]
              );
              return (
                <>
                  <View style={styles.vehicleTypeContainer}>
                    <View style={styles.inputsContainer}>
                      <CustomInput
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={'#BDBDBD'}
                        rightIcon={
                          isFetchingVehicleInfo ? (
                            <ActivityIndicator size="small" color={colors.royalBlue} />
                          ) : hasApiDetectedVehicleType ? (
                            <CircleTickIcon />
                          ) : null
                        }
                        inputStyle={styles.input}
                        placeholder="Enter Truck ID/License Plate"
                        label="Truck ID/License Plate"
                        value={values.licensePlateNumber}
                        onChangeText={handleLicensePlateChangeFactory}
                        onBlur={handleBlur}
                        valueName="licensePlateNumber"
                        touched={touched.licensePlateNumber}
                        error={errors.licensePlateNumber}
                      />
                    </View>

                    {/* VEHICLE TYPES */}
                    {showVehicleType && (
                      <View>
                        <AppText style={styles.vehicleTypeText}>Vehicle Type</AppText>
                        <ScrollView
                          nestedScrollEnabled
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          ref={vehicleTypesScrollRef}
                          contentContainerStyle={styles.vehicleTypeContentList}>
                          {VehicleTypes.map(v => (
                            <Pressable
                              onPress={() => {
                                if (!hasApiDetectedVehicleType) {
                                  setFieldValue('vehicleType', v.id);
                                }
                              }}
                              activeOpacity={0.7}
                              key={v.id}
                              style={[
                                styles.vehicleItemContainer,
                                {
                                  backgroundColor: values.vehicleType == v.id ? colors.royalBlue : '#E7EFF8',
                                  opacity: values.vehicleType !== v.id && hasApiDetectedVehicleType ? 0.7 : 1,
                                },
                              ]}>
                              <View style={styles.vehicleItemImageContainer}>
                                <Image source={v.image} style={styles.vehicleImg} />
                              </View>

                              <View style={styles.vehicleItemName}>
                                <AppText fontWeight={'700'} color={values.vehicleType == v.id ? colors.white : colors.steelGray}>
                                  {v.name}
                                </AppText>
                              </View>
                            </Pressable>
                          ))}
                        </ScrollView>
                        {errors.vehicleType && (touched.vehicleType || submitCount > 0) && (
                          <AppText style={[styles.vehicleTypeText, {color: colors.red}]}> {errors.vehicleType} </AppText>
                        )}
                      </View>
                    )}

                    {/* INPUTS */}
                    <View style={styles.inputsContainer}>
                      <CustomInput
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={'#BDBDBD'}
                        rightIcon={<CameraOutlineIcon />}
                        inputStyle={styles.input}
                        placeholder="Enter Mileage"
                        label="Mileage"
                        value={values.mileage}
                        onChangeText={handleChange}
                        onBlur={handleBlur}
                        valueName="mileage"
                        touched={touched.mileage}
                        error={errors.mileage}
                        keyboardType="number-pad"
                        onRightIconPress={handlePressMileageCameraIcon}
                      />

                      <CustomInput
                        inputContainerStyle={styles.inputContainer}
                        placeholderTextColor={'#BDBDBD'}
                        inputStyle={styles.input}
                        placeholder="Enter VIN"
                        label="VIN"
                        value={values.vin}
                        onChangeText={handleChange}
                        onBlur={handleBlur}
                        valueName="vin"
                        touched={touched.vin}
                        error={errors.vin}
                      />

                      {/* <CustomInput
                          inputContainerStyle={styles.inputContainer}
                          placeholderTextColor={'#BDBDBD'}
                          rightIcon={<ChevronIcon />}
                          inputStyle={styles.input}
                          placeholder="Select Inspection Type"
                          label="Inspection Type"
                          /> 
                      */}
                    </View>
                  </View>
                  <PrimaryGradientButton onPress={handleSubmit} text="Next" buttonStyle={styles.nextButton} />
                </>
              );
            }}
          </Formik>
        </CardWrapper>
      </KeyboardAwareScrollView>

      {isInspectionInProgressModalVisible && (
        <View>
          <DiscardInspectionModal
            title={errorModalDetail.title}
            onYesPress={handleYesPressOfInProgressInspection}
            description={errorModalDetail.message}
            dualButton={false}
          />
        </View>
      )}
    </View>
  );
};

export default VehicleInformation;
