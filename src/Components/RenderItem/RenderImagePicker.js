import React from 'react';

import {ExteriorFrontDetails} from '../../Utils';
import {ImagePicker_New} from '../index';
import {useSelector} from 'react-redux';

const RenderImagePicker = ({item, handleItemPickerPress, handleMediaModalDetailsPress, handleCrossPress, isLoading, isAnnotated}) => {
  const {selectedVehicleKind} = useSelector(state => state?.newInspection);

  return (
    <ImagePicker_New
      text={ExteriorFrontDetails(selectedVehicleKind).title}
      pickerText={'Capture Image'}
      // imageURL={ExteriorFrontDetails.source}
      isLoading={isLoading}
      onPress={() => handleItemPickerPress(ExteriorFrontDetails(selectedVehicleKind))}
      onClearPress={() => handleCrossPress(ExteriorFrontDetails(selectedVehicleKind).groupType, ExteriorFrontDetails(selectedVehicleKind).key)}
      handleMediaModalDetailsPress={() => handleMediaModalDetailsPress(ExteriorFrontDetails(selectedVehicleKind).title, item?.exteriorFront)}
      isAnnotated={isAnnotated}
    />
  );
};
export default RenderImagePicker;
