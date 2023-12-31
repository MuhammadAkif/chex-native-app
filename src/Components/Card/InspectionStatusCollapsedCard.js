import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {circleBorderRadius, colors, ShadowEffect} from '../../Assets/Styles';
import UpArrow from '../../Assets/Icons/UpArrow';
import {DownArrow} from '../../Assets/Icons';

const {width} = Dimensions.get('window');

const InspectionStatusCollapsedCard = ({
  textOne,
  textTwo,
  onPress,
  isActive,
  labelOne,
  labelTwo,
  isReviewed,
}) => (
  <TouchableOpacity
    style={styles.collapsedCardContainer}
    disabled={isReviewed === 'In Review'}
    onPress={onPress}>
    <View
      style={[
        styles.statusContainer,
        {
          backgroundColor:
            isReviewed === 'In Review' ? colors.skyBlue : colors.deepGreen,
        },
      ]}>
      <Text style={styles.statusText}>{isReviewed}</Text>
    </View>
    <View style={styles.collapsedCardContentContainer}>
      <View style={styles.trackingIdAndDateContainer}>
        <View style={styles.trackingIDContainer}>
          <Text style={styles.labelText}>{labelOne}</Text>
          <Text style={styles.labelDescription}>{textOne}</Text>
        </View>
        <View style={styles.trackingIDContainer}>
          <Text style={styles.labelText}>{labelTwo}</Text>
          <Text style={styles.labelDescription}>{textTwo}</Text>
        </View>
      </View>
      <View
        style={[
          styles.iconContainer,
          {
            borderColor:
              isReviewed !== 'In Review' &&
              (isActive ? colors.orangePeel : colors.lightSteelBlue),
            borderWidth: isReviewed !== 'In Review' ? 3 : 0,
          },
        ]}>
        {isReviewed !== 'In Review' &&
          (isActive ? (
            <UpArrow
              height={hp('4%')}
              width={wp('4%')}
              color={colors.orangePeel}
            />
          ) : (
            <DownArrow
              height={hp('4%')}
              width={wp('4%')}
              color={colors.lightSteelBlue}
            />
          ))}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  collapsedCardContainer: {
    height: hp('10%'),
    width: wp('90%'),
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colors.white,
    marginTop: 10,
    ...ShadowEffect,
  },
  collapsedCardContentContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: '2%',
  },
  titleText: {
    fontSize: hp('2%'),
    width: wp('75%'),
  },
  iconContainer: {
    height: width * 0.07,
    width: width * 0.07,
    borderRadius: circleBorderRadius,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.orangePeel,
  },
  trackingIdAndDateContainer: {
    width: wp('70%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  trackingIDContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  labelText: {
    color: colors.royalBlue,
    fontSize: hp('1.8%'),
    fontWeight: '700',
    paddingVertical: '3%',
  },
  labelDescription: {
    fontSize: hp('1.5%'),
    paddingBottom: '3%',
    fontWeight: '600',
  },
  statusContainer: {
    position: 'absolute',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    right: 0,
    top: 0,
  },
  statusText: {
    color: colors.white,
    fontSize: hp('1.3%'),
    fontWeight: '600',
  },
});

export default InspectionStatusCollapsedCard;
