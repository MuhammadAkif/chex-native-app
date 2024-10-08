import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors, dot, NavigationDrawerBackgroundColor} from '../Assets/Styles';
import {IntroBackGroundImageView, PrimaryGradientButton} from '../Components';
import {ANDROID} from '../Constants';
import External from '../Assets/Icons/External';

let isAndroid = Platform.OS === ANDROID && 'Apps > ';
const {cobaltBlueTwo, white, black} = colors;
const IntroScreen = ({
  handleStartInspection,
  handleOpenSettings,
  isLoading,
}) => (
  <View style={styles.container}>
    <View style={styles.innerContainer}>
      <View style={styles.bodyContainer}>
        <IntroBackGroundImageView>
          <View style={styles.bodyHeader}>
            <Text style={styles.bodyHeaderTitle}>Before You Start</Text>
          </View>
          <View style={styles.introductionContainer}>
            <View style={styles.emptyView} />
            <View style={styles.introTextContainer}>
              <Text style={styles.introTitle}>
                Camera Access for the Mobile Browser
              </Text>
              <Text style={styles.introDescription}>
                In some cases your camera may not work to upload items. In that
                case don’t worry, follow the steps below in your phone settings:
              </Text>
            </View>
            <Text
              style={styles.settingsText}
              onPress={handleOpenSettings}
              disabled={isLoading}>
              Settings {'>'} {isAndroid}Chex DSP {'>'} Allow Camera
              <Text onPress={handleOpenSettings} disabled={isLoading}>
                {' '}
                <External
                  height={hp('2%')}
                  width={wp('5%')}
                  color={cobaltBlueTwo}
                />
              </Text>
            </Text>
            <View style={styles.introTextContainer}>
              <Text style={styles.introTitle}>Things you will require</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={dot} />
                <Text style={styles.introDescription}>A Penny</Text>
              </View>
            </View>
            <View style={styles.emptyView} />
            <View style={styles.emptyView} />
          </View>
          <View style={styles.footerContainer}>
            <PrimaryGradientButton
              onPress={handleStartInspection}
              disabled={isLoading}
              text={'+ Start Inspection'}
              buttonStyle={styles.buttonContainer}
            />
          </View>
        </IntroBackGroundImageView>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NavigationDrawerBackgroundColor,
  },
  innerContainer: {
    flex: 1,
    paddingTop: 10,
  },
  bodyContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: white,
  },
  bodyHeader: {
    height: hp('7%'),
    backgroundColor: 'rgba(19, 99, 179, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyHeaderTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
  },
  introductionContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    left: wp('10%'),
  },
  introTextContainer: {
    width: wp('80%'),
    marginBottom: 10,
  },
  introTitle: {
    color: cobaltBlueTwo,
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
  },
  introDescription: {
    color: '#414B55',
    fontSize: hp('2%'),
    letterSpacing: 0.5,
    paddingRight: wp('5%'),
    marginTop: 5,
  },
  settingsText: {
    flexDirection: 'row',
    width: wp('80%'),
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: cobaltBlueTwo,
    paddingRight: wp('5%'),
    textDecorationLine: 'underline',
  },
  emptyView: {
    flex: 0.2,
  },
  footerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    height: hp('6%'),
    width: wp('70%'),
    borderRadius: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  settingsGuideContainer: {
    // flexDirection: 'row',
  },
});

export default IntroScreen;
