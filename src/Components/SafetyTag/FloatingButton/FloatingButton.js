import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import useBoolean from '../../../hooks/useBoolean';
import {
  setFirstTimeOpen,
  setShowInstructions,
} from '../../../Store/Actions/AppStateActions';
import InstructionsModal from './InstructionsModal';
import HelpButton from './HelpButton';

const FloatingButton = () => {
  const dispatch = useDispatch();
  const {isFirstTimeOpen, showInstructions} = useSelector(
    state => state.appState,
  );
  const {value: visible, toggle: toggleVisibility} =
    useBoolean(isFirstTimeOpen);

  useEffect(() => {
    if (isFirstTimeOpen) {
      dispatch(setFirstTimeOpen(false));
    }
    dispatch(setShowInstructions(isFirstTimeOpen || visible));
  }, [isFirstTimeOpen, showInstructions, visible]);

  return (
    <View>
      <HelpButton onPress={toggleVisibility} />
      <InstructionsModal
        visible={showInstructions}
        onClose={toggleVisibility}
      />
    </View>
  );
};

export default FloatingButton;
