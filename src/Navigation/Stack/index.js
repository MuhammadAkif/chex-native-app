import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

import {
  CameraContainer,
  CompletedInspectionContainer,
  ForgotPasswordContainer,
  RegisterContainer,
  ResetPasswordContainer,
  SignInContainer,
  VideoContainer,
  WelcomeContainer,
} from '../../Container';
import NavigationDrawer from '../NavigationDrawer';
import {INITIAL_ROUTE} from '../../Utils/helpers';
import {isNotEmpty} from '../../Utils';
import {ROUTES} from '../ROUTES';

const Stack = () => {
  const HOME_STACK = createNativeStackNavigator();
  const {token} = useSelector(state => state.auth);
  const initialRouteName = INITIAL_ROUTE[isNotEmpty(token)];
  const screenOptions = {headerShown: false, gestureEnabled: false};
  const {
    WELCOME,
    REGISTER,
    SIGN_IN,
    FORGET_PASSWORD,
    RESET_PASSWORD,
    CAMERA,
    VIDEO,
    HOME,
    COMPLETED_INSPECTION,
  } = ROUTES;

  return (
    <HOME_STACK.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}>
      <HOME_STACK.Screen name={WELCOME} component={WelcomeContainer} />
      <HOME_STACK.Screen name={REGISTER} component={RegisterContainer} />
      <HOME_STACK.Screen name={SIGN_IN} component={SignInContainer} />
      <HOME_STACK.Screen
        name={FORGET_PASSWORD}
        component={ForgotPasswordContainer}
      />
      <HOME_STACK.Screen
        name={RESET_PASSWORD}
        component={ResetPasswordContainer}
      />
      <HOME_STACK.Screen name={CAMERA} component={CameraContainer} />
      <HOME_STACK.Screen name={VIDEO} component={VideoContainer} />
      <HOME_STACK.Screen name={HOME} component={NavigationDrawer} />
      <HOME_STACK.Screen
        name={COMPLETED_INSPECTION}
        component={CompletedInspectionContainer}
      />
    </HOME_STACK.Navigator>
  );
};
export default Stack;
