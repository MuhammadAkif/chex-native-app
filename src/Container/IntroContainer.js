import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

import {IntroScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {HARDWARE_BACK_PRESS} from '../Constants';

const IntroContainer = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
  function handle_Hardware_Back_Press() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  }
  const handleStartInspection = () =>
    navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION);

  return <IntroScreen handleStartInspection={handleStartInspection} />;
};

export default IntroContainer;
