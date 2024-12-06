import React, {memo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {ConfirmVehicleDetailModal} from './index';
import {useBoolean} from '../hooks';
import {setMileageVisible} from '../Store/Actions';

const Mileage = () => {
  const dispatch = useDispatch();
  let {mileage = '', mileageVisible = false} = useSelector(
    state => state.newInspection,
  );
  const {value: isLoading, toggle: toggleIsLoading} = useBoolean(false);
  const onSubmitPress = useCallback(
    text => {
      toggleIsLoading();
      dispatch(setMileageVisible());
      toggleIsLoading();
    },
    [setMileageVisible],
  );

  return (
    <ConfirmVehicleDetailModal
      visible={mileageVisible}
      title={'Mileage'}
      description={
        'System was unable to detect the mileage. Please type the mileage below:'
      }
      isLoading={isLoading}
      onConfirmPress={onSubmitPress}
      numberPlateText={mileage || ''}
      textLimit={20}
      textLength={mileage?.length || '0'}
    />
  );
};

export default memo(Mileage);
