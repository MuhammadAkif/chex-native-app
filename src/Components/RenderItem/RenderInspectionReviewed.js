import React from 'react';

import {
  InspectionStatusCollapsedCard,
  InspectionStatusExpandedCard,
} from '../index';
import {extractDate} from '../../Utils';
import {STATUSES} from '../../Constants';

import {useTranslation} from 'react-i18next';

const RenderInspectionReviewed = ({
  item,
  handleIsExpanded,
  isExpanded,
  inspectionDetailsPress,
  isLoading,
  selectedInspectionID,
}) => {
  const {t} = useTranslation();
  return (
    <>
      <InspectionStatusCollapsedCard
        textOne={item?.Vehicle?.licensePlateNumber}
        textTwo={extractDate(item?.createdAt)}
        index={1}
        isReviewed={STATUSES[item?.status]}
        labelOne={t('inspectionCard.licensePlate')}
        labelTwo={t('inspectionCard.dateCreated')}
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
};

export default RenderInspectionReviewed;
