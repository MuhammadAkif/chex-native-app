import React, {memo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import InputModal from './InputModal';
import {
  setMileageVisible,
  setMileage,
  setMileageMessage,
} from '../../Store/Actions';
import {updateMileageInDB} from '../../services/inspection';
import {removeAlphabets} from '../../Utils/helpers';

const MileageInput = () => {
  const dispatch = useDispatch();
  let {selectedInspectionID, mileageMessage} = useSelector(
    state => state.newInspection,
  );

  const onSubmit = useCallback(
    async (text, actionCreator, toggleLoading) => {
      try {
        const mileage = removeAlphabets(text);
        if (mileage) {
          toggleLoading();

          await updateMileageInDB(mileage, selectedInspectionID);

          dispatch(setMileage(''));
          dispatch(setMileageMessage(''));
          dispatch(actionCreator());
        }
      } catch (error) {
        onSubmitFailed(error);
        throw error;
      } finally {
        toggleLoading();
      }
    },
    [selectedInspectionID, dispatch],
  );

  function onSubmitFailed(error = {}) {
    try {
      const {status = null} = error || {};
      let message = 'Current reading can not be less than previous reading';

      if (status !== 400) {
        message = 'Something Went Wrong, Please try again.';
      }
      dispatch(setMileageMessage(message));
    } catch (error) {
      throw error;
    }
  }

  return (
    <InputModal
      visibleKey="mileage"
      valueKey="mileage"
      title="MileageInput"
      description={
        'System was unable to detect the mileage. Please type the mileage below:'
      }
      actionCreator={setMileageVisible}
      callback={onSubmit}
      placeHolder={'Enter Mileage'}
      keyboardType={'decimal-pad'}
      inputMode={'decimal'}
      errorMessage={mileageMessage}
    />
  );
};

export default memo(MileageInput);
