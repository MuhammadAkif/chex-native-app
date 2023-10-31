import React from 'react';
import {InspectionSelectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';

const InspectionSelectionContainer = ({navigation}) => {
  const handleNewInspectionPress = () =>
    navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION);

  return (
    <InspectionSelectionScreen
      handleNewInspectionPress={handleNewInspectionPress}
    />
  );
};

export default InspectionSelectionContainer;
