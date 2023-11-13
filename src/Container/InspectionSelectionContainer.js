import React from 'react';

import {InspectionSelectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';

const InspectionSelectionContainer = ({navigation}) => {
  const handleNewInspectionPress = () =>
    navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION);
  const handleInspectionInProgressPress = () =>
    navigation.navigate(ROUTES.INSPECTION_IN_PROGRESS);
  const handleInspectionReviewedPress = () =>
    navigation.navigate(ROUTES.INSPECTION_REVIEWED);

  return (
    <InspectionSelectionScreen
      handleNewInspectionPress={handleNewInspectionPress}
      handleInspectionInProgressPress={handleInspectionInProgressPress}
      handleInspectionReviewedPress={handleInspectionReviewedPress}
    />
  );
};

export default InspectionSelectionContainer;
