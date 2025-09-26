import {View, StatusBar, ScrollView, Image, Pressable, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {styles} from './styles';
import {
  CardWrapper,
  CustomInput,
  DiscardInspectionModal,
  IconWrapper,
  LoadingIndicator,
  LogoHeader,
  PrimaryGradientButton,
} from '../../../Components';
import AppText from '../../../Components/text';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../Assets/Styles';
import {IMAGES} from '../../../Assets/Images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {BellWhiteIcon, CameraOutlineIcon, CircleTickIcon} from '../../../Assets/Icons';
import {Formik} from 'formik';
import {isIOS, VEHICLE_TYPES} from '../../../Constants';
import {createInspection, extractVinAI, getVehicleInformationAgainstLicenseId} from '../../../services/inspection';
import useDebounce from '../../../hooks/useDebounce';
import {ROUTES} from '../../../Navigation/ROUTES';
import {useDispatch, useSelector} from 'react-redux';
import {getMileage, numberPlateSelected, setCompanyId, setSelectedVehicleKind, setVehicleType, showToast} from '../../../Store/Actions';
import {LicensePlateDetails, OdometerDetails, onNewInspectionPressSuccess} from '../../../Utils';
import {navigate} from '../../../services/navigationService';
import {useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';

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

const initialData = {
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

const currentDate = new Date().toISOString();

const VehicleInformation = props => {
  const {navigation} = props;
  const authState = useSelector(state => state?.auth);
  const {mileage, plateNumber} = useSelector(state => state?.newInspection) || {};
  const dispatch = useDispatch();
  const route = useRoute();
  const mileageInputRef = useRef(null);
  const licensePlateInputRef = useRef(null);
  const licensePlateAndMileageImages = useRef({mileage: {uri: '', extension: ''}, numberPlate: {uri: '', extension: ''}});
  const user = authState?.user?.data;
  const companyId = user?.companyId;
  const [showVehicleType, setShowVehicleType] = useState(false);
  const [hasApiDetectedVehicleType, setHasApiDetectedVehicleType] = useState(false);
  const [isFetchingVehicleInfo, setIsFetchingVehicleInfo] = useState(false);
  const [isInspectionInProgressModalVisible, setIsInspectionInProgressModalVisible] = useState(false);
  const [errorModalDetail, setErrorModalDetail] = useState({title: '', message: '', inspectionId: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [vinLoading, setVinLoading] = useState(false);
  const vehicleTypesScrollRef = useRef(null);
  const lastQueriedPlateRef = useRef('');
  const latestRequestIdRef = useRef(0);
  const responseCacheRef = useRef(new Map()); // plate -> {vehicleType, vin}

  // Dimensions used to calculate scroll offset (keep in sync with styles.js)
  const VEHICLE_ITEM_WIDTH = wp(38);
  const VEHICLE_ITEM_GAP = 10;

  const resetRefCacheOfPlateNumber = () => {
    lastQueriedPlateRef.current = '';
    latestRequestIdRef.current = 0;
    responseCacheRef.current = new Map();
  };

  const scrollToVehicleType = useCallback(
    typeId => {
      const index = VehicleTypes.findIndex(v => v.id === typeId);
      if (index < 0) return;
      const x = index * (VEHICLE_ITEM_WIDTH + VEHICLE_ITEM_GAP);
      vehicleTypesScrollRef.current?.scrollTo({x, y: 0, animated: true});
    },
    [VEHICLE_ITEM_GAP, VEHICLE_ITEM_WIDTH]
  );

  // Helpers: normalize and validate plate
  const normalizePlate = useCallback(text => (text || '').replace(/\s+/g, '').toUpperCase(), []);
  const isValidPlate = useCallback(plate => /^[A-Z0-9-]{4,}$/.test(plate), []);

  // Apply vehicle info from API/cache into form and UI state
  const applyVehicleInfo = useCallback(
    (data, setFieldValue, setFieldError) => {
      const apiVehicleType = data?.vehicleType ?? null;
      const apiVin = data?.vin || '';
      const normalizedType = typeof apiVehicleType === 'string' ? apiVehicleType.toLowerCase() : null;

      if (normalizedType && Object.values(VEHICLE_TYPES).includes(normalizedType)) {
        setFieldValue('vehicleType', normalizedType, false);
        setFieldValue('vin', apiVin, false);
        setFieldError?.('vin', '');
        setFieldError?.('vehicleType', '');
        setHasApiDetectedVehicleType(true);
        setShowVehicleType(true);
        requestAnimationFrame(() => scrollToVehicleType(normalizedType));
      } else {
        setFieldValue('vehicleType', '', false);
        setHasApiDetectedVehicleType(false);
        setShowVehicleType(true);
        setFieldValue?.('vin', '', false);
        setFieldValue?.('mileage', '', false);
        licensePlateAndMileageImages.current.mileage.uri = '';
      }
    },
    [scrollToVehicleType]
  );

  const handleSubmitForm = (values, {setSubmitting, resetForm}) => {
    setIsLoading(true);

    const {numberPlate, mileage} = licensePlateAndMileageImages.current;
    const dateImage = dayjs(currentDate).format('DD-M-YYYY');

    const data = {
      ...values,
      files: [
        {
          url: numberPlate?.uri,
          category: LicensePlateDetails.category,
          extension: numberPlate?.extension,
          groupType: LicensePlateDetails.groupType,
          dateImage,
        },
        {
          url: mileage?.uri,
          category: OdometerDetails.category,
          extension: mileage?.extension,
          groupType: OdometerDetails.groupType,
          dateImage,
        },
      ],
    };

    createInspection(companyId, data)
      .then(response => {
        setIsLoading(false);
        dispatch(setCompanyId(companyId));
        dispatch(setVehicleType(response?.data?.hasAdded || 'existing'));
        dispatch(setSelectedVehicleKind(values?.vehicleType));
        dispatch(numberPlateSelected(response?.data?.id));

        // RESET STATES
        setHasApiDetectedVehicleType(false);
        setShowVehicleType(false);
        licensePlateAndMileageImages.current = {mileage: {uri: '', extension: ''}, numberPlate: {uri: '', extension: ''}};
        resetForm();

        // NAVIGATE
        setTimeout(
          () => {
            navigation.navigate(ROUTES.NEW_INSPECTION, {
              routeName: ROUTES.VEHICLE_INFORMATION,
            });
          },
          isIOS ? 500 : 100
        );
      })
      .catch(error => {
        setIsLoading(false);
        const {
          statusCode = null,
          hasAdded = 'existing',
          inspectionId = null,
          errorMessage = 'An error occurred',
          message = 'Already In Progress',
          vehicleType: vehicleKind,
        } = error?.response?.data || {};

        if (statusCode === 409) {
          const vehicleType = hasAdded || 'existing';
          dispatch(setVehicleType(vehicleType));
          dispatch(setSelectedVehicleKind(vehicleKind));
          setTimeout(() => setIsInspectionInProgressModalVisible(true), 100);
          setErrorModalDetail({title: message, message: errorMessage, inspectionId, resetForm: resetForm});
          licensePlateAndMileageImages.current = {mileage: {uri: '', extension: ''}, numberPlate: {uri: '', extension: ''}};
        } else {
          dispatch(showToast(message, 'error'));
        }
      })
      .finally(() => {
        setSubmitting(false);
        resetRefCacheOfPlateNumber();
      });
  };

  const handleYesPressOfInProgressInspection = async () => {
    setIsInspectionInProgressModalVisible(false);

    dispatch(setCompanyId(companyId));
    dispatch(numberPlateSelected(errorModalDetail.inspectionId));
    errorModalDetail?.resetForm?.();
    setHasApiDetectedVehicleType(false);
    setShowVehicleType(false);
    setErrorModalDetail({message: '', title: '', inspectionId: ''});
    resetRefCacheOfPlateNumber();
    setTimeout(() => navigation.navigate(ROUTES.NEW_INSPECTION, {isInProgress: true}), 500);
  };

  const handlePressMileageCameraIcon = () => {
    const details = {
      title: OdometerDetails.title,
      type: OdometerDetails.key,
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
      type: OdometerDetails.key,
      returnTo: ROUTES.VEHICLE_INFORMATION,
      returnToParams: {isMileageCapture: true},
    });
  };

  const handlePressVinCamareIcon = () => {
    const details = {
      title: 'Please take a photo \n of the VIN',
      type: '1',
      uri: '',
      source: '',
      fileId: '',
      category: 'CarVerification',
      subCategory: 'vin',
      groupType: 'truck',
      instructionalText: 'Please wait a while the VIN is being uploaded',
    };
    navigation.navigate(ROUTES.CAMERA, {
      modalDetails: details,
      returnTo: ROUTES.VEHICLE_INFORMATION,
      returnToParams: {isVinCapture: true},
    });
  };

  const handlePressNumberPlateCameraIcon = () => {
    const details = {
      title: LicensePlateDetails.title,
      type: LicensePlateDetails.key,
      uri: '',
      source: LicensePlateDetails.source,
      fileId: '',
      category: LicensePlateDetails.category,
      subCategory: LicensePlateDetails.subCategory,
      groupType: LicensePlateDetails.groupType,
      instructionalText: LicensePlateDetails.instructionalText,
    };

    navigation.navigate(ROUTES.CAMERA, {
      modalDetails: details,
      type: LicensePlateDetails.key,
      returnTo: ROUTES.VEHICLE_INFORMATION,
      returnToParams: {isLicensePlateCapture: true},
    });
  };

  const handleNoPressOfAlreadyInProgressModal = () => {
    setIsInspectionInProgressModalVisible(false);
    setErrorModalDetail({title: '', message: '', inspectionId: ''});
  };

  const handlePressLicensePlateInput = () => {
    if (!licensePlateAndMileageImages?.current?.numberPlate?.uri) {
      handlePressNumberPlateCameraIcon();
    }
  };

  const handlePressMileageInput = () => {
    if (!licensePlateAndMileageImages?.current?.mileage?.uri) {
      handlePressMileageCameraIcon();
    }
  };

  return (
    <View style={styles.blueContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LoadingIndicator isLoading={isLoading} />

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

      <View style={styles.cardWrapper}>
        {/* WHITE CONTAINER */}
        <CardWrapper style={styles.whiteContainerContent}>
          <KeyboardAwareScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
            style={styles.container}>
            <View style={styles.infoContainer}>
              <AppText fontSize={wp(4.5)} fontWeight={'600'}>
                Vehicle Information
              </AppText>
              <AppText fontSize={wp(3)} color={colors.steelGray}>
                Please provide the vehicle information below to begin your inspection. All fields are required to ensure accurate compliance.
              </AppText>
            </View>

            <Formik
              initialValues={initialData}
              validate={values => {
                const errors = validate(values);
                if (showVehicleType && !values.vehicleType) {
                  errors.vehicleType = 'Please select a vehicle type';
                }
                return errors;
              }}
              onSubmit={handleSubmitForm}>
              {({values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, submitCount, setFieldError}) => {
                useEffect(() => {
                  if (route?.params?.isMileageCapture) {
                    if (mileage !== '') {
                      setFieldValue('mileage', mileage, false);
                      setFieldError('mileage', undefined);
                    } else {
                      dispatch(showToast('Unable to get mileage from image', 'error'));
                      setTimeout(() => mileageInputRef.current?.focus(), 200);
                    }

                    licensePlateAndMileageImages.current.mileage = {
                      uri: route?.params?.capturedImageUri,
                      extension: route?.params?.capturedImageMime,
                    };
                    navigation.setParams({isMileageCapture: false, capturedImageUri: undefined, capturedImageMime: undefined});
                  }

                  if (route?.params?.isLicensePlateCapture) {
                    if (plateNumber) {
                      setFieldValue('licensePlateNumber', plateNumber, false);
                      setFieldError('licensePlateNumber', undefined);
                      fetchVehicleInfo(plateNumber);
                    } else {
                      dispatch(showToast('Unable to get license plate from image', 'error'));
                      setTimeout(() => licensePlateInputRef.current?.focus(), 200);
                    }

                    licensePlateAndMileageImages.current.numberPlate = {
                      uri: route?.params?.capturedImageUri,
                      extension: route?.params?.capturedImageMime,
                    };
                    navigation.setParams({isLicensePlateCapture: false, capturedImageUri: undefined, capturedImageMime: undefined});
                  }

                  if (route?.params?.isVinCapture) {
                    extractVinIfNeeded();
                  }

                  async function extractVinIfNeeded() {
                    setVinLoading(true);
                    try {
                      const response = await extractVinAI(route.params.capturedImageUri);
                      // console.log('RESPONSE', response);
                      const {plateNumber = null} = response?.data || {};
                      setFieldValue('vin', plateNumber || '');
                    } catch (error) {
                      // Optionally show error to user
                      setFieldValue('vin', '');
                    } finally {
                      setVinLoading(false);
                      navigation.setParams({
                        capturedImageUri: undefined,
                        isVinCapture: undefined,
                      });
                    }
                  }
                }, [mileage, plateNumber, route]);

                const fetchVehicleInfo = useCallback(
                  async licensePlateNumber => {
                    const normalizedPlate = normalizePlate(licensePlateNumber);
                    if (!normalizedPlate || !isValidPlate(normalizedPlate)) return;

                    // Return cached result if available
                    const cached = responseCacheRef.current.get(normalizedPlate);
                    if (cached) {
                      applyVehicleInfo(cached, setFieldValue, setFieldError);
                      lastQueriedPlateRef.current = normalizedPlate;
                      return;
                    }

                    // Sequence guard to ignore stale responses
                    const requestId = ++latestRequestIdRef.current;
                    lastQueriedPlateRef.current = normalizedPlate;
                    setIsFetchingVehicleInfo(true);
                    try {
                      const response = await getVehicleInformationAgainstLicenseId(normalizedPlate);
                      if (requestId !== latestRequestIdRef.current) return; // stale

                      const data = response?.data || {};
                      // Cache small number of recent results
                      if (responseCacheRef.current.size > 20) {
                        const firstKey = responseCacheRef.current.keys().next().value;
                        responseCacheRef.current.delete(firstKey);
                      }
                      responseCacheRef.current.set(normalizedPlate, data);
                      applyVehicleInfo(data, setFieldValue, setFieldError);
                    } catch (error) {
                      if (requestId !== latestRequestIdRef.current) return; // stale
                      setFieldValue('vehicleType', '', false);
                      setFieldValue('vin', '', false);
                      setHasApiDetectedVehicleType(false);
                      setShowVehicleType(true);
                    } finally {
                      if (requestId === latestRequestIdRef.current) setIsFetchingVehicleInfo(false);
                    }
                  },
                  [applyVehicleInfo, isValidPlate, normalizePlate, setFieldError, setFieldValue]
                );

                const debouncedFetchVehicleInfo = useDebounce(fetchVehicleInfo, 600);

                const handleLicensePlateChangeFactory = useCallback(
                  name => text => {
                    setFieldValue(name, text);
                    const normalizedPlate = normalizePlate(text);
                    if (!isValidPlate(normalizedPlate)) {
                      debouncedFetchVehicleInfo.cancel?.();
                      latestRequestIdRef.current++;
                      setShowVehicleType(false);
                      setFieldValue('vehicleType', '', false);
                      setHasApiDetectedVehicleType(false);
                      setIsFetchingVehicleInfo(false);
                      return;
                    }
                    debouncedFetchVehicleInfo(normalizedPlate);
                  },
                  [debouncedFetchVehicleInfo, isValidPlate, normalizePlate, setFieldValue]
                );

                return (
                  <>
                    <View style={styles.vehicleTypeContainer}>
                      <View style={styles.inputsContainer}>
                        <CustomInput
                          onPress={handlePressLicensePlateInput}
                          editable={!!licensePlateAndMileageImages?.current?.numberPlate?.uri}
                          ref={licensePlateInputRef}
                          inputContainerStyle={styles.inputContainer}
                          placeholderTextColor={'#BDBDBD'}
                          rightIcon={isFetchingVehicleInfo ? <ActivityIndicator size="small" color={colors.royalBlue} /> : <CameraOutlineIcon />}
                          onRightIconPress={handlePressNumberPlateCameraIcon}
                          inputStyle={styles.input}
                          placeholder="Enter Truck ID/License Plate"
                          label="Truck ID/License Plate"
                          value={values.licensePlateNumber}
                          onChangeText={handleLicensePlateChangeFactory}
                          onBlur={handleBlur}
                          valueName="licensePlateNumber"
                          touched={touched.licensePlateNumber}
                          error={errors.licensePlateNumber}
                          maxLength={10}
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
                            <AppText style={[styles.vehicleTypeText, {color: colors.red, marginTop: 3}]}> {errors.vehicleType} </AppText>
                          )}
                        </View>
                      )}

                      {/* INPUTS */}
                      <View style={styles.inputsContainer}>
                        <CustomInput
                          onPress={handlePressMileageInput}
                          ref={mileageInputRef}
                          editable={!!licensePlateAndMileageImages?.current?.mileage?.uri}
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
                          maxLength={20}
                        />

                        <CustomInput
                          inputContainerStyle={styles.inputContainer}
                          rightIcon={vinLoading ? <ActivityIndicator size="small" color={colors.royalBlue} /> : <CameraOutlineIcon />}
                          onRightIconPress={handlePressVinCamareIcon}
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
                          maxLength={30}
                        />
                      </View>
                    </View>
                    <PrimaryGradientButton onPress={handleSubmit} text="Next" buttonStyle={styles.nextButton} disabled={isLoading} />
                  </>
                );
              }}
            </Formik>
          </KeyboardAwareScrollView>
        </CardWrapper>
      </View>

      {isInspectionInProgressModalVisible && (
        <View>
          <DiscardInspectionModal
            title={errorModalDetail.title}
            onYesPress={handleYesPressOfInProgressInspection}
            description={errorModalDetail.message}
            dualButton={true}
            onNoPress={handleNoPressOfAlreadyInProgressModal}
          />
        </View>
      )}
    </View>
  );
};

export default VehicleInformation;
