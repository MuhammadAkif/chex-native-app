import {getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';

import {Home, Info, Logout} from '../Assets/Icons';
import {IMAGES} from '../Assets/Images';
import {colors} from '../Assets/Styles';
import {DRAWER, PROJECT_NAME} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {clearNewInspection, hideToast, setRequired, signOut} from '../Store/Actions';
import {DrawerItemText, SignInLogo} from './index';

const {SIGN_IN, INSPECTION_SELECTION, INTRO, NEW_INSPECTION} = ROUTES;
const {cobaltBlue, black, red} = colors;

const CustomDrawerContent = props => {
  const {toast} = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const route = useRoute();
  const {toggleDrawer, reset, navigate, replace} = props.navigation;
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
    const isLeavingNewInspection = previousScreen === NEW_INSPECTION && activeRouteName !== NEW_INSPECTION;
    const isLeavingChecklist = previousScreen === ROUTES.DVIR_INSPECTION_CHECKLIST && activeRouteName !== ROUTES.DVIR_INSPECTION_CHECKLIST;
    const isChecklistFromNewInspection = previousScreen === NEW_INSPECTION && activeRouteName === ROUTES.DVIR_INSPECTION_CHECKLIST;

    if ((isLeavingNewInspection || isLeavingChecklist) && !isChecklistFromNewInspection) {
      console.log('⚠️ REDUX INSPECTION DATA CLEARED FROM CUSTOM DRAWER USEEFFECT ⚠️');
      dispatch(clearNewInspection());
      dispatch(setRequired());
    }

    if (toast.visible) {
      dispatch(hideToast());
    }

    setPreviousScreen(activeRouteName);
  }, [activeRouteName, previousScreen, toast.visible, dispatch]);

  const handleNavigationPress = (path, active_Screen) => {
    // setActiveScreen(activeScreen);
    toggleDrawer();
    if (active_Screen === DRAWER.LOGOUT) {
      replace('AuthStack');
      setTimeout(() => {
        dispatch(signOut());
      }, 100);
    } else {
      navigate(path);
    }
  };
  const handleLogout = () => {
    handleNavigationPress(SIGN_IN, DRAWER.LOGOUT);
  };
  return (
    <ScrollView style={styles.body} {...props}>
      <View style={styles.header}>
        <FastImage source={IMAGES.drawer} priority={'normal'} resizeMode={'cover'} style={StyleSheet.absoluteFillObject} />
        <View style={styles.logoContainer}>
          <SignInLogo titleText={PROJECT_NAME.CHEX} dotTitleText={PROJECT_NAME.AI} textStyle={styles.logo} nestedTextStyle={styles.logo} />
        </View>
      </View>
      <DrawerItemText
        text={DRAWER.HOME}
        textColor={activeColorOfTextAndIcon(DRAWER.HOME)}
        activeColor={activeScreen === DRAWER.HOME ? activeColor : 'transparent'}
        Icon={
          <TouchableOpacity onPress={() => handleNavigationPress(INSPECTION_SELECTION, 'Home')}>
            <Home height={hp('3%')} width={wp('5%')} color={activeColorOfTextAndIcon('Home')} />
          </TouchableOpacity>
        }
        onPress={() => handleNavigationPress(INSPECTION_SELECTION, 'Home')}
      />
      <DrawerItemText
        text={DRAWER.THINGS_YOU_WILL_REQUIRE}
        textColor={activeColorOfTextAndIcon('Intro')}
        activeColor={activeScreen === 'Intro' ? activeColor : 'transparent'}
        Icon={<Info height={hp('2.5%')} width={wp('5%')} color={activeColorOfTextAndIcon('Intro')} />}
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
