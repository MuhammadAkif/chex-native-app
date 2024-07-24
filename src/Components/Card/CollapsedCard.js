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
const isBothAvailableStyle = {
  true: {
    borderWidth: 1,
    borderColor: colors.tealGreen,
    backgroundColor: colors.icyBlue,
  },
  false: {
    borderWidth: 0,
    borderColor: null,
    backgroundColor: colors.white,
  },
};
const CheckIcon = () => (
  <>
    <View style={[styles.numberContainer, styles.checkContainer]}>
      <Check height={hp('2%')} width={wp('5%')} color={colors.white} />
    </View>
  </>
);
const Index = index => <Text style={styles.numberContainer}>{index}</Text>;

const CollapsedCard = ({
  text,
  index,
  onPress,
  isActive,
  isBothItemsAvailable,
}) => {
  const Label = {
    true: CheckIcon,
    false: () => Index(index),
  };
  const Arrow = {
    true: UpArrow,
    false: DownArrow,
  };
  const ActiveColor = {
    true: colors.orangePeel,
    false: colors.lightSteelBlue,
  };
  const ArrowComponent = Arrow[isActive];
  const TextComponent = Label[isBothItemsAvailable];
  return (
    <TouchableOpacity
      style={[
        styles.collapsedCardContainer,
        {
          ...isBothAvailableStyle[isBothItemsAvailable],
        },
      ]}
      onPress={onPress}>
      <View style={styles.collapsedCardContentContainer}>
        <TextComponent />
        <Text style={[styles.titleText, styles.titleTextColor]}>{text}</Text>
        <View
          style={[styles.iconContainer, {borderColor: ActiveColor[isActive]}]}>
          <ArrowComponent
            height={hp('4%')}
            width={wp('4%')}
            color={ActiveColor[isActive]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
