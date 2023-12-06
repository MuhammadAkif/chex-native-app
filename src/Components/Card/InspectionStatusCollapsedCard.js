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
}) => {
  const isInReview =
    isReviewed === 'In Review' || isReviewed === 'Ready For Review';
  const isNotInPreview =
    isReviewed !== 'In Review' && isReviewed !== 'Ready For Review';
  const iconHeight = hp('4%');
  const iconWidth = wp('4%');
  return (
    <TouchableOpacity
      style={styles.collapsedCardContainer}
      disabled={isInReview}
      onPress={onPress}>
      <View
        style={[
          styles.statusContainer,
          {
            backgroundColor:
              isInReview && isReviewed === 'Ready For Review'
                ? colors.orangePeel
                : isInReview
                ? colors.skyBlue
                : colors.deepGreen,
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
                isNotInPreview &&
                (isActive ? colors.orangePeel : colors.lightSteelBlue),
              borderWidth: isNotInPreview ? 3 : 0,
            },
          ]}>
          {isNotInPreview &&
            (isActive ? (
              <UpArrow
                height={iconHeight}
                width={iconWidth}
                color={colors.orangePeel}
              />
            ) : (
              <DownArrow
                height={iconHeight}
                width={iconWidth}
                color={colors.lightSteelBlue}
              />
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
