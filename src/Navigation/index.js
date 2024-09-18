import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
} from '../Container';
import {ROUTES} from './ROUTES';
import NavigationDrawer from './NavigationDrawer';

const {
  HOME,
  WELCOME,
  REGISTER,
  SIGN_IN,
  FORGET_PASSWORD,
  RESET_PASSWORD,
  CAMERA,
  VIDEO,
  COMPLETED_INSPECTION,
} = ROUTES;

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const token = useSelector(state => state?.auth?.user?.token);
  const initialRouteName = token ? HOME : WELCOME;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen name={WELCOME} component={WelcomeContainer} />
        <Stack.Screen name={REGISTER} component={RegisterContainer} />
        <Stack.Screen name={SIGN_IN} component={SignInContainer} />
        <Stack.Screen
          name={FORGET_PASSWORD}
          component={ForgotPasswordContainer}
        />
        <Stack.Screen
          name={RESET_PASSWORD}
          component={ResetPasswordContainer}
        />
        <Stack.Screen name={CAMERA} component={CameraContainer} />
        <Stack.Screen name={VIDEO} component={VideoContainer} />
        <Stack.Screen name={HOME} component={NavigationDrawer} />
        <Stack.Screen
          name={COMPLETED_INSPECTION}
          component={CompletedInspectionContainer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
