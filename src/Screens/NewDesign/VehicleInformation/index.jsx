import { View, StatusBar, ScrollView, Image, Pressable, ActivityIndicator, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { CardWrapper, CustomInput, DiscardInspectionModal, ExistingVehicleDropDown, LoadingIndicator, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../Assets/Styles';
import { IMAGES } from '../../../Assets/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { CameraOutlineIcon, ChevronIcon } from '../../../Assets/Icons';
import { Formik } from 'formik';
import { isIOS, VEHICLE_TYPES } from '../../../Constants';
import {
  ai_Mileage_Extraction,
  createInspection,
  extractLicensePlateAI,
  extractVinAI,
  getVehicleInformationAgainstLicenseId,
} from '../../../services/inspection';
import useDebounce from '../../../hooks/useDebounce';
import { ROUTES } from '../../../Navigation/ROUTES';
import { useDispatch, useSelector } from 'react-redux';
import { numberPlateSelected, setCompanyId, setMileage, setSelectedVehicleKind, setVehicleType, showToast } from '../../../Store/Actions';
import { LicensePlateDetails, OdometerDetails, VinDetails } from '../../../Utils';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Types } from '../../../Store/Types';

const validate = (values, hasInspectionType, OCRsCapturedImages, t) => {
  const errors = {};

  if (OCRsCapturedImages?.numberPlate?.uri && !values?.licensePlateNumber?.trim()) {
    errors.licensePlateNumber = t('vehicleInfo.errors.licensePlateUndetected');
  } else if (!OCRsCapturedImages?.numberPlate?.uri && !values?.licensePlateNumber?.trim()) {
    errors.licensePlateNumber = t('vehicleInfo.errors.licensePlateRequired');
  }

  if (OCRsCapturedImages?.mileage?.uri && !values?.mileage?.trim()) {
    errors.mileage = t('vehicleInfo.errors.mileageUndetected');
  } else if (!OCRsCapturedImages?.mileage?.uri && !values?.mileage?.trim()) {
    errors.mileage = t('vehicleInfo.errors.mileageRequired');
  }

  if (OCRsCapturedImages?.vin?.uri && !values?.vin?.trim()) {
    errors.vin = t('vehicleInfo.errors.vinUndetected');
  } else if (!OCRsCapturedImages?.vin?.uri && !values?.vin?.trim()) {
    errors.vin = t('vehicleInfo.errors.vinRequired');
  } else if (values?.vin?.length < 17) {
    errors.vin = t('vehicleInfo.errors.vinLength');
  }

  if (values.vehicleType === VEHICLE_TYPES.TRUCK && hasInspectionType && !values.inspectionType?.trim?.()) {
    errors.inspectionType = t('vehicleInfo.errors.inspectionTypeRequired');
  }

  return errors;
};

const initialData = {
  licensePlateNumber: '',
  mileage: '',
  vin: '',
  vehicleType: '',
  inspectionType: '',
};

const VehicleTypes = [
  { id: VEHICLE_TYPES.VAN, name: 'VAN', image: IMAGES.Van },
  { id: VEHICLE_TYPES.TRUCK, name: 'TRUCK', image: IMAGES.Truck },
  { id: VEHICLE_TYPES.SEDAN, name: 'SEDAN', image: IMAGES.Sedan },
  { id: VEHICLE_TYPES.OTHER, name: 'OTHER', image: IMAGES.other_vehicle },
];



// const existingVehicles = [
//   { vehicleType: 'Sedan', vin: '1HGCM82633A123456', existingVehicle: true },
//   { vehicleType: 'SUV', vin: '1FTFW1ET4EFA12345', existingVehicle: false },
//   { vehicleType: 'Truck', vin: '2GCEK19T1Y1234567', existingVehicle: true },
//   { vehicleType: 'Motorcycle', vin: 'JH2RC4467RM123456', existingVehicle: false },
//   { vehicleType: 'Van', vin: '3C6UR5CL1GG123456', existingVehicle: true },
// ];



const currentDate = new Date().toISOString();
const OCRsCapturedImagesInitialState = { mileage: { uri: '', extension: '' }, numberPlate: { uri: '', extension: '' }, vin: { uri: '', extension: '' } };

const VehicleInformation = props => {
  const { t } = useTranslation();
  const { navigation } = props;
  const authState = useSelector(state => state?.auth);
  const dispatch = useDispatch();
  const route = useRoute();
  const mileageInputRef = useRef(null);
  const licensePlateInputRef = useRef(null);
  const vinInputRef = useRef(null);
  const OCRsCapturedImagesRef = useRef(OCRsCapturedImagesInitialState);

  const user = authState?.user?.data;
  const companyId = user?.companyId;
  const hasInspectionType = user?.hasInspectionType || false;
  const [showVehicleType, setShowVehicleType] = useState(false);
  const [hasApiDetectedVehicleType, setHasApiDetectedVehicleType] = useState(false);
  const [isFetchingVehicleInfo, setIsFetchingVehicleInfo] = useState(false);
  const [isInspectionInProgressModalVisible, setIsInspectionInProgressModalVisible] = useState(false);
  const [errorModalDetail, setErrorModalDetail] = useState({ title: '', message: '', inspectionId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [vinLoading, setVinLoading] = useState(false);
  const [showVinInput, setShowVinInput] = useState(true);
  const [mileageLoading, setMileageLoading] = useState(false);
  const [isInspectionTypeOpen, setIsInspectionTypeOpen] = useState(false);
  const [showExistingVehicleDropdown, setShowExistingVehicleDropdown] = useState(false);
  const vehicleTypesScrollRef = useRef(null);
  const lastQueriedPlateRef = useRef('');
  const latestRequestIdRef = useRef(0);
  const responseCacheRef = useRef(new Map()); // plate -> {vehicleType, vin}
  const lastSetLicensePlateRef = useRef('');
  const inspectionTypeOptions = useMemo(() => ['Regular', 'DVIR'], []);
  const [existingVehicles, setExistingVehicles] = useState([]);

  // Dimensions used to calculate scroll offset (keep in sync with styles.js)
  const VEHICLE_ITEM_WIDTH = wp(38);
  const VEHICLE_ITEM_GAP = 10;

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => setIsInspectionTypeOpen(false));
    return unsubscribe;
  }, [navigation]);

  const resetRefCacheOfPlateNumber = () => {
    lastQueriedPlateRef.current = '';
    latestRequestIdRef.current = 0;
    responseCacheRef.current = new Map();
  };

  const resetOCRsCapturedImagesRef = () => {
    OCRsCapturedImagesRef.current.mileage.uri = '';
    OCRsCapturedImagesRef.current.mileage.extension = '';
    OCRsCapturedImagesRef.current.vin.uri = '';
    OCRsCapturedImagesRef.current.vin.extension = '';
    OCRsCapturedImagesRef.current.numberPlate.uri = '';
    OCRsCapturedImagesRef.current.numberPlate.extension = '';
  };

  const scrollToVehicleType = useCallback(
    typeId => {
      const index = VehicleTypes.findIndex(v => v.id === typeId);
      if (index < 0) return;
      const x = index * (VEHICLE_ITEM_WIDTH + VEHICLE_ITEM_GAP);
      vehicleTypesScrollRef.current?.scrollTo({ x, y: 0, animated: true });
    },
    [VEHICLE_ITEM_GAP, VEHICLE_ITEM_WIDTH]
  );

  // Helpers: normalize (letters/numbers only, uppercase) and validate plate
  const normalizePlate = useCallback(text => (text || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase(), []);
  const isValidPlate = useCallback(plate => /^[A-Z0-9]{4,}$/.test(plate), []);

  // Apply vehicle info from API/cache into form and UI state
  const applyVehicleInfo = useCallback(
    (data, setFieldValue, setFieldError) => {
      const apiVehicleType = data?.vehicleType ?? null;
      const apiVin = data?.vin || '';

      const hasVin = apiVin.length > 0;
      setFieldValue('vin', hasVin ? apiVin : '', false);
      setShowVinInput(!hasVin || apiVin.length < 17);
      if (hasVin) setFieldError?.('vin', '');

      const normalizedType = typeof apiVehicleType === 'string' ? apiVehicleType.toLowerCase() : null;
      if (normalizedType && Object.values(VEHICLE_TYPES).includes(normalizedType)) {
        setFieldValue('vehicleType', normalizedType, false);
        setFieldError?.('vehicleType', '');
        setHasApiDetectedVehicleType(true);
        setShowVehicleType(true);
        requestAnimationFrame(() => scrollToVehicleType(normalizedType));
      } else {
        setFieldValue('vehicleType', '', false);
        setHasApiDetectedVehicleType(false);
        setShowVehicleType(true);
        setFieldValue?.('mileage', '', false);
        OCRsCapturedImagesRef.current.mileage.uri = '';
        OCRsCapturedImagesRef.current.vin.uri = '';
      }
    },
    [scrollToVehicleType]
  );

  const handleSubmitForm = (values, { setSubmitting, resetForm }) => {
    Keyboard.dismiss();

    const { numberPlate, mileage } = OCRsCapturedImagesRef.current;
    const dateImage = dayjs(currentDate).format('DD-M-YYYY');
    const vehicleType = values?.vehicleType;

    const data = {
      ...values,
      ...(vehicleType === VEHICLE_TYPES.TRUCK && hasInspectionType && { hasCheckList: values.inspectionType === 'DVIR' }),
      files: [
        {
          url: numberPlate?.uri,
          category: LicensePlateDetails.subCategory,
          extension: numberPlate?.extension,
          groupType: LicensePlateDetails.groupType,
          dateImage,
        },
        {
          url: mileage?.uri,
          category: OdometerDetails.subCategory,
          extension: mileage?.extension,
          groupType: OdometerDetails.groupType,
          dateImage,
        },
      ],
    };

    setIsLoading(true);

    // API CALL TO CREATE INSPECTION
    createInspection(companyId, data)
      .then(response => {
        setIsLoading(false);
        dispatch(setCompanyId(companyId));
        dispatch(setVehicleType(response?.data?.hasAdded || 'existing'));
        dispatch(setSelectedVehicleKind(vehicleType));
        dispatch(numberPlateSelected(response?.data?.id));

        // RESET STATES
        setHasApiDetectedVehicleType(false);
        setShowVehicleType(false);
        setShowVinInput(true);
        resetOCRsCapturedImagesRef();
        resetForm();

        // NAVIGATE
        const timeout = isIOS ? 500 : 100;
        const nextRoute = data?.hasCheckList ? ROUTES.DVIR_INSPECTION_CHECKLIST : ROUTES.NEW_INSPECTION;
        const routeName = data?.hasCheckList ? ROUTES.DVIR_INSPECTION_CHECKLIST : ROUTES.VEHICLE_INFORMATION;

        setTimeout(() => {
          navigation.navigate(nextRoute, { routeName });
        }, timeout);
      })
      .catch(error => {
        setIsLoading(false);
        const {
          statusCode = null,
          hasAdded = 'existing',
          inspectionId = null,
          errorMessage = 'An error occurred',
          message = t('errors.alreadyInProgress'),
          vehicleType: vehicleKind,
        } = error?.response?.data || {};

        if (statusCode === 409) {
          const vehicleType = hasAdded || 'existing';
          dispatch(setVehicleType(vehicleType));
          dispatch(setSelectedVehicleKind(vehicleKind));
          setTimeout(() => setIsInspectionInProgressModalVisible(true), 100);
          setErrorModalDetail({ title: message, message: errorMessage, inspectionId, resetForm: resetForm, vehicleKind });
          resetOCRsCapturedImagesRef();
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
    setShowVinInput(true);
    resetRefCacheOfPlateNumber();

    const timeout = 500;
    const nextRoute = errorModalDetail?.vehicleKind === VEHICLE_TYPES.TRUCK ? ROUTES.DVIR_INSPECTION_CHECKLIST : ROUTES.NEW_INSPECTION;
    const params = errorModalDetail?.vehicleKind === VEHICLE_TYPES.TRUCK ? undefined : { isInProgress: true };

    setTimeout(() => navigation.navigate(nextRoute, params), timeout);

    setErrorModalDetail({ message: '', title: '', inspectionId: '', resetForm: null, vehicleKind: null });
  };

  const handleCameraNavigation = (details, returnParams) => {
    navigation.navigate(ROUTES.CAMERA, {
      modalDetails: {
        uri: '',
        fileId: '',
        ...details,
      },
      type: details.key || details.type,
      returnTo: ROUTES.VEHICLE_INFORMATION,
      returnToParams: returnParams,
    });
  };

  // 🎯 CAMERA CAPTURE HANDLERS
  const handlePressMileageCameraIcon = () => handleCameraNavigation(OdometerDetails, { isMileageCapture: true });
  const handlePressVinCameraIcon = () => handleCameraNavigation(VinDetails, { isVinCapture: true });
  const handlePressNumberPlateCameraIcon = () => handleCameraNavigation(LicensePlateDetails, { isLicensePlateCapture: true });

  const handleNoPressOfAlreadyInProgressModal = () => {
    setIsInspectionInProgressModalVisible(false);
    setErrorModalDetail({ title: '', message: '', inspectionId: '' });
  };

  const handlePressOCRInput = (key, captureHandler) => {
    const uri = OCRsCapturedImagesRef?.current?.[key]?.uri;
    if (!uri) captureHandler();
  };

  const handlePressClearForm = useCallback((setFieldValue, setFieldTouched, setFieldError) => {
    setFieldValue('licensePlateNumber', '', false);
    setFieldValue('mileage', '', false);
    setFieldValue('vin', '', false);
    setFieldError('licensePlateNumber', '');
    setFieldError('mileage', '');
    setFieldError('vin', '');
    setFieldTouched('licensePlateNumber', true, false);
    setFieldTouched('mileage', true, false);
    setFieldTouched('vin', true, false);
    setShowVehicleType(false);
    setHasApiDetectedVehicleType(false);
    setIsFetchingVehicleInfo(false);
    setShowExistingVehicleDropdown(false);
    resetOCRsCapturedImagesRef();
  }, []);

  const isClearFormDisabled = () => {
    const { numberPlate, mileage, vin } = OCRsCapturedImagesRef?.current || {};

    const isAnyImagePresent = numberPlate?.uri || mileage?.uri || vin?.uri;

    return isLoading || vinLoading || mileageLoading || isFetchingVehicleInfo || !isAnyImagePresent;
  };

  return (
    <View style={styles.blueContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* BLUE HEADER */}
      <View style={styles.blueHeaderContainer}>
        <LogoHeader showLeft={false} />
      </View>
      <TouchableWithoutFeedback onPress={() => setIsInspectionTypeOpen(false)}>
        <View style={styles.cardWrapper}>
          {/* WHITE CONTAINER */}
          <CardWrapper style={styles.whiteContainerContent}>
            <KeyboardAwareScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
              style={styles.container}>
              <View style={styles.infoContainer}>
                <AppText fontSize={wp(4.5)} fontWeight={'600'}>
                  {t('vehicleInfo.title')}
                </AppText>
                <AppText fontSize={wp(3)} color={colors.steelGray}>
                  {t('vehicleInfo.subtitle')}
                </AppText>
              </View>

              <Formik
                initialValues={initialData}
                validate={values => {
                  const errors = validate(values, hasInspectionType, OCRsCapturedImagesRef?.current, t);

                  if (showVehicleType && !values.vehicleType) {
                    errors.vehicleType = t('vehicleInfo.errors.vehicleTypeRequired');
                  }

                  return errors;
                }}
                onSubmit={handleSubmitForm}>
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
                  validateField,
                }) => {
                  useEffect(() => {
                    const { isMileageCapture, isLicensePlateCapture, isVinCapture, capturedImageUri, capturedImageMime } = route?.params || {};

                    const resetCaptureImageParams = () =>
                      navigation.setParams({
                        capturedImageUri: undefined,
                        capturedImageMime: undefined,
                      });

                    if (isMileageCapture) {
                      navigation.setParams({ isMileageCapture: false });

                      if (!capturedImageUri) return; // guard

                      const mileageNotDetected = () => {
                        dispatch(setMileage(''));
                        setFieldError('mileage', t('vehicleInfo.errors.mileageUndetected'));
                        setFieldTouched('mileage', true, false);
                        resetCaptureImageParams();
                        setTimeout(() => mileageInputRef.current?.focus(), 200);
                      };

                      OCRsCapturedImagesRef.current.mileage = {
                        uri: capturedImageUri,
                        extension: capturedImageMime,
                      };

                      setMileageLoading(true);
                      ai_Mileage_Extraction(capturedImageUri)
                        .then(response => {
                          const { mileage = '', status = false } = response?.data || {};

                          if (status === true && mileage) {
                            setFieldValue('mileage', mileage, false);
                            setFieldError('mileage', undefined);
                            dispatch(setMileage(mileage));

                            resetCaptureImageParams();
                          } else {
                            mileageNotDetected();
                          }
                        })
                        .catch(error => {
                          mileageNotDetected();
                        })
                        .finally(() => {
                          setMileageLoading(false);
                        });
                    }

                    if (isLicensePlateCapture) {
                      navigation.setParams({ isLicensePlateCapture: false });

                      if (!capturedImageUri) return; // guard

                      const licensePlateNotDetected = () => {
                        setIsFetchingVehicleInfo(false);
                        dispatch({ type: Types.LICENSE_PLATE_NUMBER, payload: null });
                        setFieldError('licensePlateNumber', t('vehicleInfo.errors.licensePlateUndetected'));
                        setFieldTouched('licensePlateNumber', true, false);
                        resetCaptureImageParams();
                        setTimeout(() => licensePlateInputRef.current?.focus(), 200);
                      };

                      OCRsCapturedImagesRef.current.numberPlate = {
                        uri: capturedImageUri,
                        extension: capturedImageMime,
                      };

                      setIsFetchingVehicleInfo(true);
                      extractLicensePlateAI(capturedImageUri)
                        .then(response => {
                          const { plateNumber = null, status = false } = response?.data || {};
                          if (status === true && plateNumber) {
                            const simpleValue = normalizePlate(plateNumber);
                            setFieldValue('licensePlateNumber', simpleValue, false);
                            setFieldError('licensePlateNumber', undefined);
                            fetchVehicleInfo(simpleValue);
                            dispatch({ type: Types.LICENSE_PLATE_NUMBER, payload: simpleValue });

                            resetCaptureImageParams();
                          } else {
                            licensePlateNotDetected();
                          }
                        })
                        .catch(error => {
                          licensePlateNotDetected();
                        })
                        .finally(() => {
                          setIsFetchingVehicleInfo(false);
                        });
                    }

                    if (isVinCapture) {
                      navigation.setParams({ isVinCapture: false });

                      if (!capturedImageUri) return; // guard

                      const vinNotDetected = () => {
                        setFieldValue('vin', '', false);
                        setFieldError('vin', t('vehicleInfo.errors.vinUndetected'));
                        setFieldTouched('vin', true, false);
                        resetCaptureImageParams();
                        setTimeout(() => vinInputRef.current?.focus(), 200);
                      };

                      OCRsCapturedImagesRef.current.vin = {
                        uri: capturedImageUri,
                        extension: capturedImageMime,
                      };

                      setVinLoading(true);
                      extractVinAI(capturedImageUri)
                        .then(response => {
                          if (response?.data?.status === true) {
                            const vin_num = response?.data?.vin_num ?? '';
                            setFieldValue('vin', vin_num);
                            setFieldError('vin', undefined);
                            setFieldTouched('vin', true, false);
                            resetCaptureImageParams();
                          } else {
                            vinNotDetected();
                          }
                        })
                        .catch(error => {
                          vinNotDetected();
                        })
                        .finally(() => {
                          setVinLoading(false);
                        });
                    }
                  }, [route?.params?.isMileageCapture, route?.params?.isLicensePlateCapture, route?.params?.isVinCapture]);

                  const fetchVehicleInfo = useCallback(
                    async licensePlateNumber => {
                      const normalizedPlate = normalizePlate(licensePlateNumber);
                      if (!normalizedPlate || !isValidPlate(normalizedPlate)) return;

                      // Return cached result if available
                      // const cached = responseCacheRef.current.get(normalizedPlate);
                      // if (cached) {
                      //   applyVehicleInfo(cached, setFieldValue, setFieldError);
                      //   lastQueriedPlateRef.current = normalizedPlate;
                      //   return;
                      // }

                      // Sequence guard to ignore stale responses
                      const requestId = ++latestRequestIdRef.current;
                      lastQueriedPlateRef.current = normalizedPlate;
                      setIsFetchingVehicleInfo(true);
                      try {
                        const response = await getVehicleInformationAgainstLicenseId(normalizedPlate);
                        if (requestId !== latestRequestIdRef.current) return; // stale
                        const data = response?.data || {};
                        // Cache small number of recent results
                        // if (responseCacheRef.current.size > 20) {
                        //   const firstKey = responseCacheRef.current.keys().next().value;
                        //   responseCacheRef.current.delete(firstKey);
                        // }
                        // responseCacheRef.current.set(normalizedPlate, data);

                        if (data?.similarPlates?.length > 0) {

                          setExistingVehicles(data?.similarPlates || []);
                          setShowExistingVehicleDropdown(true);
                        } else {
                          applyVehicleInfo(data, setFieldValue, setFieldError);
                          setShowExistingVehicleDropdown(false);
                        }

                      } catch (error) {
                        if (requestId !== latestRequestIdRef.current) return; // stale
                        setFieldValue('vehicleType', '', false);
                        setFieldValue('vin', '', false);
                        setHasApiDetectedVehicleType(false);
                        setShowVehicleType(true);
                        setShowExistingVehicleDropdown(false);
                      } finally {
                        if (requestId === latestRequestIdRef.current) setIsFetchingVehicleInfo(false);
                      }
                    },
                    [applyVehicleInfo, isValidPlate, normalizePlate, setFieldError, setFieldValue]
                  );

                  const debouncedFetchVehicleInfo = useDebounce(fetchVehicleInfo, 600);

                  const handleLicensePlateChangeFactory = useCallback(
                    name => text => {
                      // Normalize on typing: native autoCapitalize handles uppercase, we filter special chars
                      const normalizedPlate = normalizePlate(text);
                      // Skip if same as last set (prevents IME double-fire)
                      if (normalizedPlate === lastSetLicensePlateRef.current) return;
                      lastSetLicensePlateRef.current = normalizedPlate;
                      setFieldValue(name, normalizedPlate);
                      if (!isValidPlate(normalizedPlate)) {
                        debouncedFetchVehicleInfo.cancel?.();
                        latestRequestIdRef.current++;
                        setShowVehicleType(false);
                        setShowVinInput(true);
                        setFieldValue('vehicleType', '', false);
                        setFieldValue('vin', '', false);
                        setHasApiDetectedVehicleType(false);
                        setIsFetchingVehicleInfo(false);
                        setShowExistingVehicleDropdown(false);
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
                            // onPress={() => handlePressOCRInput('numberPlate', handlePressNumberPlateCameraIcon)}
                            editable={true}
                            ref={licensePlateInputRef}
                            inputContainerStyle={styles.inputContainer}
                            placeholderTextColor={'#BDBDBD'}
                            rightIcon={isFetchingVehicleInfo ? <ActivityIndicator size="small" color={colors.royalBlue} /> : <CameraOutlineIcon />}
                            onRightIconPress={handlePressNumberPlateCameraIcon}
                            inputStyle={styles.input}
                            placeholder={t('vehicleInfo.licensePlatePlaceholder')}
                            label={t('vehicleInfo.licensePlateLabel')}
                            value={values.licensePlateNumber}
                            onChangeText={handleLicensePlateChangeFactory}
                            onBlur={handleBlur}
                            valueName="licensePlateNumber"
                            touched={touched.licensePlateNumber}
                            error={errors.licensePlateNumber}
                            maxLength={16}
                            autoCapitalize="characters"
                          // pointerEvents={!OCRsCapturedImagesRef?.current?.numberPlate?.uri ? 'none' : 'auto'}
                          />
                          {showExistingVehicleDropdown && (
                            <ExistingVehicleDropDown
                              data={existingVehicles}
                              onClose={() => setShowExistingVehicleDropdown(false)}
                              onSelect={item => {
                                const plateNumber = item?.licensePlateNumber ?? '';
                                if (plateNumber) {
                                  setFieldValue('licensePlateNumber', normalizePlate(plateNumber), false);
                                  setFieldError('licensePlateNumber', undefined);
                                }
                                setShowExistingVehicleDropdown(false);
                                applyVehicleInfo(item, setFieldValue, setFieldError);
                              }}
                            />
                          )}
                        </View>

                        {/* VEHICLE TYPES */}
                        {showVehicleType && (
                          <View>
                            <AppText style={styles.vehicleTypeText}>{t('vehicleInfo.vehicleTypeLabel')}</AppText>
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
                                      {t(`vehicleInfo.vehicleTypes.${v.name.toLowerCase()}`)}
                                    </AppText>
                                  </View>
                                </Pressable>
                              ))}
                            </ScrollView>
                            {errors.vehicleType && (touched.vehicleType || submitCount > 0) && (
                              <AppText style={[styles.vehicleTypeText, { color: colors.red, marginTop: 3 }]}> {errors.vehicleType} </AppText>
                            )}
                          </View>
                        )}

                        {/* INPUTS */}
                        <View style={styles.inputsContainer}>
                          <CustomInput
                            // onPress={() => handlePressOCRInput('mileage', handlePressMileageCameraIcon)}
                            // editable={!!OCRsCapturedImagesRef?.current?.mileage?.uri}
                            ref={mileageInputRef}
                            inputContainerStyle={styles.inputContainer}
                            placeholderTextColor={'#BDBDBD'}
                            rightIcon={mileageLoading ? <ActivityIndicator size="small" color={colors.royalBlue} /> : <CameraOutlineIcon />}
                            inputStyle={styles.input}
                            placeholder={t('vehicleInfo.mileagePlaceholder')}
                            label={t('vehicleInfo.mileageLabel')}
                            value={values.mileage}
                            onChangeText={handleChange}
                            onBlur={handleBlur}
                            valueName="mileage"
                            touched={touched.mileage}
                            error={errors.mileage}
                            keyboardType="number-pad"
                            onRightIconPress={handlePressMileageCameraIcon}
                            maxLength={17}
                          // pointerEvents={!OCRsCapturedImagesRef?.current?.mileage?.uri ? 'none' : 'auto'}
                          />

                          {showVinInput && (
                            <CustomInput
                              ref={vinInputRef}
                              inputContainerStyle={styles.inputContainer}
                              rightIcon={vinLoading ? <ActivityIndicator size="small" color={colors.royalBlue} /> : <CameraOutlineIcon />}
                              onRightIconPress={handlePressVinCameraIcon}
                              placeholderTextColor={'#BDBDBD'}
                              inputStyle={styles.input}
                              placeholder={t('vehicleInfo.vinPlaceholder')}
                              label={t('vehicleInfo.vinLabel')}
                              value={values.vin}
                              onChangeText={handleChange}
                              onBlur={handleBlur}
                              valueName="vin"
                              touched={touched.vin}
                              error={errors.vin}
                              maxLength={17}
                            />
                          )}
                          {/* INSPECTION TYPE DROPDOWN */}
                          {hasInspectionType && values.vehicleType === VEHICLE_TYPES.TRUCK && (
                            <View>
                              <AppText style={{ marginBottom: 6 }}>{t('vehicleInfo.inspectionTypeLabel')}</AppText>
                              <Pressable
                                onPress={() => setIsInspectionTypeOpen(prev => !prev)}
                                style={[styles.inputContainer, styles.dropdownContainer]}>
                                <AppText style={{ ...styles.input, color: values.inspectionType ? colors.black : '#BDBDBD' }}>
                                  {values.inspectionType
                                    ? t(`vehicleInfo.inspectionTypes.${values.inspectionType.toLowerCase()}`)
                                    : t('vehicleInfo.inspectionTypePlaceholder')}
                                </AppText>
                                <ChevronIcon />
                              </Pressable>

                              {isInspectionTypeOpen && (
                                <>
                                  <View style={styles.dropdownList}>
                                    {inspectionTypeOptions.map(option => (
                                      <Pressable
                                        key={option}
                                        onPress={() => {
                                          setFieldValue('inspectionType', option, true);
                                          setFieldTouched('inspectionType', true, false);
                                          setIsInspectionTypeOpen(false);
                                        }}
                                        style={{
                                          padding: 12,
                                          backgroundColor: values.inspectionType === option ? '#F0F6FF' : '#fff',
                                        }}>
                                        <AppText style={{ color: colors.black }}>{t(`vehicleInfo.inspectionTypes.${option.toLowerCase()}`)}</AppText>
                                      </Pressable>
                                    ))}
                                  </View>
                                </>
                              )}

                              {errors.inspectionType && touched.inspectionType && (
                                <AppText style={{ color: colors.red, marginTop: 4 }}>{errors.inspectionType}</AppText>
                              )}
                            </View>
                          )}
                          <TouchableOpacity
                            disabled={isClearFormDisabled()}
                            style={[styles.clearFormButton, { opacity: isClearFormDisabled() ? 0.5 : 1 }]}
                            onPress={() => handlePressClearForm(setFieldValue, setFieldTouched, setFieldError)}>
                            <AppText style={styles.clearFormButtonText}>{t('vehicleInfo.clearAll')}</AppText>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <PrimaryGradientButton onPress={handleSubmit} text={t('vehicleInfo.next')} buttonStyle={styles.nextButton} />
                    </>
                  );
                }}
              </Formik>
            </KeyboardAwareScrollView>
          </CardWrapper>
        </View>
      </TouchableWithoutFeedback>

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

      <LoadingIndicator isLoading={isLoading} />
    </View>
  );
};

export default VehicleInformation;
