import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {ROUTES} from './ROUTES';
import {
  IntroContainer,
  NewInspectionContainer,
  InspectionReviewedContainer,
  InspectionDetailContainer,
  LicensePlateNumberSelectionContainer,
  InspectionInProgressContainer,
  InspectionSelectionContainer,
} from '../Container';
import {
  HeaderBackButton,
  HeaderTitle,
  HeaderBackground,
  CustomDrawerContent,
} from '../Components';
import {Types} from '../Store/Types';
import {SESSION_EXPIRED} from '../Constants';

const options = {
  headerTitleAlign: 'center',
  headerTitle: props => <HeaderTitle {...props} />,
  headerBackground: () => <HeaderBackground />,
};
const screenOptions = {
  headerTitle: () => <HeaderTitle />,
  drawerType: 'front',
  drawerStatusBarAnimation: 'slide',
  headerLeft: () => <HeaderBackButton />,
};
const drawerContent = props => <CustomDrawerContent {...props} />;
const {TITLE, MESSAGE, BUTTON} = SESSION_EXPIRED;

const NavigationDrawer = ({navigation}) => {
  const Drawer = createDrawerNavigator();
  const dispatch = useDispatch();

  const {sessionExpired} = useSelector(state => state?.auth);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const {
    INSPECTION_SELECTION,
    INTRO,
    LICENSE_PLATE_SELECTION,
    NEW_INSPECTION,
    INSPECTION_REVIEWED,
    INSPECTION_DETAIL,
    INSPECTION_IN_PROGRESS,
    SIGN_IN,
  } = ROUTES;

  const handleOkPress = () => {
    dispatch({type: Types.SIGN_OUT});
    navigation.reset({
      index: 0,
      routes: [{name: SIGN_IN}],
    });
  };
  return (
    <>
      <Drawer.Navigator
        backBehavior={'history'}
        drawerContent={drawerContent}
        screenOptions={screenOptions}
        initialRouteName={INSPECTION_SELECTION}>
        <Drawer.Screen
          name={INSPECTION_SELECTION}
          component={InspectionSelectionContainer}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name={INTRO}
          component={IntroContainer}
          options={options}
        />
        <Drawer.Screen
          name={LICENSE_PLATE_SELECTION}
          component={LicensePlateNumberSelectionContainer}
          options={options}
        />
        <Drawer.Screen
          name={NEW_INSPECTION}
          component={NewInspectionContainer}
          options={options}
        />
        <Drawer.Screen
          name={INSPECTION_REVIEWED}
          component={InspectionReviewedContainer}
          options={options}
        />
        <Drawer.Screen
          name={INSPECTION_DETAIL}
          component={InspectionDetailContainer}
          options={options}
        />
        <Drawer.Screen
          name={INSPECTION_IN_PROGRESS}
          component={InspectionInProgressContainer}
          options={options}
        />
      </Drawer.Navigator>
      {sessionExpired &&
        Alert.alert(TITLE, MESSAGE, [{text: BUTTON, onPress: handleOkPress}])}
    </>
  );
};

export default NavigationDrawer;
