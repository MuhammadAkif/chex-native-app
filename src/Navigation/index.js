import React, {useEffect} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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

const {Screen, Navigator} = createNativeStackNavigator();
const screenOptions = {headerShown: false, gestureEnabled: false};

const Navigation = () => {
  const {token} = useAuth();
  const initialRouteName = token ? HOME : WELCOME;
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (token && navigationRef.current) {
      navigationRef.current.navigate(HOME);
    }
  }, [token]);

  const onNavigationReady = () => {
    setNavigationRef(navigationRef);
  };

  return (
    <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
      <Navigator
        initialRouteName={initialRouteName}
        screenOptions={screenOptions}>
        {!token ? (
          // Auth Stack
          <>
            <Screen name={WELCOME} component={WelcomeContainer} />
            <Screen name={REGISTER} component={RegisterContainer} />
            <Screen name={SIGN_IN} component={SignInContainer} />
            <Screen
              name={FORGET_PASSWORD}
              component={ForgotPasswordContainer}
            />
            <Screen name={RESET_PASSWORD} component={ResetPasswordContainer} />
          </>
        ) : (
          // App Stack
          <>
            <Screen name={HOME} component={NavigationDrawer} />
            <Screen name={CAMERA} component={CameraContainer} />
            <Screen name={VIDEO} component={VideoContainer} />
            <Screen
              name={COMPLETED_INSPECTION}
              component={CompletedInspectionContainer}
            />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
