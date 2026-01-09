import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {PrimaryGradientButton, SecondaryButton} from './index';
import {fallBack} from '../Utils';
import {colors} from '../Assets/Styles';

const {royalBlue} = colors;

import {useTranslation} from 'react-i18next';

const ButtonFooter = ({
  yesText,
  noText,
  onYesPress = fallBack,
  onNoPress = fallBack,
  isLoading = false,
  yesButtonColor,
  containerStyle = {},
  yesButtonStyle = {},
  noButtonStyle = {},
  noButtonTextStyle = {},
}) => {
  const {t} = useTranslation();
  return (
    <View style={{...styles.footerContainer, ...containerStyle}}>
      <PrimaryGradientButton
        text={yesText || t('common.yes')}
        buttonStyle={{...styles.yesButton, ...yesButtonStyle}}
        onPress={onYesPress}
        disabled={isLoading}
        colors={yesButtonColor}
      />
      <SecondaryButton
        text={noText || t('common.no')}
        buttonStyle={{...styles.noButton, ...noButtonStyle}}
        textStyle={{...styles.noButtonText, ...noButtonTextStyle}}
        onPress={onNoPress}
        disabled={isLoading}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  footerContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  yesButton: {
    width: wp('40%'),
    borderRadius: hp('10%'),
  },
  noButton: {
    width: wp('40%'),
    borderRadius: hp('10%'),
    borderColor: royalBlue,
  },
  noButtonText: {
    color: royalBlue,
  },
});

export default ButtonFooter;
