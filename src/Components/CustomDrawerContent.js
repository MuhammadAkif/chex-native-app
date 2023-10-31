import React from 'react';
import {View, StyleSheet, ScrollView, StatusBar} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';

import {SignInLogo} from './index';
import {ROUTES} from '../Navigation/ROUTES';
import DrawerItemText from './DrawerItemText';
import {
  Home,
  InspectionDetails,
  InspectionReviewed,
  Logout,
  Plus,
} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {SIGN_OUT_ACTION} from '../Store/Actions';

const CustomDrawerContent = props => {
  const dispatch = useDispatch();
  return (
    <ScrollView style={styles.body} {...props}>
      <View style={styles.header}>
        <FastImage
          source={require('../Assets/Images/DrawerImage.png')}
          priority={'normal'}
          resizeMode={'cover'}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.logoContainer}>
          <SignInLogo
            titleText={'CHEX'}
            dotTitleText={'.AI'}
            textStyle={styles.logo}
            nestedTextStyle={styles.logo}
          />
        </View>
      </View>
      <DrawerItemText
        text={'Intro'}
        Icon={<Home height={hp('3%')} width={wp('5%')} color={colors.black} />}
        onPress={() => props.navigation.navigate(ROUTES.INTRO)}
      />
      <DrawerItemText
        text={'New Inspection'}
        Icon={
          <Plus height={hp('2.5%')} width={wp('5%')} color={colors.black} />
        }
        onPress={() =>
          props.navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION)
        }
      />
      <DrawerItemText
        text={'Inspection Reviewed'}
        Icon={
          <InspectionReviewed
            height={hp('2.5%')}
            width={wp('5%')}
            color={colors.black}
          />
        }
        onPress={() => props.navigation.navigate(ROUTES.INSPECTION_REVIEWED)}
      />
      <DrawerItemText
        text={'Inspection Detail'}
        Icon={
          <InspectionDetails
            height={hp('2.5%')}
            width={wp('5%')}
            color={colors.black}
          />
        }
        onPress={() => props.navigation.navigate(ROUTES.INSPECTION_DETAIL)}
      />
      <DrawerItemText
        text={'Logout'}
        Icon={
          <Logout height={hp('3%')} width={wp('5%')} color={colors.black} />
        }
        onPress={() => {
          dispatch(SIGN_OUT_ACTION());
          props.navigation.navigate(ROUTES.SIGN_IN);
        }}
        // onPress={() => props.navigation.navigate(ROUTES.WELCOME)}
      />
      <StatusBar backgroundColor={'transparent'} barStyle={'light-content'} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    fontSize: hp('3%'),
  },
  logoContainer: {
    flex: 1,
    backgroundColor: 'rgba(150,0,0,0.2)',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  contentItem: {
    paddingLeft: '7%',
    paddingVertical: '5%',
    width: wp('100%'),
    backgroundColor: 'red',
  },
});
export default CustomDrawerContent;
