import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

import {CompletedInspectionScreen} from '../Screens';
import {HARDWARE_BACK_PRESS} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {useBoolean} from '../hooks';

const {INSPECTION_SELECTION} = ROUTES;

const CompletedInspectionContainer = ({navigation}) => {
  const {canGoBack, navigate} = navigation;
  const {value: boxVisible, setTrue, setFalse, reset, toggle} = useBoolean(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, handle_Hardware_Back_Press);
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    return resetAllStates;
  }, []);

  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      navigation.popTo(ROUTES.HOME);
      return true;
    }
    return false;
  }
  function resetAllStates() {
    reset();
  }
  return <CompletedInspectionScreen navigation={navigation} boxVisible={boxVisible} />;
};

export default CompletedInspectionContainer;
