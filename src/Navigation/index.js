import React, {useRef} from 'react';
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
import {trackScreenView} from '../services/fullstoryService';
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
  const routeNameRef = useRef(null);

  /**
   * Track screen views in FullStory when navigation state changes
   */
  const handleNavigationStateChange = () => {
    const previousRouteName = routeNameRef.current;
    const currentRoute = navigationRef.getCurrentRoute();

    if (currentRoute && currentRoute.name !== previousRouteName) {
      // Track the screen view in FullStory
      trackScreenView(currentRoute.name, {
        routeName: currentRoute.name,
        params: currentRoute.params ? Object.keys(currentRoute.params) : [],
      });

      routeNameRef.current = currentRoute.name;
    }
  };

  /**
   * Initialize screen tracking when navigation is ready
   */
  const handleNavigationReady = () => {
    const currentRoute = navigationRef.getCurrentRoute();
    if (currentRoute) {
      routeNameRef.current = currentRoute.name;
      // Track initial screen
      trackScreenView(currentRoute.name, {
        routeName: currentRoute.name,
        isInitialRoute: true,
      });
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationReady}
      onStateChange={handleNavigationStateChange}>
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
