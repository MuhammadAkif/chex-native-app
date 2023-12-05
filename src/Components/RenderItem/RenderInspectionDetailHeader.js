import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Tick} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';

const RenderInspectionDetailHeader = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>Inspection Details</Text>
    <View style={styles.finalStatusContainer}>
      <Text style={[styles.text, {width: wp('30%')}]}>Final Status</Text>
      <Tick height={hp('3%')} width={wp('8%')} color={colors.deepGreen} />
      <Text style={[styles.text, styles.statusText]}>No Damage Detected</Text>
    </View>
    <View style={styles.statusDescriptionContainer}>
      <ScrollView>
        <Text style={styles.text}>
          Minor Dent on the exterior frontMinor Dent on the exterior
        </Text>
      </ScrollView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    height: hp('30%'),
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingBottom: 20,
  },
  finalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5%',
    borderRadius: 10,
    backgroundColor: colors.silverGray,
  },
  statusDescriptionContainer: {
    height: hp('12%'),
    width: '100%',
    padding: '3%',
    borderRadius: 10,
    backgroundColor: colors.lightGray,
  },
  headerText: {
    paddingHorizontal: '2%',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  text: {
    fontSize: hp('1.8%'),
  },
  statusText: {
    fontWeight: 'bold',
    marginLeft: '2%',
  },
});

export default RenderInspectionDetailHeader;
