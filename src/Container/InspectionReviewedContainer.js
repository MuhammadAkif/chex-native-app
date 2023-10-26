import React, {useState} from 'react';

import InspectionReviewedScreen from '../Screens/InspectionReviewedScreen';

const InspectionReviewedContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleIsExpanded = () => setIsExpanded(!isExpanded);
  return (
    <InspectionReviewedScreen
      handleIsExpanded={handleIsExpanded}
      isExpanded={isExpanded}
    />
  );
};

export default InspectionReviewedContainer;
