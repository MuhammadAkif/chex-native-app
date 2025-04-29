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
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

import {SignInLogo} from './index';
import {ROUTES} from '../Navigation/ROUTES';
import {DrawerItemText} from './index';
import {Home, Logout, Info, Device} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {DRAWER, PROJECT_NAME} from '../Constants';
import {IMAGES} from '../Assets/Images';
import {useAuthActions} from '../hooks/auth';
import {useNewInspectionActions} from '../hooks/newInspection';
import {useUIActions, useUIState} from '../hooks/UI';
import UserProfile from './UserProfile';

const {SIGN_IN, INSPECTION_SELECTION, INTRO, NEW_INSPECTION, DEVICE} = ROUTES;
const {cobaltBlue, black, red, royalBlue} = colors;
const textColor = black;

const CustomDrawerContent = props => {
  const {clearToast} = useUIActions();
  const {resetInspection, setRequired} = useNewInspectionActions();
  const {logout} = useAuthActions();
  const {toast} = useUIState();
  const route = useRoute();
  const {toggleDrawer, reset, navigate} = props.navigation;
  const activeRouteName = getFocusedRouteNameFromRoute(route);
  const [previousScreen, setPreviousScreen] = useState('');
  const [activeScreen, setActiveScreen] = useState('');
  let activeColor = cobaltBlue;
  const activeColorOfTextAndIcon = screen => {
    return royalBlue;
    // return activeRouteName.toLowerCase() === screen.toLowerCase()
    //   ? white
    //   : black;
  };
  useEffect(() => {
    if (
      activeRouteName !== NEW_INSPECTION &&
      previousScreen === NEW_INSPECTION
    ) {
      resetInspection();
      setRequired();
    }
    toast.visible && clearToast();
    setPreviousScreen(activeRouteName);
  }, [activeRouteName]);

  const handleNavigationPress = (path, active_Screen) => {
    // setActiveScreen(activeScreen);
    toggleDrawer();
    if (active_Screen === DRAWER.LOGOUT) {
      reset({
        index: 0,
        routes: [{name: SIGN_IN}],
      });
    } else {
      navigate(path);
    }
  };
  const handleLogout = () => {
    logout();
    handleNavigationPress(SIGN_IN, DRAWER.LOGOUT);
  };
  return (
    <ScrollView style={styles.body} {...props}>
      <View style={styles.header}>
        <FastImage
          source={IMAGES.red_drawer}
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
      <UserProfile />
      <DrawerItemText
        text={DRAWER.HOME}
        textColor={textColor}
        activeColor={activeScreen === DRAWER.HOME ? activeColor : 'transparent'}
        Icon={
          <TouchableOpacity
            onPress={() => handleNavigationPress(INSPECTION_SELECTION, 'Home')}>
            <Home
              height={hp('3%')}
              width={wp('5%')}
              color={activeColorOfTextAndIcon('Home')}
            />
          </TouchableOpacity>
        }
        onPress={() => handleNavigationPress(INSPECTION_SELECTION, 'Home')}
      />
      <DrawerItemText
        text={DRAWER.THINGS_YOU_WILL_REQUIRE}
        textColor={textColor}
        activeColor={activeScreen === 'Intro' ? activeColor : 'transparent'}
        Icon={
          <Info
            height={hp('2.5%')}
            width={wp('5%')}
            color={activeColorOfTextAndIcon('Intro')}
          />
        }
        onPress={() => handleNavigationPress(INTRO, 'Intro ')}
      />
      <DrawerItemText
        text={DRAWER.DEVICE}
        textColor={textColor}
        activeColor={activeScreen === 'Device' ? activeColor : 'transparent'}
        Icon={
          <Device
            height={hp('2.5%')}
            width={wp('5%')}
            color={activeColorOfTextAndIcon('Device')}
          />
        }
        onPress={() => handleNavigationPress(DEVICE, 'Device ')}
      />
      <DrawerItemText
        text={DRAWER.LOGOUT}
        textColor={red}
        Icon={
          <TouchableOpacity onPress={handleLogout}>
            <Logout height={hp('3%')} width={wp('5%')} color={red} />
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
    top: hp('7%'),
    // backgroundColor: 'rgba(150,0,0,0.2)',
  },
  header: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
});
export default CustomDrawerContent;
