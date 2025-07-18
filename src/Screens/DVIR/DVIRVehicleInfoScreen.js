import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import CalendarIcon from '../../Assets/Icons/CalendarIcon';
import {CustomInput, PrimaryGradientButton} from '../../Components';
import {colors, NewInspectionStyles} from '../../Assets/Styles';
import {ROUTES} from '../../Navigation/ROUTES';

const {container, bodyContainer} = NewInspectionStyles;

const DVIRVehicleInfoScreen = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [showDateModel, setShowDateModel] = useState(false);
  const [selectedDate, setSelectedDate] = useState('07/07/2023');
  const [form, setForm] = useState({
    driverName: '',
    truckId: '',
    mileage: '',
    vin: '',
    technician: '',
  });

  const handleChange = name => value => {
    setForm(prev => ({...prev, [name]: value}));
  };

  return (
    <View style={container}>
      <View style={bodyContainer}>
        <Text style={styles.headingText}>
          DRIVER VEHICLE INSPECTION REPORT CHECKLIST
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.innerBody}>
            {/* Driver Name */}
            <Text style={styles.inputLabel}>Driver Name</Text>
            <CustomInput
              placeholder=""
              value={form.driverName}
              onChangeText={() => handleChange('driverName')}
              valueName="driverName"
              inputContainerStyle={styles.inputContainer}
            />
            {/* Date */}
            <Text style={styles.inputLabel}>Date</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CustomInput
                placeholder=""
                value={selectedDate}
                onChangeText={() => handleChange('date')}
                valueName="date"
                inputContainerStyle={styles.inputContainer}
                editable={false}
              />
              <TouchableOpacity
                style={{position: 'absolute', right: 10}}
                onPress={() => setShowDateModel(true)}>
                <CalendarIcon height={28} width={28} />
              </TouchableOpacity>
            </View>
            {/* Truck ID/License Plate */}
            <Text style={styles.inputLabel}>Truck ID/License Plate</Text>
            <CustomInput
              placeholder=""
              value={form.truckId}
              onChangeText={() => handleChange('truckId')}
              valueName="truckId"
              inputContainerStyle={styles.inputContainer}
            />
            {/* Mileage */}
            <Text style={styles.inputLabel}>Mileage</Text>
            <CustomInput
              placeholder=""
              value={form.mileage}
              onChangeText={() => handleChange('mileage')}
              valueName="mileage"
              inputContainerStyle={styles.inputContainer}
            />
            {/* VIN */}
            <Text style={styles.inputLabel}>VIN</Text>
            <CustomInput
              placeholder=""
              value={form.vin}
              onChangeText={() => handleChange('vin')}
              valueName="vin"
              inputContainerStyle={styles.inputContainer}
            />
            {/* Technician */}
            <Text style={styles.inputLabel}>Technician</Text>
            <CustomInput
              placeholder=""
              value={form.technician}
              onChangeText={() => handleChange('technician')}
              valueName="technician"
              inputContainerStyle={styles.inputContainer}
            />
          </View>

          <PrimaryGradientButton
            onPress={() =>
              navigation.navigate(ROUTES.DVIR_INSPECTION_CHECKLIST_CONTAINER)
            }
            disabled={false}
            text={'Next'}
            buttonStyle={styles.buttonContainer}
          />
        </ScrollView>
      </View>
      <DatePicker
        modal
        mode="date"
        open={showDateModel}
        date={date}
        maximumDate={new Date()}
        onConfirm={date => {
          setSelectedDate(dayjs(date).format('DD/MM/YYYY'));
          setShowDateModel(false);
          setDate(date);
        }}
        onCancel={() => {
          setShowDateModel(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  innerBody: {flex: 1},
  inputLabel: {
    fontWeight: 'bold',
    fontSize: hp('2%'),
    marginTop: 20,
    color: colors.black,
    marginBottom: hp('1%'),
  },
  scrollContent: {flexGrow: 1, paddingHorizontal: '5%'},
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: 30,
    alignSelf: 'center',
    marginVertical: hp('5%'),
  },
  inputContainer: {height: hp('6%')},
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
