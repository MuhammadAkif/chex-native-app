import {View, StatusBar, ScrollView, Image, Pressable, ActivityIndicator} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {styles} from './styles';
import {CardWrapper, CustomInput, IconWrapper, LogoHeader, PrimaryGradientButton, SecondaryButton} from '../../../Components';
import AppText from '../../../Components/text';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../Assets/Styles';
import {IMAGES} from '../../../Assets/Images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {BellWhiteIcon, CameraOutlineIcon, ChevronIcon, CircleTickIcon, HamburgerIcon} from '../../../Assets/Icons';
import {Formik} from 'formik';
import {VEHICLE_TYPES} from '../../../Constants';
import {getVehicleInformationAgainstLicenseId} from '../../../services/inspection';
import useDebounce from '../../../hooks/useDebounce';

const validate = values => {
  const errors = {};
  if (!values.licensePlate.trim()) {
    errors.licensePlate = 'Truck ID/License Plate is required';
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
  licensePlate: '',
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

const VehicleInformation = () => {
  const [showVehicleType, setShowVehicleType] = useState(false);
  const [hasApiDetectedVehicleType, setHasApiDetectedVehicleType] = useState(false);
  const [isFetchingVehicleInfo, setIsFetchingVehicleInfo] = useState(false);
  const vehicleTypesScrollRef = useRef(null);

  // Dimensions used to calculate scroll offset (keep in sync with styles.js)
  const VEHICLE_ITEM_WIDTH = wp(38);
  const VEHICLE_ITEM_GAP = 10;

  const scrollToVehicleType = useCallback(
    typeId => {
      const index = VehicleTypes.findIndex(v => v.id === typeId);
      if (index < 0) return;
      const x = index * (VEHICLE_ITEM_WIDTH + VEHICLE_ITEM_GAP);
      vehicleTypesScrollRef.current?.scrollTo({x, y: 0, animated: true});
    },
    [VEHICLE_ITEM_GAP, VEHICLE_ITEM_WIDTH],
  );

  const handleSubmitForm = (values, {setSubmitting}) => {
    setSubmitting(false);

    console.log('values:', values);
  };

  return (
    <View style={styles.blueContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
                async licensePlate => {
                  const plate = licensePlate?.trim();
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
                [setFieldValue, scrollToVehicleType],
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
                [setFieldValue, debouncedFetchVehicleInfo],
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
                        value={values.licensePlate}
                        onChangeText={handleLicensePlateChangeFactory}
                        onBlur={handleBlur}
                        valueName="licensePlate"
                        touched={touched.licensePlate}
                        error={errors.licensePlate}
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
                              style={[styles.vehicleItemContainer, {backgroundColor: values.vehicleType == v.id ? colors.royalBlue : '#E7EFF8'}]}>
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
                  <PrimaryGradientButton onPress={handleSubmit} disabled={isSubmitting} text="Next" buttonStyle={styles.nextButton} />
                </>
              );
            }}
          </Formik>
        </CardWrapper>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default VehicleInformation;
