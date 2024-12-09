import React, {memo, useCallback} from 'react';
import {useSelector} from 'react-redux';

import {useBoolean} from '../../hooks';
import {ConfirmVehicleDetailModal} from '../index';
import {fallBack, isNotEmpty} from '../../Utils';

const InputModal = ({
  visibleKey,
  valueKey,
  title,
  description,
  actionCreator,
  callback = fallBack,
}) => {
  const {[valueKey]: value = '', [`${valueKey}Visible`]: visible = false} =
    useSelector(state => state.newInspection);
  const {value: isLoading, toggle} = useBoolean(false);

  const onSubmitPress = useCallback(
    text => {
      if (!isNotEmpty(text.trim())) {
        return null;
      }
      callback(text, actionCreator, toggle);
    },
    [callback, actionCreator, toggle],
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
      placeHolder={'Enter Mileage'}
    />
  );
};

export default memo(InputModal);
