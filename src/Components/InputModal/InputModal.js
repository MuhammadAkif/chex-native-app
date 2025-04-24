import React, {memo, useCallback} from 'react';

import {useBoolean} from '../../hooks';
import {ConfirmVehicleDetailModal} from '../index';
import {fallBack, isNotEmpty} from '../../Utils';
import {useNewInspectionState} from '../../hooks/newInspection';

const InputModal = ({
  visibleKey,
  valueKey,
  title,
  description,
  actionCreator,
  callback = fallBack,
  placeHolder,
  keyboardType,
  inputMode,
  errorMessage,
}) => {
  const {[valueKey]: value = '', [`${valueKey}Visible`]: visible = false} =
    useNewInspectionState();
  const {value: isLoading, toggle} = useBoolean(false);

  const onSubmitPress = useCallback(
    (text, resetStates) => {
      if (!isNotEmpty(text.trim())) {
        return null;
      }
      callback(text, actionCreator, toggle, resetStates);
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
      placeHolder={placeHolder}
      keyboardType={keyboardType}
      inputMode={inputMode}
      errorMessage={errorMessage}
    />
  );
};

export default memo(InputModal);
