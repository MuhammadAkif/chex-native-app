import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';
import {PrimaryGradientButton} from './index';

const {royalBlue} = colors;

const PrimaryStartInspectionButton = ({
  buttonPress,
  textPress,
  disabled,
  isLoading,
}) => (
  <View style={styles.footer}>
    <PrimaryGradientButton
      onPress={buttonPress}
      disabled={isLoading || disabled}
      text={'+ Start Inspection'}
      buttonStyle={styles.buttonContainer}
    />
    <Text style={styles.footerText} disabled={isLoading}>
      Or Go back to
      <Text style={styles.homeText} onPress={textPress} disabled={isLoading}>
        {' '}
        Home{' '}
      </Text>
      page
    </Text>
  </View>
);

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
