import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

import CompletedInspectionScreen from '../Screens/CompletedInspectionScreen';
import {ROUTES} from '../Navigation/ROUTES';

const CompletedInspectionContainer = ({navigation}) => {
  const handleThankYouPress = () => navigation.replace(ROUTES.INTRO);
  return (
    <CompletedInspectionScreen handleThankYouPress={handleThankYouPress} />
  );
};

export default CompletedInspectionContainer;
