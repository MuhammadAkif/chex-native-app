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
import {DownArrow, UpArrow} from '../../Assets/Icons';
import {WINDOW} from '../../Constants';

const {width} = Dimensions.get(WINDOW);
const IS_IN_REVIEW = {
  'In Review': true,
  'Ready For Review': true,
  Reviewed: false,
};
const STATUS_BACKGROUND_COLOR = {
  'Ready For Review': colors.orangePeel,
  'In Review': colors.skyBlue,
  Reviewed: colors.deepGreen,
};
const Arrow = {
  true: UpArrow,
  false: DownArrow,
};
const ActiveColor = {
  true: colors.orangePeel,
  false: colors.lightSteelBlue,
};

const InspectionStatusCollapsedCard = ({
  textOne,
  textTwo,
  onPress,
  isActive,
  labelOne,
  labelTwo,
  isReviewed,
}) => {
  const ArrowComponent = Arrow[isActive];
  const isNotInPreview = !IS_IN_REVIEW[isReviewed];
  const iconHeight = hp('4%');
  const iconWidth = wp('4%');
  return (
    <TouchableOpacity
      style={styles.collapsedCardContainer}
      disabled={IS_IN_REVIEW[isReviewed]}
      onPress={onPress}>
      <View
        style={[
          styles.statusContainer,
          {
            backgroundColor: STATUS_BACKGROUND_COLOR[isReviewed],
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
              borderColor: isNotInPreview && ActiveColor[isActive],
              borderWidth: isNotInPreview ? 3 : 0,
            },
          ]}>
          {isNotInPreview && (
            <ArrowComponent
              height={iconHeight}
              width={iconWidth}
              color={ActiveColor[isActive]}
            />
          )}
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
    color: colors.black,
  },
  statusContainer: {
    position: 'absolute',
    paddingVertical: hp('0.45%'),
    paddingHorizontal: wp('2%'),
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    right: 0,
    top: 0,
  },
  statusText: {
    color: colors.white,
    fontSize: hp('1.3%'),
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default InspectionStatusCollapsedCard;
