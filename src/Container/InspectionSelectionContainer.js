import React from 'react';
import {InspectionSelectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';

const InspectionSelectionContainer = ({navigation}) => {

  const handleNewInspectionPress = () =>
    navigation.navigate(ROUTES.NEW_INSPECTION);

  return <InspectionSelectionScreen handleNewInspectionPress={handleNewInspectionPress} />;
};

export default InspectionSelectionContainer;
