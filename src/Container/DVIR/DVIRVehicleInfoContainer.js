import React, { useState } from 'react';
import { DVIRVehicleInfoScreen } from '../../Screens';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { ROUTES } from '../../Navigation/ROUTES';

// Custom validation function (no third-party)
const validate = values => {
  const errors = {};
  if (!values.driverName.trim()) {
    errors.driverName = 'Driver name is required';
  }
  if (!values.date) {
    errors.date = 'Date is required';
  }
  if (!values.truckId.trim()) {
    errors.truckId = 'Truck ID/License Plate is required';
  }
  if (!values.mileage.trim()) {
    errors.mileage = 'Mileage is required';
  } else if (isNaN(values.mileage) || Number(values.mileage) < 0) {
    errors.mileage = 'Mileage must be a positive number';
  }
  if (!values.vin.trim()) {
    errors.vin = 'VIN is required';
  }
  if (!values.technician.trim()) {
    errors.technician = 'Technician is required';
  }
  return errors;
};

const DVIRVehicleInfoContainer = ({ navigation }) => {
  const [showDateModel, setShowDateModel] = useState(false);
  const [dateForPicker, setDateForPicker] = useState(new Date());

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
  const handleCalendarPress = (dateString) => {
    setShowDateModel(true);
    const parsed = dayjs(dateString, 'DD/MM/YYYY').isValid()
      ? dayjs(dateString, 'DD/MM/YYYY').toDate()
      : new Date();
    setDateForPicker(parsed);
  };

  return (
    <Formik
      initialValues={{
        driverName: '',
        date: '07/07/2023',
        truckId: '',
        mileage: '',
        vin: '',
        technician: '',
      }}
      // validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        navigation.navigate(ROUTES.DVIR_INSPECTION_CHECKLIST_CONTAINER);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
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
      )}
    </Formik>
  );
};

export default DVIRVehicleInfoContainer;
