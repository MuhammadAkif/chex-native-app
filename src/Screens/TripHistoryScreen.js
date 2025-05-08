import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors, NewInspectionStyles} from '../Assets/Styles';
import TripCard from '../Components/TripCard';

const {black, white} = colors;
const {container, bodyContainer} = NewInspectionStyles;

const dummyTrips = Array.from({length: 5}, (_, index) => ({
  name: `Device Tag #${12345 + index}`,
  id: Math.floor(Math.random() * 10000), // random ID between 0 and 9999
}));

const TripHistoryScreen = () => (
  <View style={[container, styles.container]}>
    <View style={[bodyContainer, styles.header]}>
      <Text style={styles.bodyHeaderTitleText}>Device</Text>
    </View>
    <View style={[styles.backgroundColor, styles.body]}>
      <TripCard />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0,
    height: hp('10%'),
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bodyHeaderTitleText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
  },
  backgroundColor: {backgroundColor: white},
  body: {
    flex: 10,
    borderWidth: 1,
  },
});

export default TripHistoryScreen;
