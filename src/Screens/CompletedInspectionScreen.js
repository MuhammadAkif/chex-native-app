import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {CompletedInspectionBackgroundImage} from '../Components';
import {colors} from '../Assets/Styles';
import {PrimaryGradientButton} from '../Components';
import {handleHomePress} from '../Utils';

const CompletedInspectionScreen = ({
  navigation,
  handleThankYouPress,
  seconds,
}) => (
  <CompletedInspectionBackgroundImage>
    <View style={styles.container}>
      <LinearGradient
        colors={['transparent', '#001B51']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        locations={[0, 0.7]}
        style={styles.body}>
        <View style={{flex: 1}} />
        <View style={styles.bodyFooterContainer}>
          <Text style={[styles.textColor, styles.titleText]}>
            Thank you for using
          </Text>
          <Text style={[styles.textColor, styles.subheadingText]}>CHEX.AI</Text>
          <Text style={[styles.textColor, styles.subTitleText]}>
            You may now exit our app. Our representatives will reach out to you
            if we need any further help
          </Text>
          <PrimaryGradientButton
            buttonStyle={styles.button}
            text={'Home'}
            onPress={() => handleHomePress(navigation)}
          />
          <View style={styles.bodyFooterEmptyView} />
        </View>
      </LinearGradient>
    </View>
  </CompletedInspectionBackgroundImage>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  bodyFooterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textColor: {
    color: colors.white,
  },
  titleText: {
    fontSize: hp('3.5%'),
    fontWeight: '500',
  },
  subheadingText: {
    fontSize: hp('3.5%'),
    fontWeight: '800',
  },
  subTitleText: {
    fontSize: hp('1.7%'),
    width: wp('70%'),
    textAlign: 'center',
    color: colors.blueGray,
  },
  button: {
    borderRadius: 30,
  },
  bodyFooterEmptyView: {
    flex: 0.3,
  },
});

export default CompletedInspectionScreen;
