import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, ShadowEffect} from '../../Assets/Styles';
import {Car} from '../../Assets/Icons';

const {royalBlue, white, gray} = colors;

const InspectionStatusExpandedCard = ({
  inspectionID,
  inspectionDetailsPress,
  isLoading,
  isActivity,
  finalStatus,
}) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.detailsContainer}>
      <Car height={hp('5%')} width={wp('5%')} color={royalBlue} />
      <Text style={styles.detailsText}>
        {finalStatus ? 'No Damage Detected' : 'Damage Detected'}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.detailsContainer}
      disabled={isLoading}
      onPress={() => inspectionDetailsPress(inspectionID)}>
      <Car height={hp('5%')} width={wp('5%')} color={royalBlue} />
      {isLoading && isActivity ? (
        <View style={styles.activityContainer}>
          <ActivityIndicator size={'small'} />
        </View>
      ) : (
        <Text style={styles.detailsText}>Inspection Details</Text>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('90%'),
    backgroundColor: white,
    ...ShadowEffect,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    borderTopWidth: 1,
    borderColor: gray,
  },
  detailsText: {
    fontSize: hp('1.8%'),
    width: wp('65%'),
    paddingVertical: 5,
    color: royalBlue,
  },
  activityContainer: {
    width: wp('65%'),
    paddingVertical: 5,
  },
});

export default InspectionStatusExpandedCard;
