import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import InputModal from './InputModal';
import {
  setMileageVisible,
  setMileage,
  setMileageMessage,
} from '../../Store/Actions';
import { updateMileageInDB } from '../../services/inspection';
import { removeAlphabets } from '../../Utils/helpers';

const MileageInput = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let { selectedInspectionID, mileageMessage } = useSelector(
    state => state.newInspection,
  );

  const onSubmit = useCallback(
    async (text, actionCreator, toggleLoading, resetStates) => {
      try {
        const mileage = removeAlphabets(text);
        if (mileage) {
          toggleLoading();

          await updateMileageInDB(mileage, selectedInspectionID);

          dispatch(setMileage(''));
          dispatch(setMileageMessage(''));
          resetStates();
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
      const { status = null } = error || {};
      let message = t('mileageInput.errors.lessThanPrevious');

      if (status !== 400) {
        message = t('common.somethingWentWrong');
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
      title={t('mileageInput.title')}
      description={t('mileageInput.description')}
      actionCreator={setMileageVisible}
      callback={onSubmit}
      placeHolder={t('mileageInput.placeHolder')}
      keyboardType={'decimal-pad'}
      inputMode={'decimal'}
      errorMessage={mileageMessage}
    />
  );
};

export default memo(MileageInput);
