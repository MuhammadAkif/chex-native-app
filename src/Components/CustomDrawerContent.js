import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, StatusBar} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

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
import {Types} from '../Store/Types';

const CustomDrawerContent = props => {
  const dispatch = useDispatch();
  const route = useRoute();
  const activeRouteName = getFocusedRouteNameFromRoute(route);
  const [previousScreen, setPreviousScreen] = useState('');
  const [activeScreen, setActiveScreen] = useState('');
  let activeColor = colors.cobaltBlue;
  const activeColorOfTextAndIcon = screen => {
    // return activeRouteName.toLowerCase() === screen.toLowerCase()
    //   ? colors.white
    //   : colors.black;
  };
  useEffect(() => {
    if (
      activeRouteName !== 'NEW INSPECTION' &&
      previousScreen === 'NEW INSPECTION'
    ) {
      dispatch({type: Types.CLEAR_NEW_INSPECTION});
    }
    setPreviousScreen(activeRouteName);
  }, [activeRouteName]);

  const handleNavigationPress = (path, activeScreen) => {
    // setActiveScreen(activeScreen);
    props.navigation.navigate(path);
  };
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
        textColor={activeColorOfTextAndIcon('Intro')}
        activeColor={activeScreen === 'Intro' ? activeColor : 'transparent'}
        Icon={
          <Home
            height={hp('3%')}
            width={wp('5%')}
            color={activeColorOfTextAndIcon('Intro')}
          />
        }
        onPress={() => handleNavigationPress(ROUTES.INTRO, 'Intro')}
      />
      <DrawerItemText
        text={'New Inspection'}
        textColor={activeColorOfTextAndIcon('LICENSE PLATE SELECTION')}
        activeColor={
          activeScreen === 'LICENSE PLATE SELECTION'
            ? activeColor
            : 'transparent'
        }
        Icon={
          <Plus
            height={hp('2.5%')}
            width={wp('5%')}
            color={activeColorOfTextAndIcon('LICENSE PLATE SELECTION')}
          />
        }
        onPress={() =>
          handleNavigationPress(
            ROUTES.LICENSE_PLATE_SELECTION,
            'LICENSE PLATE SELECTION',
          )
        }
      />
      <DrawerItemText
        text={'Inspection Reviewed'}
        textColor={activeColorOfTextAndIcon('Inspection Reviewed')}
        activeColor={
          activeScreen === 'Inspection Reviewed' ? activeColor : 'transparent'
        }
        Icon={
          <InspectionReviewed
            height={hp('2.5%')}
            width={wp('5%')}
            color={activeColorOfTextAndIcon('Inspection Reviewed')}
          />
        }
        onPress={() =>
          handleNavigationPress(
            ROUTES.INSPECTION_REVIEWED,
            'Inspection Reviewed',
          )
        }
      />
      <DrawerItemText
        text={'Inspection Detail'}
        textColor={activeColorOfTextAndIcon('Inspection Detail')}
        activeColor={
          activeScreen === 'Inspection Detail' ? activeColor : 'transparent'
        }
        Icon={
          <InspectionDetails
            height={hp('2.5%')}
            width={wp('5%')}
            color={activeColorOfTextAndIcon('Inspection Detail')}
          />
        }
        onPress={() =>
          handleNavigationPress(ROUTES.INSPECTION_DETAIL, 'Inspection Detail')
        }
      />
      <DrawerItemText
        text={'Logout'}
        textColor={colors.red}
        Icon={<Logout height={hp('3%')} width={wp('5%')} color={colors.red} />}
        onPress={() => {
          dispatch(SIGN_OUT_ACTION());
          handleNavigationPress(ROUTES.SIGN_IN, '');
        }}
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
});
export default CustomDrawerContent;
