import React from 'react';

import {WelcomeScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';

const WelcomeContainer = ({navigation}) => {
  const handleSignInPress = () => navigation.navigate(ROUTES.SIGN_IN);

  return <WelcomeScreen handleSignInPress={handleSignInPress} />;
};

export default WelcomeContainer;
