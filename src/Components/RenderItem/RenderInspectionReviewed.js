import React from 'react';

import {
  InspectionStatusCollapsedCard,
  InspectionStatusExpandedCard,
} from '../index';
import {extractDate} from '../../Utils';

const RenderInspectionReviewed = ({
  item,
  handleIsExpanded,
  isExpanded,
  inspectionDetailsPress,
  isLoading,
}) => (
  <>
    <InspectionStatusCollapsedCard
      textOne={item?.inspectionCode}
      textTwo={extractDate(item?.createdAt)}
      index={1}
      isReviewed={item?.status === 'REVIEWED' ? 'Reviewed' : 'In Review'}
      labelOne={'Tracking ID'}
      labelTwo={'Date Created'}
      isActive={isExpanded.includes(item.id)}
      onPress={() => handleIsExpanded(item?.id)}
    />
    {isExpanded.includes(item?.id) && item?.status === 'REVIEWED' && (
      <InspectionStatusExpandedCard
        inspectionID={item?.id}
        inspectionDetailsPress={inspectionDetailsPress}
        isLoading={isLoading}
      />
    )}
  </>
);

export default RenderInspectionReviewed;
