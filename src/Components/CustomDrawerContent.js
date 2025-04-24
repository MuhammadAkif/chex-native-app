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
import {Home, Logout, Info} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {DRAWER, PROJECT_NAME} from '../Constants';
import {IMAGES} from '../Assets/Images';
import {useAuthActions} from '../hooks/auth';
import {useNewInspectionActions} from '../hooks/newInspection';
import {useUIActions, useUIState} from '../hooks/UI';

const {SIGN_IN, INSPECTION_SELECTION, INTRO, NEW_INSPECTION} = ROUTES;
const {cobaltBlue, black, red} = colors;

const CustomDrawerContent = props => {
  const {clearToast, setRequired} = useUIActions();
  const {resetInspection} = useNewInspectionActions();
  const {logout} = useAuthActions();
  const {toast} = useUIState();
  const route = useRoute();
  const {toggleDrawer, reset, navigate} = props.navigation;
  const activeRouteName = getFocusedRouteNameFromRoute(route);
  const [previousScreen, setPreviousScreen] = useState('');
  const [activeScreen, setActiveScreen] = useState('');
  let activeColor = cobaltBlue;
  const activeColorOfTextAndIcon = screen => {
    return black;
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
        textColor={activeColorOfTextAndIcon('Intro')}
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
