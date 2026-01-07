import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { colors } from '../Assets/Styles';
import { PrimaryGradientButton } from './index';

const { royalBlue } = colors;

const PrimaryStartInspectionButton = ({
  buttonPress,
  textPress,
  disabled,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      <PrimaryGradientButton
        onPress={buttonPress}
        disabled={isLoading || disabled}
        text={t('inspectionInProgress.startInspection')}
        buttonStyle={styles.buttonContainer}
      />
      <Text style={styles.footerText} disabled={isLoading}>
        {t('inspectionInProgress.orGoBackTo')}
        <Text style={styles.homeText} onPress={textPress} disabled={isLoading}>
          {' '}
          {t('common.home')}{' '}
        </Text>
        {t('inspectionInProgress.page')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footer: {
    height: hp('12%'),
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: hp('1.9%'),
    color: royalBlue,
  },
  homeText: {
    fontWeight: 'bold',
  },
});

export default PrimaryStartInspectionButton;
