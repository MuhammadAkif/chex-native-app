import React, {useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';

import {SignInLogo, DrawerItemText} from './index';
import {ROUTES} from '../Navigation/ROUTES';
import {Home, Logout, Info} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {
  clearNewInspection,
  hideToast,
  setRequired,
  signOut,
} from '../Store/Actions';
import {DRAWER, PROJECT_NAME} from '../Constants';
import {IMAGES} from '../Assets/Images';

const {SIGN_IN, INSPECTION_SELECTION, INTRO, NEW_INSPECTION} = ROUTES;
const {black, red} = colors;
const {drawer} = IMAGES;
const {HOME, THINGS_YOU_WILL_REQUIRE, LOGOUT} = DRAWER;

const DRAWER_ITEMS = [
  {
    id: 'home',
    text: HOME,
    path: INSPECTION_SELECTION,
    Icon: props => <Home height={hp('3%')} width={wp('5%')} {...props} />,
    textColor: black,
  },
  {
    id: 'intro',
    text: THINGS_YOU_WILL_REQUIRE,
    path: INTRO,
    Icon: props => <Info height={hp('2.5%')} width={wp('5%')} {...props} />,
    textColor: black,
  },
  {
    id: 'logout',
    text: LOGOUT,
    path: SIGN_IN,
    Icon: props => <Logout height={hp('3%')} width={wp('5%')} {...props} />,
    textColor: red,
  },
];

const CustomDrawerContent = ({navigation, ...props}) => {
  const {toast} = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const route = useRoute();
  const {toggleDrawer, navigate} = navigation;
  const activeRouteName = getFocusedRouteNameFromRoute(route);

  useEffect(() => {
    const isLeavingNewInspection = activeRouteName !== NEW_INSPECTION;

    if (isLeavingNewInspection) {
      dispatch(clearNewInspection());
      dispatch(setRequired());
    }

    if (toast.visible) {
      dispatch(hideToast());
    }
  }, [activeRouteName, dispatch, toast.visible]);

  const handleNavigate = useCallback(
    (path, itemId) => {
      toggleDrawer();

      if (itemId === 'logout') {
        dispatch(signOut());
        return true;
      }

      navigate(path);
    },
    [dispatch, navigate, toggleDrawer],
  );

  const renderDrawerItem = useCallback(
    ({item}) => {
      const {id, text, textColor, Icon, path} = item;

      const onDrawerItemPress = () => handleNavigate(path, id);

      return (
        <DrawerItemText
          key={id}
          text={text}
          textColor={textColor}
          Icon={
            <TouchableOpacity onPress={onDrawerItemPress}>
              <Icon color={item.textColor} />
            </TouchableOpacity>
          }
          onPress={onDrawerItemPress}
        />
      );
    },
    [handleNavigate],
  );

  const keyExtractor = useCallback(item => item.id, []);

  const ListHeaderComponent = useCallback(
    () => (
      <View style={styles.header}>
        <FastImage
          source={drawer}
          priority="normal"
          resizeMode="cover"
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
    ),
    [],
  );

  const ListFooterComponent = useCallback(
    () => <StatusBar backgroundColor="transparent" barStyle="light-content" />,
    [],
  );

  return (
    <FlatList
      {...props}
      data={DRAWER_ITEMS}
      renderItem={renderDrawerItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={false}
      bounces={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
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
});

export default CustomDrawerContent;
