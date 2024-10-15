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
const {
  tealGreen,
  icyBlue,
  white,
  gray,
  royalBlue,
  orangePeel,
  lightSteelBlue,
  paleBlue,
} = colors;
const isBothAvailableStyle = {
  true: {
    borderWidth: 1,
    borderColor: tealGreen,
    backgroundColor: icyBlue,
  },
  false: {
    borderWidth: 0,
    borderColor: null,
    backgroundColor: white,
  },
};
const CheckIcon = () => (
  <>
    <View style={[styles.numberContainer, styles.checkContainer]}>
      <Check height={hp('2%')} width={wp('5%')} color={white} />
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
  disabled = false,
}) => {
  const disabled_Color = {
    true: gray,
    false: royalBlue,
  };
  const activeColor = disabled_Color[disabled];
  const Label = {
    true: CheckIcon,
    false: () => Index(index),
  };
  const Arrow = {
    true: UpArrow,
    false: DownArrow,
  };
  const ActiveColor = {
    true: orangePeel,
    false: lightSteelBlue,
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
      disabled={disabled}
      onPress={onPress}>
      <View style={styles.collapsedCardContentContainer}>
        <TextComponent />
        <Text
          style={[
            styles.titleText,
            styles.titleTextColor,
            {color: activeColor},
          ]}>
          {text}
        </Text>
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
    color: royalBlue,
    backgroundColor: paleBlue,
    borderRadius: 5,
    right: wp('4%'),
  },
  titleText: {
    fontSize: hp('2%'),
    width: wp('70%'),
  },
  titleTextColor: {
    color: royalBlue,
  },
  iconContainer: {
    height: width * 0.07,
    width: width * 0.07,
    borderRadius: Math.round(height + width) / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: orangePeel,
  },
  checkContainer: {
    paddingHorizontal: '1%',
    paddingVertical: '1.8%',
    backgroundColor: tealGreen,
    right: wp('4%'),
  },
});

export default CollapsedCard;
