import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

import {
  CameraContainer,
  VideoContainer,
  CompletedInspectionContainer,
  DVIRInspectionChecklistContainer,
  DVIRVehicleInfoContainer,
  InspectionDetailContainer,
  InspectionInProgressContainer,
  IntroContainer,
  LicensePlateNumberSelectionContainer,
  NewInspectionContainer,
} from '../Container';

import {ROUTES, STACKS} from './ROUTES';
import {navigationRef} from '../services/navigationService';
import BottomTab from './bottomTab';
import {AuthStack} from './stacks';

const Stack = createNativeStackNavigator();

// ----------------------
// ROOT NAVIGATION
// ----------------------
const RootNavigation = () => {
  const token = useSelector(state => state?.auth?.user?.token);
  const initialRouteName = token ? ROUTES.TABS : STACKS.AUTH_STACK;
  const screenOptions = {headerShown: false, gestureEnabled: false};

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={screenOptions}>
        {/* AUTH STACK */}
        <Stack.Screen name={STACKS.AUTH_STACK} component={AuthStack} />

        <Stack.Screen name={ROUTES.TABS} component={BottomTab} />

        <Stack.Screen name={ROUTES.INSPECTION_IN_PROGRESS} component={InspectionInProgressContainer} />
        <Stack.Screen name={ROUTES.CAMERA} component={CameraContainer} />
        <Stack.Screen name={ROUTES.VIDEO} component={VideoContainer} />
        <Stack.Screen name={ROUTES.COMPLETED_INSPECTION} component={CompletedInspectionContainer} />

        <Stack.Screen name={ROUTES.INTRO} component={IntroContainer} />
        <Stack.Screen name={ROUTES.LICENSE_PLATE_SELECTION} component={LicensePlateNumberSelectionContainer} />
        <Stack.Screen name={ROUTES.NEW_INSPECTION} component={NewInspectionContainer} />
        <Stack.Screen name={ROUTES.INSPECTION_DETAIL} component={InspectionDetailContainer} />
        <Stack.Screen name={ROUTES.DVIR_INSPECTION_CHECKLIST} component={DVIRInspectionChecklistContainer} />
        <Stack.Screen name={ROUTES.DVIR_VEHICLE_INFO} component={DVIRVehicleInfoContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
