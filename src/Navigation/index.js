import React from 'react';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';

import {
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

import {ROUTES, STACKS} from './ROUTES';
import {navigationRef} from '../services/navigationService';
import {CustomDrawerContent} from '../Components';
import {drawerScreenOptions, headerOptions} from './navigationOptions';
import BottomTab from './bottomTab';
import {AuthStack} from './stacks';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ----------------------
// ROOT NAVIGATION
// ----------------------
const RootNavigation = () => {
  const token = useSelector(state => state?.auth?.user?.token);
  const initialRouteName = token ? ROUTES.DRAWER : STACKS.AUTH_STACK;
  const screenOptions = {headerShown: false, gestureEnabled: false};

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{...screenOptions}}>
        {/* AUTH STACK */}
        <Stack.Screen name={STACKS.AUTH_STACK} component={AuthStack} />

        {/* HOME STACK DRAWER */}
        <Stack.Screen name={ROUTES.DRAWER} component={AppDrawer} />

        <Stack.Screen name={ROUTES.INSPECTION_IN_PROGRESS} component={InspectionInProgressContainer} />
        <Stack.Screen name={ROUTES.CAMERA} component={CameraContainer} />
        <Stack.Screen name={ROUTES.VIDEO} component={VideoContainer} />
        <Stack.Screen name={ROUTES.COMPLETED_INSPECTION} component={CompletedInspectionContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

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
    initialRouteName={ROUTES.Tabs}>
    <Drawer.Screen name={ROUTES.Tabs} component={BottomTab} options={headerOptions} />
    <Drawer.Screen name={ROUTES.INSPECTION_SELECTION} component={InspectionSelectionContainer} options={{headerShown: false}} />
    <Drawer.Screen name={ROUTES.INTRO} component={IntroContainer} options={headerOptions} />
    <Drawer.Screen name={ROUTES.LICENSE_PLATE_SELECTION} component={LicensePlateNumberSelectionContainer} options={headerOptions} />
    <Drawer.Screen layout={({children}) => children} name={ROUTES.NEW_INSPECTION} component={NewInspectionContainer} options={headerOptions} />
    {/* <Drawer.Screen name={ROUTES.INSPECTION_REVIEWED} component={InspectionReviewedContainer} options={headerOptions} /> */}
    <Drawer.Screen name={ROUTES.INSPECTION_DETAIL} component={InspectionDetailContainer} options={headerOptions} />
    <Drawer.Screen
      layout={({children}) => children}
      name={ROUTES.DVIR_INSPECTION_CHECKLIST}
      component={DVIRInspectionChecklistContainer}
      options={headerOptions}
    />
    <Drawer.Screen layout={({children}) => children} name={ROUTES.DVIR_VEHICLE_INFO} component={DVIRVehicleInfoContainer} options={headerOptions} />
  </Drawer.Navigator>
);

export default RootNavigation;
