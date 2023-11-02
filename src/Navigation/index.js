import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  RegisterContainer,
  WelcomeContainer,
  SignInContainer,
  InspectionSelectionContainer,
  CameraContainer,
  VideoContainer,
  CompletedInspectionContainer,
} from '../Container';
import {ROUTES} from './ROUTES';
import NavigationDrawer from './NavigationDrawer';
import {useSelector} from 'react-redux';

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const {token} = useSelector(state => state.auth);
  const initialRouteName = token ? ROUTES.HOME : ROUTES.WELCOME;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeContainer} />
        <Stack.Screen name={ROUTES.REGISTER} component={RegisterContainer} />
        <Stack.Screen name={ROUTES.SIGN_IN} component={SignInContainer} />
        <Stack.Screen name={ROUTES.CAMERA} component={CameraContainer} />
        <Stack.Screen name={ROUTES.VIDEO} component={VideoContainer} />
        <Stack.Screen name={ROUTES.HOME} component={NavigationDrawer} />
        <Stack.Screen
          name={ROUTES.INSPECTION_SELECTION}
          component={InspectionSelectionContainer}
        />
        <Stack.Screen
          name={ROUTES.COMPLETED_INSPECTION}
          component={CompletedInspectionContainer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
