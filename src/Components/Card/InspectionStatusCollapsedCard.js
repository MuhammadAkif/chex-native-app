import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { circleBorderRadius, colors, ShadowEffect } from '../../Assets/Styles';
import { DownArrow, UpArrow } from '../../Assets/Icons';
import { Platforms } from '../../Constants';

const { WINDOW } = Platforms;
const { width } = Dimensions.get(WINDOW);
const IS_IN_REVIEW = {
  'In Review': true,
  'Ready For Review': true,
  Reviewed: false,
};
const { orangePeel, skyBlue, deepGreen, lightSteelBlue, white, royalBlue, black } = colors;
const STATUS_BACKGROUND_COLOR = {
  'Ready For Review': orangePeel,
  'In Review': skyBlue,
  Reviewed: deepGreen,
};
const Arrow = {
  true: UpArrow,
  false: DownArrow,
};
const ActiveColor = {
  true: orangePeel,
  false: lightSteelBlue,
};

import { useTranslation } from 'react-i18next';

const InspectionStatusCollapsedCard = ({
  textOne,
  textTwo,
  onPress,
  isActive,
  labelOne,
  labelTwo,
  isReviewed,
}) => {
  const { t } = useTranslation();
  const ArrowComponent = Arrow[isActive];
  const isNotInPreview = !IS_IN_REVIEW[isReviewed];
  const iconHeight = hp('4%');
  const iconWidth = wp('4%');

  // Helper to get translation key from status string
  // 'Ready For Review' -> 'ready_for_review'
  // 'In Review' -> 'in_review'
  // 'Reviewed' -> 'reviewed'
  const getStatusTranslationKey = (status) => {
    return status.toLowerCase().replace(/ /g, '_');
  };

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
        <Text style={styles.statusText}>
          {t(`statuses.${getStatusTranslationKey(isReviewed)}`)}
        </Text>
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
    // Removed fixed height to allow growth
    width: wp('90%'),
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: white,
    marginTop: 10,
    paddingVertical: hp('2%'), // Added padding vertical
    ...ShadowEffect,
  },
  collapsedCardContentContainer: {
    width: '100%', // Use full width of parent
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Changed to space-between for better distribution
    paddingHorizontal: wp('3%'), // Added horizontal padding
    marginTop: hp('2%'), // Push down content to avoid status overlap if needed
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
    borderColor: orangePeel,
    marginLeft: 10, // Add some margin from text containers
  },
  trackingIdAndDateContainer: {
    flex: 1, // Allow text container to take available space
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute columns evenly
    marginRight: 10, // Space between text area and icon
  },
  trackingIDContainer: {
    alignItems: 'center',
    flex: 1, // Allow each column to take equal width
    paddingHorizontal: 5, // Reduce padding to fit content better
  },
  labelText: {
    color: royalBlue,
    fontSize: hp('1.8%'),
    fontWeight: '700',
    paddingVertical: '3%',
    textAlign: 'center', // Center align text
  },
  labelDescription: {
    fontSize: hp('1.5%'),
    paddingBottom: '3%',
    fontWeight: '600',
    color: black,
    textAlign: 'center', // Center align text
  },
  statusContainer: {
    position: 'absolute',
    paddingVertical: hp('0.45%'),
    paddingHorizontal: wp('2%'),
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    right: 0,
    top: 0,
    zIndex: 1, // Ensure status is above other content
  },
  statusText: {
    color: white,
    fontSize: hp('1.3%'),
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default InspectionStatusCollapsedCard;
