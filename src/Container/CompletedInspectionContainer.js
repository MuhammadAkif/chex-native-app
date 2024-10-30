import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

import CompletedInspectionScreen from '../Screens/CompletedInspectionScreen';
import {HARDWARE_BACK_PRESS} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';

const {INSPECTION_SELECTION} = ROUTES;

const CompletedInspectionContainer = ({navigation}) => {
  const {canGoBack, navigate} = navigation;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);

  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      navigate(INSPECTION_SELECTION);
      return true;
    }
    return false;
  }

  return <CompletedInspectionScreen navigation={navigation} />;
};

export default CompletedInspectionContainer;
