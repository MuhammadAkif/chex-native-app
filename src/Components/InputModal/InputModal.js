import React, {memo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

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
  placeHolder,
  keyboardType,
  inputMode,
  errorMessage,
  defaultValue = '',
}) => {
  const {[valueKey]: value = '', [`${valueKey}Visible`]: visible = false} =
    useSelector(state => state.newInspection);
  const {value: isLoading, toggle} = useBoolean(false);
  const dispatch = useDispatch();

  // Close the modal without submitting (cross / ✕ button).
  const onCrossPress = useCallback(() => {
    dispatch(actionCreator());
  }, [dispatch, actionCreator]);

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
      onCrossPress={onCrossPress}
      numberPlateText={value || defaultValue || ''}
      textLimit={20}
      textLength={value?.length || defaultValue?.length || '0'}
      placeHolder={placeHolder}
      keyboardType={keyboardType}
      inputMode={inputMode}
      errorMessage={errorMessage}
    />
  );
};

export default memo(InputModal);
