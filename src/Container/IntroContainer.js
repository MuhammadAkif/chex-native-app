import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

import {IntroScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {HARDWARE_BACK_PRESS} from '../Constants';

const IntroContainer = ({navigation}) => {
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handleGoBack,
    );
    return () => backHandler.remove();
  }, []);
  const handleStartInspection = () =>
    navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION);

  return <IntroScreen handleStartInspection={handleStartInspection} />;
};

export default IntroContainer;
