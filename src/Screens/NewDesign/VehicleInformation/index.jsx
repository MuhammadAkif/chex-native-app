import { View, StatusBar, ScrollView, Image, Pressable, ActivityIndicator, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { CardWrapper, CustomInput, DiscardInspectionModal, ExistingVehicleDropDown, LoadingIndicator, LogoHeader, PrimaryGradientButton, AlertPopup } from '../../../Components';
import MakeYearModelModal from '../../../Components/PopUpModals/MakeYearModelModal';
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
  getVehicleInformationAgainstVin,
} from '../../../services/inspection';
import useDebounce from '../../../hooks/useDebounce';
import { ROUTES, TABS } from '../../../Navigation/ROUTES';
import { useDispatch, useSelector } from 'react-redux';
import { numberPlateSelected, setCompanyId, setMileage, setSelectedVehicleKind, setVehicleType, showToast,setInspectionFrequency } from '../../../Store/Actions';
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

const currentDate = new Date().toISOString();
const OCRsCapturedImagesInitialState = { mileage: { uri: '', extension: '' }, numberPlate: { uri: '', extension: '' }, vin: { uri: '', extension: '' } };

const configs =  [
          {
              "categoryId": 60,
              "categoryName": "front_right_corner",
              "groupType": "exteriorItems",
              "companyConfigId": 19064
          },
          {
              "categoryId": 61,
              "categoryName": "rear_left_corner",
              "groupType": "exteriorItems",
              "companyConfigId": 19065
          },
          {
              "categoryId": 62,
              "categoryName": "exterior_rear",
              "groupType": "exteriorItems",
              "companyConfigId": 19066
          },
          {
              "categoryId": 63,
              "categoryName": "exterior_front",
              "groupType": "exteriorItems",
              "companyConfigId": 19067
          },
          {
              "categoryId": 64,
              "categoryName": "rear_interior",
              "groupType": "interiorItems",
              "companyConfigId": 19068
          },
          {
              "categoryId": 65,
              "categoryName": "front_interior",
              "groupType": "interiorItems",
              "companyConfigId": 19069
          },
          {
              "categoryId": 66,
              "categoryName": "exterior_left",
              "groupType": "exteriorItems",
              "companyConfigId": 19070
          },
          {
              "categoryId": 67,
              "categoryName": "exterior_right",
              "groupType": "exteriorItems",
              "companyConfigId": 19071
          },
          {
              "categoryId": 68,
              "categoryName": "brake_components",
              "groupType": "tires",
              "companyConfigId": 19072
          },
          {
              "categoryId": 69,
              "categoryName": "tdspare",
              "groupType": "tires",
              "companyConfigId": 19073
          },
          {
              "categoryId": 70,
              "categoryName": "tdrr",
              "groupType": "tires",
              "companyConfigId": 19074
          },
          {
              "categoryId": 71,
              "categoryName": "tdlr",
              "groupType": "tires",
              "companyConfigId": 19075
          },
          {
              "categoryId": 72,
              "categoryName": "tdrf",
              "groupType": "tires",
              "companyConfigId": 19076
          },
          {
              "categoryId": 73,
              "categoryName": "tdlf",
              "groupType": "tires",
              "companyConfigId": 19077
          }
      ]

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

  // Custom Prefill state from Home routing
  const [isFromRegisteredVehicle, setIsFromRegisteredVehicle] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  const vehicleTypesScrollRef = useRef(null);
  const lastQueriedPlateRef = useRef('');
  const latestRequestIdRef = useRef(0);
  const responseCacheRef = useRef(new Map()); // plate -> {vehicleType, vin}
  const lastSetLicensePlateRef = useRef('');
  const inspectionTypeOptions = useMemo(() => ['Regular', 'DVIR'], []);
  const [existingVehicles, setExistingVehicles] = useState([]);
  const [isMakeYearModelModalVisible, setIsMakeYearModelModalVisible] = useState(false);
  const [makeYearModelValue, setMakeYearModelValue] = useState({
    status: false,
    vin: '',
    make: '',
    model: '',
    year: '',
  });

  // Dimensions used to calculate scroll offset (keep in sync with styles.js)
  const VEHICLE_ITEM_WIDTH = wp(38);
  const VEHICLE_ITEM_GAP = 10;

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => setIsInspectionTypeOpen(false));
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.isFromRegisteredVehicle !== undefined) {
      setShowVehicleType(true);
      setHasApiDetectedVehicleType(true);
      if (route?.params?.vin?.length === 17) {
        setShowVinInput(false);
      } else {
        setShowVinInput(true);
      }

      if (route?.params?.vehicleType) {
        requestAnimationFrame(() => scrollToVehicleType(route.params.vehicleType));
      }
      setIsFromRegisteredVehicle(route.params.isFromRegisteredVehicle);
    }
  }, [route?.params?.isFromRegisteredVehicle, route?.params?.licensePlateNumber, route?.params?.vin, route?.params?.vehicleType]);

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

  const resetIsFromRegisteredVehicleStates = () => {
    setIsFromRegisteredVehicle(false);
    navigation.setParams({
      isFromRegisteredVehicle: undefined,
      licensePlateNumber: undefined,
      vehicleType: undefined,
      vin: undefined,
    });
  }

  const handleSubmitForm = (values, { setSubmitting, resetForm }) => {
    Keyboard.dismiss();

    const { numberPlate, mileage } = OCRsCapturedImagesRef.current;
    const dateImage = dayjs(currentDate).format('DD-M-YYYY');
    const vehicleType = values?.vehicleType;

    const data = {
      ...values,
      ...(vehicleType === VEHICLE_TYPES.TRUCK &&
        hasInspectionType && {
          hasCheckList: values.inspectionType === 'DVIR',
          vehicleType:
            values.inspectionType === 'DVIR' ? 'dvir-truck' : values.inspectionType === 'Regular' ? 'regular-truck' : values.vehicleType,
        }),
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

      make: makeYearModelValue?.make || null,
      model: makeYearModelValue?.model,
      year: makeYearModelValue?.year,

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
        debugger;
        dispatch(setInspectionFrequency(response?.data?.configs));

        // RESET STATES
        resetIsFromRegisteredVehicleStates();
        setHasApiDetectedVehicleType(false);
        setShowVehicleType(false);
        setShowVinInput(true);
        setMakeYearModelValue({ make: null, model: null, year: null });
        setIsMakeYearModelModalVisible(false);
        resetOCRsCapturedImagesRef();
        resetForm();

        // NAVIGATE
        const timeout = isIOS ? 500 : 100;
        const nextRoute = data?.hasCheckList ? ROUTES.DVIR_INSPECTION_CHECKLIST : ROUTES.NEW_INSPECTION;
        const routeName = data?.hasCheckList ? ROUTES.DVIR_INSPECTION_CHECKLIST : ROUTES.VEHICLE_INFORMATION;

        setTimeout(() => {
          navigation.reset({ index: 2, routes: [{ name: ROUTES.TABS }, { name: ROUTES.INSPECTION_IN_PROGRESS }, { name: nextRoute, params: { routeName } }] });
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

          resetIsFromRegisteredVehicleStates();
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

    setTimeout(() => navigation.reset({ index: 2, routes: [{ name: ROUTES.TABS }, { name: ROUTES.INSPECTION_IN_PROGRESS }, { name: nextRoute, params }] }), timeout);

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
      returnToParams: {
        ...returnParams,
        isFromRegisteredVehicle: route?.params?.isFromRegisteredVehicle,
        licensePlateNumber: route?.params?.licensePlateNumber,
        vehicleType: route?.params?.vehicleType,
        vin: route?.params?.vin,
      },
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
    if (isFromRegisteredVehicle) {
      setShowClearConfirmModal(true);
      return;
    }

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
    setShowVinInput(true)
    setHasApiDetectedVehicleType(false);
    setIsFetchingVehicleInfo(false);
    setShowExistingVehicleDropdown(false);
    resetOCRsCapturedImagesRef();
  }, [isFromRegisteredVehicle]);

  const confirmClearPreFilledForm = useCallback((setFieldValue, setFieldTouched, setFieldError) => {
    setIsFromRegisteredVehicle(false);
    setShowClearConfirmModal(false);

    // Wipe cached native route params so that selecting the same vehicle consecutively evaluates as a true route change
    navigation.setParams({
      isFromRegisteredVehicle: undefined,
      licensePlateNumber: undefined,
      vehicleType: undefined,
      vin: undefined,
    });

    setFieldValue('licensePlateNumber', '', false);
    setFieldValue('mileage', '', false);
    setFieldValue('vin', '', false);
    setFieldValue('vehicleType', '', false);
    setFieldError('licensePlateNumber', '');
    setFieldError('mileage', '');
    setFieldError('vin', '');
    setFieldTouched('licensePlateNumber', true, false);
    setFieldTouched('mileage', true, false);
    setFieldTouched('vin', true, false);
    setShowVehicleType(false);
    setShowVinInput(true)
    setHasApiDetectedVehicleType(false);
    setIsFetchingVehicleInfo(false);
    setShowExistingVehicleDropdown(false);
    resetOCRsCapturedImagesRef();
  }, [navigation]);

  const isClearFormDisabled = (values) => {
    if (isFromRegisteredVehicle) {
      return isLoading || vinLoading || mileageLoading || isFetchingVehicleInfo;
    }

    const { numberPlate, mileage, vin } = OCRsCapturedImagesRef?.current || {};
    const isAnyImagePresent = values?.licensePlateNumber || values?.mileage || values?.vin || numberPlate?.uri || mileage?.uri || vin?.uri;

    return isLoading || vinLoading || mileageLoading || isFetchingVehicleInfo || !isAnyImagePresent;
  };
  const onCloseExistingVehicleDropDown = () => {
    setShowExistingVehicleDropdown(false);
    setShowVehicleType(true);
  }


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
                enableReinitialize={true}
                initialValues={{
                  ...initialData,
                  licensePlateNumber: route?.params?.isFromRegisteredVehicle ? route.params.licensePlateNumber : '',
                  vehicleType: route?.params?.isFromRegisteredVehicle ? route.params.vehicleType : '',
                  vin: route?.params?.isFromRegisteredVehicle ? route.params.vin : '',
                }}
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
                    if (showClearConfirmModal === 'confirm') {
                      confirmClearPreFilledForm(setFieldValue, setFieldTouched, setFieldError);
                    }
                  }, [showClearConfirmModal]);

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
                            setMakeYearModelValue({
                              status: response?.data?.status,
                              vin_num: response?.data?.vin_num,
                              make: response?.data?.make,
                              model: response?.data?.model,
                              year: response?.data?.year
                            });
                            setIsMakeYearModelModalVisible(true);
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

                  const fetchMakeYearModelInfo = async () => {
                    try {
                      setVinLoading(true);
                      extractVinAI(capturedImageUri = null, values?.vin)
                        .then(response => {

                          if (response?.data) {
                            setMakeYearModelValue({
                              status: true,
                              vin_num: response?.data?.vin_num,
                              make: response?.data?.make,
                              model: response?.data?.model,
                              year: response?.data?.year
                            });
                            setIsMakeYearModelModalVisible(true);
                            setFieldError('vin', undefined);
                            setFieldTouched('vin', true, false);


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


                    } catch (error) {
                      console.log('error', error);
                    }


                  }
                  useEffect(() => {
                    if (values?.vin?.length === 17 && showVinInput) {
                      fetchMakeYearModelInfo();
                    }
                  }, [values?.vin]);


                  return (
                    <>
                      <View style={styles.vehicleTypeContainer}>
                        <View style={styles.inputsContainer}>
                          <CustomInput
                            // onPress={() => handlePressOCRInput('numberPlate', handlePressNumberPlateCameraIcon)}
                            editable={!(isFromRegisteredVehicle && route?.params?.licensePlateNumber)}
                            ref={licensePlateInputRef}
                            inputContainerStyle={[styles.inputContainer, (isFromRegisteredVehicle && route?.params?.licensePlateNumber) && { backgroundColor: '#F0F0F0' }]}
                            placeholderTextColor={'#BDBDBD'}
                            rightIcon={(isFromRegisteredVehicle && route?.params?.licensePlateNumber) ? null : isFetchingVehicleInfo ? <ActivityIndicator size="small" color={colors.royalBlue} /> : <CameraOutlineIcon />}
                            onRightIconPress={(isFromRegisteredVehicle && route?.params?.licensePlateNumber) ? undefined : handlePressNumberPlateCameraIcon}
                            inputStyle={[styles.input, (isFromRegisteredVehicle && route?.params?.licensePlateNumber) && { color: colors.steelGray }]}
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
                          {showExistingVehicleDropdown && !isFromRegisteredVehicle && (
                            <ExistingVehicleDropDown
                              data={existingVehicles}
                              onClose={() => onCloseExistingVehicleDropDown()}
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
                                    if (isFromRegisteredVehicle && route?.params?.vehicleType) return;
                                    if (!hasApiDetectedVehicleType || (isFromRegisteredVehicle && !route?.params?.vehicleType)) {
                                      setFieldValue('vehicleType', v.id);
                                    }
                                  }}
                                  activeOpacity={0.7}
                                  key={v.id}
                                  style={[
                                    styles.vehicleItemContainer,
                                    {
                                      backgroundColor: (values.vehicleType == v.id) ? colors.royalBlue : '#E7EFF8',
                                      opacity: (values.vehicleType !== v.id && hasApiDetectedVehicleType && !(isFromRegisteredVehicle && !route?.params?.vehicleType)) ? 0.7 : 1,
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
                              editable={!(isFromRegisteredVehicle && route?.params?.vin?.length === 17)}
                              inputContainerStyle={[styles.inputContainer, (isFromRegisteredVehicle && route?.params?.vin?.length === 17) && { backgroundColor: '#F0F0F0' }]}
                              rightIcon={(isFromRegisteredVehicle && route?.params?.vin?.length === 17) ? null : vinLoading ? <ActivityIndicator size="small" color={colors.royalBlue} /> : <CameraOutlineIcon />}
                              onRightIconPress={(isFromRegisteredVehicle && route?.params?.vin?.length === 17) ? undefined : handlePressVinCameraIcon}
                              placeholderTextColor={'#BDBDBD'}
                              inputStyle={[styles.input, (isFromRegisteredVehicle && route?.params?.vin?.length === 17) && { color: colors.steelGray }]}
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
                            disabled={isClearFormDisabled(values)}
                            style={[styles.clearFormButton, { opacity: isClearFormDisabled(values) ? 0.5 : 1 }]}
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
      {
        isMakeYearModelModalVisible && showVinInput && (
          <MakeYearModelModal
            visible={isMakeYearModelModalVisible}
            defaultValues={{
              vin: makeYearModelValue?.vin_num || makeYearModelValue?.vin || '',
              make: makeYearModelValue?.make || '',
              model: makeYearModelValue?.model || '',
              year: makeYearModelValue?.year?.toString() || ''
            }}
            onClosePress={() => setIsMakeYearModelModalVisible(false)}
            onConfirmPress={(values) => {
              setMakeYearModelValue(values);
              setIsMakeYearModelModalVisible(false);
            }}
            onEditPress={(values) => {
              // Edit usually leaves the modal open to let the user keep typing but we can sync the values
              setMakeYearModelValue(values);
            }}
          />
        )
      }

      {/* CONFIRM CLEAR PREFILL POPUP */}
      <View>
        <AlertPopup
          visible={showClearConfirmModal}
          title={t('vehicleInfo.Info')}
          message={t('vehicleInfo.confirmClear')}
          yesButtonText={t('common.yes') || 'Yes'}
          cancelButtonText={t('common.no') || 'No'}
          onYesPress={() => {
            // Small hack to get access to formik set functions out of scope
            setShowClearConfirmModal('confirm');
          }}
          onCancelPress={() => setShowClearConfirmModal(false)}
        />
      </View>

      <LoadingIndicator isLoading={isLoading} />
    </View>
  );
};

export default VehicleInformation;
