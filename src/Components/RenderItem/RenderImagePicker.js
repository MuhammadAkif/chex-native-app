import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ExteriorFrontDetails } from '../../Utils';
import { ImagePicker_New } from '../index';

const RenderImagePicker = ({
  item,
  handleItemPickerPress,
  handleMediaModalDetailsPress,
  handleCrossPress,
  isLoading,
  isAnnotated,
}) => {
  const { t } = useTranslation();
  const { selectedVehicleKind } = useSelector(state => state?.newInspection);

  return (
    <ImagePicker_New
      text={ExteriorFrontDetails(selectedVehicleKind).title}
      pickerText={t('common.captureImage')}
      // imageURL={ExteriorFrontDetails.source}
      isLoading={isLoading}
      onPress={() =>
        handleItemPickerPress(ExteriorFrontDetails(selectedVehicleKind))
      }
      onClearPress={() =>
        handleCrossPress(
          ExteriorFrontDetails(selectedVehicleKind).groupType,
          ExteriorFrontDetails(selectedVehicleKind).key,
        )
      }
      handleMediaModalDetailsPress={() =>
        handleMediaModalDetailsPress(
          ExteriorFrontDetails(selectedVehicleKind).title,
          item?.exteriorFront,
        )
      }
      isAnnotated={isAnnotated}
    />
  );
};
export default RenderImagePicker;
