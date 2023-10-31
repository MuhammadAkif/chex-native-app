import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const RenderLicensePlateNumberHeader = () => (
  <Text style={styles.bodyHeader}>New Inspection</Text>
);

const styles = StyleSheet.create({
  itemContainer: {
    padding: '5%',
    width: wp('100%'),
  },
  bodyHeader: {
    fontSize: hp('2%'),
    width: wp('90%'),
    paddingVertical: 15,
  },
});

export default RenderLicensePlateNumberHeader;
