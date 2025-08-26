import dayjs from 'dayjs';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {VEHICLE_TYPES} from '../../Constants';
import {ROUTES} from '../../Navigation/ROUTES';
import {DVIRVehicleInfoScreen} from '../../Screens';
import {createInspection, extractVinAI} from '../../services/inspection';
import {numberPlateSelected} from '../../Store/Actions';
import {getUserFullName} from '../../Utils/helpers';

const validate = values => {
  const errors = {};
  if (!values.driverName.trim()) {
    errors.driverName = 'Driver name is required';
  }
  if (!values.date) {
    errors.date = 'Date is required';
  }
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
  // if (!values.technician.trim()) {
  //   errors.technician = 'Technician is required';
  // }
  return errors;
};

const DVIRVehicleInfoContainer = ({navigation, route}) => {
  const [showDateModel, setShowDateModel] = useState(false);
  const [dateForPicker, setDateForPicker] = useState(new Date());
  const [vinLoading, setVinLoading] = useState(false);
  const [isFormSubmitLoading, setIsFormSubmitLoading] = useState(false);
  const {name: driverFirstName, lastName: driverLastName, companyId} = useSelector(state => state?.auth?.user?.data);
  const dispatch = useDispatch();

  const handleDateConfirm = (date, setFieldValue) => {
    const formatted = dayjs(date).format('DD/MM/YYYY');
    setFieldValue('date', formatted);
    setShowDateModel(false);
    setDateForPicker(date);
  };

  const handleDateCancel = () => {
    setShowDateModel(false);
  };

  // Handler for calendar icon press
  const handleCalendarPress = dateString => {
    setShowDateModel(true);
    const parsed = dayjs(dateString, 'DD/MM/YYYY').isValid() ? dayjs(dateString, 'DD/MM/YYYY').toDate() : new Date();
    setDateForPicker(parsed);
  };

  const handleVINCameraPress = () => {
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
      returnTo: ROUTES.DVIR_VEHICLE_INFO,
      returnToParams: {isVinCapture: true},
    });
  };

  const handleSubmitForm = (values, {setSubmitting}) => {
    setSubmitting(false);
    const data = {
      licensePlateNumber: values?.licensePlateNumber,
      vin: values?.vin,
      date: dayjs(values.date, 'DD/MM/YYYY').toDate(),
      companyId,
      milage: values.mileage,
      hasCheckList: true,
      vehicleType: VEHICLE_TYPES.TRUCK,
    };

    setIsFormSubmitLoading(true);

    createInspection(companyId, data)
      .then(response => {
        if (response?.status === 201) {
          const {id = null} = response?.data || {};
          dispatch(numberPlateSelected(id));

          navigation.navigate(ROUTES.DVIR_INSPECTION_CHECKLIST, {hasNewFetch: true});
        }
      })
      .catch(error => {
        if (error?.response?.data.statusCode === 409) {
          Alert.alert('Error', error?.response?.data?.errorMessage, [
            {
              text: 'Cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                if (error.response?.data?.statusMessage === 'in_progress') {
                  dispatch(numberPlateSelected(error.response?.data?.inspectionId));
                  navigation.navigate(ROUTES.DVIR_INSPECTION_CHECKLIST, {hasNewFetch: true});
                }
              },
            },
          ]);
        }
      })
      .finally(() => {
        setIsFormSubmitLoading(false);
      });
  };

  const driverFullName = getUserFullName(driverFirstName, driverLastName);

  return (
    <Formik
      initialValues={{
        driverName: driverFullName,
        date: '07/07/2023',
        licensePlateNumber: '',
        mileage: '',
        vin: '',
        // technician: '',
      }}
      validate={validate}
      onSubmit={handleSubmitForm}>
      {({values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting}) => {
        // If coming back from camera with vinImageUri, extract VIN
        useEffect(() => {
          async function extractVinIfNeeded() {
            if (route?.params?.isVinCapture) {
              setVinLoading(true);
              try {
                const response = await extractVinAI(route.params.capturedImageUri);
                // console.log('RESPONSE', response);
                const {plateNumber = null} = response?.data || {};
                setFieldValue('vin', plateNumber || '');
              } catch (error) {
                // Optionally show error to user
              } finally {
                setVinLoading(false);
                navigation.setParams({
                  capturedImageUri: undefined,
                  isVinCapture: undefined,
                });
              }
            }
          }

          extractVinIfNeeded();
        }, [route?.params?.capturedImageUri]);

        return (
          <>
            <DVIRVehicleInfoScreen
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCalendarPress={handleCalendarPress}
              onPressVINCamera={handleVINCameraPress}
              vinLoading={vinLoading}
              isFormSubmitLoading={isFormSubmitLoading}
            />
            <DatePicker
              modal
              mode="date"
              open={showDateModel}
              date={dateForPicker}
              maximumDate={new Date()}
              onConfirm={date => handleDateConfirm(date, setFieldValue)}
              onCancel={handleDateCancel}
            />
          </>
        );
      }}
    </Formik>
  );
};

export default DVIRVehicleInfoContainer;
