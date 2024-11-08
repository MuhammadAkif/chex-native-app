import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
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
import {setNavigationRef} from '../services/navigationService';
import {useAuth} from '../hooks';

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
  const {Screen, Navigator} = createNativeStackNavigator();
  const {token} = useAuth();
  const initialRouteName = token ? HOME : WELCOME;
  const screenOptions = {headerShown: false, gestureEnabled: false};
  const navigationRef = useNavigationContainerRef();

  function onNavigationReady() {
    setNavigationRef(navigationRef);
  }

  return (
    <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
      <Navigator
        initialRouteName={initialRouteName}
        screenOptions={screenOptions}>
        <Screen name={WELCOME} component={WelcomeContainer} />
        <Screen name={REGISTER} component={RegisterContainer} />
        <Screen name={SIGN_IN} component={SignInContainer} />
        <Screen name={FORGET_PASSWORD} component={ForgotPasswordContainer} />
        <Screen name={RESET_PASSWORD} component={ResetPasswordContainer} />
        <Screen name={CAMERA} component={CameraContainer} />
        <Screen name={VIDEO} component={VideoContainer} />
        <Screen name={HOME} component={NavigationDrawer} />
        <Screen
          name={COMPLETED_INSPECTION}
          component={CompletedInspectionContainer}
        />
      </Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
