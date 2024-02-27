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

import {colors, ShadowEffect} from '../../Assets/Styles';
import {DownArrow, UpArrow, Check} from '../../Assets/Icons';
import {WINDOW} from '../../Constants';

const {height, width} = Dimensions.get(WINDOW);

const CollapsedCard = ({
  text,
  index,
  onPress,
  isActive,
  isBothItemsAvailable,
}) => (
  <TouchableOpacity
    style={[
      styles.collapsedCardContainer,
      {
        borderWidth: isBothItemsAvailable ? 1 : 0,
        borderColor: isBothItemsAvailable ? colors.tealGreen : null,
        backgroundColor: isBothItemsAvailable ? colors.icyBlue : colors.white,
      },
    ]}
    onPress={onPress}>
    <View style={styles.collapsedCardContentContainer}>
      {isBothItemsAvailable ? (
        <View style={[styles.numberContainer, styles.checkContainer]}>
          <Check height={hp('2%')} width={wp('5%')} color={colors.white} />
        </View>
      ) : (
        <Text style={styles.numberContainer}>{index}</Text>
      )}
      <Text style={[styles.titleText, styles.titleTextColor]}>{text}</Text>
      <View
        style={[
          styles.iconContainer,
          {borderColor: isActive ? colors.orangePeel : colors.lightSteelBlue},
        ]}>
        {isActive ? (
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
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  collapsedCardContainer: {
    height: hp('8%'),
    width: wp('90%'),
    justifyContent: 'center',
    marginTop: 10,
    ...ShadowEffect,
  },
  collapsedCardContentContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: '2%',
  },
  numberContainer: {
    fontSize: hp('2%'),
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: colors.royalBlue,
    backgroundColor: colors.paleBlue,
    borderRadius: 5,
    right: wp('4%'),
    // right: 12,
  },
  titleText: {
    fontSize: hp('2%'),
    width: wp('70%'),
  },
  titleTextColor: {
    color: colors.royalBlue,
  },
  iconContainer: {
    height: width * 0.07,
    width: width * 0.07,
    borderRadius: Math.round(height + width) / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.orangePeel,
  },
  checkContainer: {
    paddingHorizontal: '1%',
    paddingVertical: '1.8%',
    backgroundColor: colors.tealGreen,
    right: wp('4%'),
  },
});

export default CollapsedCard;
