import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CalendarIcon from '../../Assets/Icons/CalendarIcon';
import { CustomInput, PrimaryGradientButton } from '../../Components';
import { colors, NewInspectionStyles, errorStyle } from '../../Assets/Styles';
import AppText from '../../Components/text';
import { CameraBorderedIcon } from '../../Assets/Icons';

const { container, bodyContainer } = NewInspectionStyles;

const DVIRVehicleInfoScreen = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  onCalendarPress,
}) => (
  <View style={container}>
    <View style={bodyContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollStyle}
      >
        <View style={styles.innerBody}>
          {/* Driver Name */}
          <AppText style={styles.inputLabel}>Driver Name</AppText>
          <CustomInput
            placeholder=""
            value={values.driverName}
            onChangeText={handleChange}
            onBlur={handleBlur}
            valueName="driverName"
            inputContainerStyle={styles.inputContainer}
            touched={touched.driverName}
            error={errors.driverName}
          />
          {touched.driverName && errors.driverName && (
            <AppText style={errorStyle.errorsTextStyle}>{errors.driverName}</AppText>
          )}
          {/* Date */}
          <AppText style={styles.inputLabel}>Date</AppText>
          <CustomInput
            placeholder=""
            value={values.date}
            valueName="date"
            inputContainerStyle={styles.inputContainer}
            editable={false}
            rightIcon={<CalendarIcon height={28} width={28} />}
            onRightIconPress={() => onCalendarPress(values.date)}
          />
          {touched.date && errors.date && (
            <AppText style={errorStyle.errorsTextStyle}>{errors.date}</AppText>
          )}
          {/* Truck ID/License Plate */}
          <AppText style={styles.inputLabel}>Truck ID/License Plate</AppText>
          <CustomInput
            placeholder=""
            value={values.truckId}
            onChangeText={handleChange}
            onBlur={handleBlur}
            valueName="truckId"
            inputContainerStyle={styles.inputContainer}
            touched={touched.truckId}
            error={errors.truckId}
          />
          {touched.truckId && errors.truckId && (
            <AppText style={errorStyle.errorsTextStyle}>{errors.truckId}</AppText>
          )}
          {/* Mileage */}
          <AppText style={styles.inputLabel}>Mileage</AppText>
          <CustomInput
            placeholder=""
            value={values.mileage}
            onChangeText={handleChange}
            onBlur={handleBlur}
            valueName="mileage"
            inputContainerStyle={styles.inputContainer}
            touched={touched.mileage}
            error={errors.mileage}
          />
          {touched.mileage && errors.mileage && (
            <AppText style={errorStyle.errorsTextStyle}>{errors.mileage}</AppText>
          )}
          {/* VIN */}
          <AppText style={styles.inputLabel}>VIN</AppText>
          <CustomInput
            placeholder=""
            value={values.vin}
            onChangeText={handleChange}
            onBlur={handleBlur}
            valueName="vin"
            inputContainerStyle={styles.inputContainer}
            touched={touched.vin}
            error={errors.vin}
            rightIcon={<CameraBorderedIcon height={28} width={28} color={colors.brightBlue} />}
          />
          {touched.vin && errors.vin && (
            <AppText style={errorStyle.errorsTextStyle}>{errors.vin}</AppText>
          )}
          {/* Technician */}
          <AppText style={styles.inputLabel}>Technician</AppText>
          <CustomInput
            placeholder=""
            value={values.technician}
            onChangeText={handleChange}
            onBlur={handleBlur}
            valueName="technician"
            inputContainerStyle={styles.inputContainer}
            touched={touched.technician}
            error={errors.technician}
          />
          {touched.technician && errors.technician && (
            <AppText style={errorStyle.errorsTextStyle}>{errors.technician}</AppText>
          )}
        </View>
        <PrimaryGradientButton
          onPress={handleSubmit}
          disabled={isSubmitting}
          text={'Next'}
          buttonStyle={styles.buttonContainer}
        />
      </ScrollView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  innerBody: { flex: 1 },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: hp('2%'),
    marginTop: 20,
    color: colors.black,
    marginBottom: hp('1%'),
  },
  scrollStyle: { marginTop: wp(5) },
  scrollContent: { flexGrow: 1, paddingHorizontal: '5%' },
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: 30,
    alignSelf: 'center',
    marginVertical: hp('5%'),
  },
  inputContainer: { height: hp('5%') },
  headingText: {
    fontSize: hp('1.7%'),
    marginTop: hp('3%'),
    textAlign: 'center',
    width: '70%',
    alignSelf: 'center',
    color: colors.orange,
  },
});

export default DVIRVehicleInfoScreen;
