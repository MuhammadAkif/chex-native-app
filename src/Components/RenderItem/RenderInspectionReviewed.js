import React from 'react';

import {
  InspectionStatusCollapsedCard,
  InspectionStatusExpandedCard,
} from '../index';
import {extractDate} from '../../Utils';
import {STATUSES} from '../../Constants';

const RenderInspectionReviewed = ({
  item,
  handleIsExpanded,
  isExpanded,
  inspectionDetailsPress,
  isLoading,
  selectedInspectionID,
}) => (
  <>
    <InspectionStatusCollapsedCard
      textOne={item?.Vehicle?.licensePlateNumber}
      textTwo={extractDate(item?.createdAt)}
      index={1}
      isReviewed={STATUSES[item?.status]}
      labelOne={'License Plate'}
      labelTwo={'Date Created'}
      isActive={isExpanded.includes(item.id)}
      onPress={() => handleIsExpanded(item?.id)}
    />
    {isExpanded.includes(item?.id) && item?.status === 'REVIEWED' && (
      <InspectionStatusExpandedCard
        inspectionID={item?.id}
        inspectionDetailsPress={inspectionDetailsPress}
        isLoading={isLoading}
        isActivity={selectedInspectionID === item?.id}
        finalStatus={item?.finalStatus.toLowerCase() === 'pass'}
      />
    )}
  </>
);

export default RenderInspectionReviewed;
