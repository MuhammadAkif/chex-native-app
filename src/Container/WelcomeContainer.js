import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {WelcomeScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';

const WelcomeContainer = () => {
  const navigation = useNavigation();

  const handleSignInPress = () => navigation.navigate(ROUTES.SIGN_IN);

  return (
    <WelcomeScreen
      handleSignInPress={handleSignInPress}
    />
  );
};

export default WelcomeContainer;
