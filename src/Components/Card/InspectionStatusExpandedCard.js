import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, ShadowEffect} from '../../Assets/Styles';
import {Car} from '../../Assets/Icons';

const InspectionStatusExpandedCard = () => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.detailsContainer}>
      <Car height={hp('5%')} width={wp('5%')} color={colors.royalBlue} />
      <Text style={styles.detailsText}>No Damage Detected</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.detailsContainer}>
      <Car height={hp('5%')} width={wp('5%')} color={colors.royalBlue} />
      <Text style={styles.detailsText}>Inspection Details</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('90%'),
    backgroundColor: colors.white,
    ...ShadowEffect,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderTopWidth: 1,
    borderColor: colors.gray,
  },
  detailsText: {
    fontSize: hp('1.8%'),
    width: wp('65%'),
    paddingVertical: 5,
    color: colors.royalBlue,
  },
});

export default InspectionStatusExpandedCard;
