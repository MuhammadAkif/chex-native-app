import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
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
import {DrawerItemText} from './index';
import {Home, Logout, Info} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {SIGN_OUT_ACTION} from '../Store/Actions';
import {Types} from '../Store/Types';
import {DRAWER, PROJECT_NAME} from '../Constants';
import {IMAGES} from '../Assets/Images';

const CustomDrawerContent = props => {
  const dispatch = useDispatch();
  const route = useRoute();
  const activeRouteName = getFocusedRouteNameFromRoute(route);
  const [previousScreen, setPreviousScreen] = useState('');
  const [activeScreen, setActiveScreen] = useState('');
  let activeColor = colors.cobaltBlue;
  const activeColorOfTextAndIcon = screen => {
    return colors.black;
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

  const handleNavigationPress = (path, active_Screen) => {
    // setActiveScreen(activeScreen);
    props.navigation.toggleDrawer();
    if (active_Screen === DRAWER.LOGOUT) {
      props.navigation.reset({
        index: 0,
        routes: [{name: ROUTES.SIGN_IN}],
      });
    } else {
      props.navigation.navigate(path);
    }
  };
  const handleLogout = () => {
    dispatch(SIGN_OUT_ACTION());
    handleNavigationPress(ROUTES.SIGN_IN, DRAWER.LOGOUT);
  };
  return (
    <ScrollView style={styles.body} {...props}>
      <View style={styles.header}>
        <FastImage
          source={IMAGES.drawer}
          priority={'normal'}
          resizeMode={'cover'}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.logoContainer}>
          <SignInLogo
            titleText={PROJECT_NAME.CHEX}
            dotTitleText={PROJECT_NAME.AI}
            textStyle={styles.logo}
            nestedTextStyle={styles.logo}
          />
        </View>
      </View>
      <DrawerItemText
        text={DRAWER.HOME}
        textColor={activeColorOfTextAndIcon(DRAWER.HOME)}
        activeColor={activeScreen === DRAWER.HOME ? activeColor : 'transparent'}
        Icon={
          <TouchableOpacity
            onPress={() =>
              handleNavigationPress(ROUTES.INSPECTION_SELECTION, 'Home')
            }>
            <Home
              height={hp('3%')}
              width={wp('5%')}
              color={activeColorOfTextAndIcon('Home')}
            />
          </TouchableOpacity>
        }
        onPress={() =>
          handleNavigationPress(ROUTES.INSPECTION_SELECTION, 'Home')
        }
      />
      <DrawerItemText
        text={DRAWER.THINGS_YOU_WILL_REQUIRE}
        textColor={activeColorOfTextAndIcon('Intro')}
        activeColor={activeScreen === 'Intro' ? activeColor : 'transparent'}
        Icon={
          <Info
            height={hp('2.5%')}
            width={wp('5%')}
            color={activeColorOfTextAndIcon('Intro')}
          />
        }
        onPress={() => handleNavigationPress(ROUTES.INTRO, 'Intro ')}
      />
      {/*<DrawerItemText*/}
      {/*  text={'Inspection Reviewed'}*/}
      {/*  textColor={activeColorOfTextAndIcon('Inspection Reviewed')}*/}
      {/*  activeColor={*/}
      {/*    activeScreen === 'Inspection Reviewed' ? activeColor : 'transparent'*/}
      {/*  }*/}
      {/*  Icon={*/}
      {/*    <InspectionReviewed*/}
      {/*      height={hp('2.5%')}*/}
      {/*      width={wp('5%')}*/}
      {/*      color={activeColorOfTextAndIcon('Inspection Reviewed')}*/}
      {/*    />*/}
      {/*  }*/}
      {/*  onPress={() =>*/}
      {/*    handleNavigationPress(*/}
      {/*      ROUTES.INSPECTION_REVIEWED,*/}
      {/*      'Inspection Reviewed',*/}
      {/*    )*/}
      {/*  }*/}
      {/*/>*/}
      {/*<DrawerItemText*/}
      {/*  text={'Inspection Detail'}*/}
      {/*  textColor={activeColorOfTextAndIcon('Inspection Detail')}*/}
      {/*  activeColor={*/}
      {/*    activeScreen === 'Inspection Detail' ? activeColor : 'transparent'*/}
      {/*  }*/}
      {/*  Icon={*/}
      {/*    <InspectionDetails*/}
      {/*      height={hp('2.5%')}*/}
      {/*      width={wp('5%')}*/}
      {/*      color={activeColorOfTextAndIcon('Inspection Detail')}*/}
      {/*    />*/}
      {/*  }*/}
      {/*  onPress={() =>*/}
      {/*    handleNavigationPress(ROUTES.INSPECTION_DETAIL, 'Inspection Detail')*/}
      {/*  }*/}
      {/*/>*/}
      <DrawerItemText
        text={DRAWER.LOGOUT}
        textColor={colors.red}
        Icon={
          <TouchableOpacity onPress={handleLogout}>
            <Logout height={hp('3%')} width={wp('5%')} color={colors.red} />
          </TouchableOpacity>
        }
        onPress={handleLogout}
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
