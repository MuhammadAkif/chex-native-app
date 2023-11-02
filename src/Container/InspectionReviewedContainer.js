import React, {useState} from 'react';

import InspectionReviewedScreen from '../Screens/InspectionReviewedScreen';

const InspectionReviewedContainer = ({navigation}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleIsExpanded = () => setIsExpanded(!isExpanded);
  return (
    <InspectionReviewedScreen
      handleIsExpanded={handleIsExpanded}
      isExpanded={isExpanded}
      navigation={navigation}
    />
  );
};

export default InspectionReviewedContainer;
