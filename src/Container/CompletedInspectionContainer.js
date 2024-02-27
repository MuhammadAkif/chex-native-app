import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

import CompletedInspectionScreen from '../Screens/CompletedInspectionScreen';
import {HARDWARE_BACK_PRESS} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';

const CompletedInspectionContainer = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      () => {
        if (navigation.canGoBack()) {
          navigation.navigate(ROUTES.INSPECTION_SELECTION);
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, []);
  return <CompletedInspectionScreen navigation={navigation} />;
};

export default CompletedInspectionContainer;
