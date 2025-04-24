import React, {memo, useCallback} from 'react';

import InputModal from './InputModal';
import {useNewInspectionActions} from '../../hooks/newInspection';

const LicensePlateInput = () => {
  const {setPlateNumberVisible} = useNewInspectionActions();
  const onSubmit = useCallback(async licensePlate => {}, []);

  return (
    <InputModal
      visibleKey="plateNumber"
      valueKey="plateNumber"
      title="Vehicle Detail"
      description="System was unable to detect the license plate number. Please type the license plate number below:"
      actionCreator={setPlateNumberVisible}
      // callback={onSubmit}
    />
  );
};

export default memo(LicensePlateInput);
