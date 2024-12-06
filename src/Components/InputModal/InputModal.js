import React, {memo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useBoolean} from '../../hooks';
import {ConfirmVehicleDetailModal} from '../index';
import {fallBack} from '../../Utils';

const InputModal = ({
  visibleKey,
  valueKey,
  title,
  description,
  actionCreator,
  callback = fallBack,
}) => {
  const dispatch = useDispatch();
  const {[valueKey]: value = '', [`${valueKey}Visible`]: visible = false} =
    useSelector(state => state.newInspection);
  const {value: isLoading, toggle, setTrue, setFalse} = useBoolean(false);

  const onSubmitPress = useCallback(
    text => {
      console.log('mileage: ', {text});
      setTrue();
      callback(text);
      dispatch(actionCreator());
      setFalse();
    },
    [toggle, callback],
  );

  return (
    <ConfirmVehicleDetailModal
      visible={visible}
      title={title}
      description={description}
      isLoading={isLoading}
      onConfirmPress={onSubmitPress}
      numberPlateText={value || ''}
      textLimit={20}
      textLength={value?.length || '0'}
    />
  );
};

export default memo(InputModal);
