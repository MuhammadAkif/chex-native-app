import React, { memo, useCallback } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
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
import { colors } from '../../Assets/Styles';

const MileageInput = ({ crossButtonColor = colors.orangePeel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let { selectedInspectionID, mileageMessage,carVerificiationItems,mileage } = useSelector(
    state => state.newInspection,
  );
  let newInspectionData = useSelector(
    state => state.newInspection,
  );
  // If an odometer image was captured, pre-fill the mileage with its odometerID.
  const odometerDefault = mileage
    ? mileage : '';

  const onSubmit = useCallback(
    async (text, actionCreator, toggleLoading, resetStates) => {
      try {
        const mileage = removeAlphabets(text);
        if (mileage) {
          toggleLoading();

          const response = await updateMileageInDB(mileage, selectedInspectionID);
          console.log('response',response);

          dispatch(setMileage(mileage));
          dispatch(setMileageMessage(''));
          // resetStates();
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
      defaultValue={odometerDefault}
      crossButtonColor={crossButtonColor}
      crossButtonStyle={{
        width: wp('5%'),
        height: hp('2.5%'),
      }}
    />
  );
};

export default memo(MileageInput);
