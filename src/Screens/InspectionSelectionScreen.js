import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';
import {
  BackgroundImageView,
  PrimaryGradientButton,
  SignInLogo,
  SecondaryButton,
} from '../Components';
import {ROUTES} from '../Navigation/ROUTES';
import {PROJECT_NAME} from '../Constants';

const {INSPECTION_REVIEWED, INSPECTION_IN_PROGRESS} = ROUTES;
const {white, black, cobaltBlueLight} = colors;

const InspectionSelectionScreen = ({
  handleNewInspectionPress,
  handleNavigation,
  isLoading,
}) => (
  <BackgroundImageView>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SignInLogo
          titleText={PROJECT_NAME.CHEX}
          dotTitleText={PROJECT_NAME.AI}
          subtitleText={'Virtual Inspections'}
          containerStyle={styles.logoContainer}
        />
        <Text style={styles.registerTitleText}>
          Please Select one option below
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <PrimaryGradientButton
          text={'+ New Inspection'}
          buttonStyle={styles.buttonContainer}
          onPress={handleNewInspectionPress}
          disabled={isLoading}
        />
        <SecondaryButton
          text={'Inspection In Progress'}
          onPress={() => handleNavigation(INSPECTION_IN_PROGRESS)}
          disabled={isLoading}
        />
        <SecondaryButton
          text={'Inspection Submitted'}
          onPress={() => handleNavigation(INSPECTION_REVIEWED)}
          disabled={isLoading}
        />
      </View>
      <View style={styles.emptyFooterView} />
    </View>
  </BackgroundImageView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cobaltBlueLight,
  },
  headerContainer: {
    flex: 1.5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-end',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonContainer: {
    width: wp('80%'),
    borderRadius: 5,
  },
  emptyFooterView: {
    flex: 0.5,
  },
  registerButton: {
    height: hp('6%'),
    width: wp('80%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  registerTitleText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: white,
  },
  text: {
    color: black,
  },
});

export default InspectionSelectionScreen;
