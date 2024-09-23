import React from 'react';

import {ExteriorFrontDetails} from '../../Utils';
import {ImagePicker_New} from '../index';

const RenderImagePicker = ({
  item,
  handleItemPickerPress,
  handleMediaModalDetailsPress,
  handleCrossPress,
  isLoading,
  isAnnotated,
}) => (
  <ImagePicker_New
    text={ExteriorFrontDetails.title}
    pickerText={'Capture Image'}
    // imageURL={ExteriorFrontDetails.source}
    isLoading={isLoading}
    onPress={() => handleItemPickerPress(ExteriorFrontDetails)}
    onClearPress={() =>
      handleCrossPress(ExteriorFrontDetails.groupType, ExteriorFrontDetails.key)
    }
    handleMediaModalDetailsPress={() =>
      handleMediaModalDetailsPress(
        ExteriorFrontDetails.title,
        item?.exteriorFront,
      )
    }
    isAnnotated={isAnnotated}
  />
);
export default RenderImagePicker;
