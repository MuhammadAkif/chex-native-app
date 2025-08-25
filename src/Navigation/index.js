import React from 'react';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';

import {
  RegisterContainer,
  WelcomeContainer,
  SignInContainer,
  ResetPasswordContainer,
  ForgotPasswordContainer,
  CameraContainer,
  VideoContainer,
  CompletedInspectionContainer,
  InspectionSelectionContainer,
  DVIRInspectionChecklistContainer,
  DVIRVehicleInfoContainer,
  InspectionDetailContainer,
  InspectionInProgressContainer,
  InspectionReviewedContainer,
  IntroContainer,
  LicensePlateNumberSelectionContainer,
  NewInspectionContainer,
} from '../Container';

import {ROUTES} from './ROUTES';
import {navigationRef} from '../services/navigationService';
import {CustomDrawerContent} from '../Components';
import {drawerScreenOptions, stackScreenOptions, headerOptions} from './navigationOptions';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ----------------------
// ROOT NAVIGATION
// ----------------------
const RootNavigation = () => {
  const token = useSelector(state => state?.auth?.user?.token);
  const initialRouteName = token ? ROUTES.HOME : 'AuthStack';
  const screenOptions = {headerShown: false, gestureEnabled: false};

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={screenOptions}>
        {/* AUTH STACK */}
        <Stack.Screen name={'AuthStack'} component={AuthStack} />

        {/* HOME STACK DRAWER */}
        <Stack.Screen name={ROUTES.HOME} component={AppDrawer} />

        <Stack.Screen name={ROUTES.CAMERA} component={CameraContainer} />
        <Stack.Screen name={ROUTES.VIDEO} component={VideoContainer} />
        <Stack.Screen name={ROUTES.COMPLETED_INSPECTION} component={CompletedInspectionContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ----------------------
// AUTH STACK
// ----------------------
const AuthStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.WELCOME} screenOptions={stackScreenOptions}>
    <Stack.Screen name={ROUTES.WELCOME} component={WelcomeContainer} />
    <Stack.Screen name={ROUTES.REGISTER} component={RegisterContainer} />
    <Stack.Screen name={ROUTES.SIGN_IN} component={SignInContainer} />
    <Stack.Screen name={ROUTES.FORGET_PASSWORD} component={ForgotPasswordContainer} />
    <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPasswordContainer} />
  </Stack.Navigator>
);

function UnmountOnBlur({children}) {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return children;
}

// ----------------------
// APP DRAWER
// ----------------------
const AppDrawer = () => (
  <Drawer.Navigator
    backBehavior="history"
    screenLayout={({children}) => <UnmountOnBlur>{children}</UnmountOnBlur>}
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={drawerScreenOptions}
    initialRouteName={ROUTES.INSPECTION_SELECTION}>
    <Drawer.Screen name={ROUTES.INSPECTION_SELECTION} component={InspectionSelectionContainer} options={{headerShown: false}} />
    <Drawer.Screen name={ROUTES.INTRO} component={IntroContainer} options={headerOptions} />
    <Drawer.Screen name={ROUTES.LICENSE_PLATE_SELECTION} component={LicensePlateNumberSelectionContainer} options={headerOptions} />
    <Drawer.Screen layout={({children}) => children} name={ROUTES.NEW_INSPECTION} component={NewInspectionContainer} options={headerOptions} />
    <Drawer.Screen name={ROUTES.INSPECTION_REVIEWED} component={InspectionReviewedContainer} options={headerOptions} />
    <Drawer.Screen name={ROUTES.INSPECTION_DETAIL} component={InspectionDetailContainer} options={headerOptions} />
    <Drawer.Screen name={ROUTES.INSPECTION_IN_PROGRESS} component={InspectionInProgressContainer} options={headerOptions} />
    <Drawer.Screen
      layout={({children}) => children}
      name={ROUTES.DVIR_INSPECTION_CHECKLIST}
      component={DVIRInspectionChecklistContainer}
      options={headerOptions}
    />
    <Drawer.Screen name={ROUTES.DVIR_VEHICLE_INFO} component={DVIRVehicleInfoContainer} options={headerOptions} />
  </Drawer.Navigator>
);

export default RootNavigation;
