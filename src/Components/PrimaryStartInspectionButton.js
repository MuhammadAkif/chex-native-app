import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Plus} from '../Assets/Icons';
import {buttonTextStyle, colors} from '../Assets/Styles';
const PrimaryStartInspectionButton = ({
  buttonPress,
  textPress,
  disabled,
  isLoading,
}) => (
  <View style={styles.footer}>
    <TouchableOpacity onPress={buttonPress} disabled={disabled}>
      <LinearGradient
        colors={['#FF7A00', '#F90']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size={'small'} color={colors.white} />
        ) : (
          <>
            <Plus height={hp('5%')} width={wp('5%')} color={colors.white} />
            <Text style={[buttonTextStyle, {right: wp('8%')}]}>
              Start Inspection
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
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
    paddingBottom: '10%',
    width: wp('100%'),
    alignItems: 'center',
  },
  footerText: {
    fontSize: hp('1.9%'),
    color: colors.royalBlue,
  },
  homeText: {
    fontWeight: 'bold',
  },
});

export default PrimaryStartInspectionButton;
