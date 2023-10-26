import React from 'react';
import {IntroScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';

const IntroContainer = ({navigation}) => {
  const handleStartInspection = () =>
    navigation.navigate(ROUTES.INSPECTION_SELECTION);
  return <IntroScreen handleStartInspection={handleStartInspection} />;
};

export default IntroContainer;
