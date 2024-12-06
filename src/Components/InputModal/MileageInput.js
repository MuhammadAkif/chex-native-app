import React, {memo} from 'react';

import InputModal from './InputModal';
import {setMileageVisible} from '../../Store/Actions';

const MileageInput = () => {
  return (
    <InputModal
      visibleKey="mileage"
      valueKey="mileage"
      title="MileageInput"
      description="System was unable to detect the mileage. Please type the mileage below:"
      actionCreator={setMileageVisible}
    />
  );
};

export default memo(MileageInput);
