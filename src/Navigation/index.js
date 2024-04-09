import * as React from 'react';
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

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const {token} = useSelector(state => state.auth);
  const initialRouteName = token ? ROUTES.HOME : ROUTES.WELCOME;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeContainer} />
        <Stack.Screen name={ROUTES.REGISTER} component={RegisterContainer} />
        <Stack.Screen name={ROUTES.SIGN_IN} component={SignInContainer} />
        <Stack.Screen
          name={ROUTES.FORGET_PASSWORD}
          component={ForgotPasswordContainer}
        />
        <Stack.Screen
          name={ROUTES.RESET_PASSWORD}
          component={ResetPasswordContainer}
        />
        <Stack.Screen name={ROUTES.CAMERA} component={CameraContainer} />
        <Stack.Screen name={ROUTES.VIDEO} component={VideoContainer} />
        <Stack.Screen name={ROUTES.HOME} component={NavigationDrawer} />
        <Stack.Screen
          name={ROUTES.COMPLETED_INSPECTION}
          component={CompletedInspectionContainer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
