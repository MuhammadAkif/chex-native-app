import React, {memo, useCallback} from 'react';

import InputModal from './InputModal';
import {setMileageVisible} from '../../Store/Actions';
import {updateMileage} from '../../services/inspection';
import {useDispatch, useSelector} from 'react-redux';

const MileageInput = () => {
  const dispatch = useDispatch();
  let {selectedInspectionID} = useSelector(state => state.newInspection);

  const onSubmit = useCallback(
    async (text, actionCreator, toggleLoading) => {
      try {
        toggleLoading();
        await updateMileage(text, selectedInspectionID);
        dispatch(actionCreator());
      } catch (error) {
        throw error;
      } finally {
        toggleLoading();
      }
    },
    [selectedInspectionID, dispatch],
  );

  return (
    <InputModal
      visibleKey="mileage"
      valueKey="mileage"
      title="MileageInput"
      description="System was unable to detect the mileage. Please type the mileage below:"
      actionCreator={setMileageVisible}
      callback={onSubmit}
    />
  );
};

export default memo(MileageInput);
