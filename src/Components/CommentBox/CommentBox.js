import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';

import ModalContainer from './ModalContainer';
import InputField from './InputField';
import TextLimit from './TextLimit';
import {modalStyle} from '../../Assets/Styles';
import {FooterButtons} from '../index';
import {fallBack} from '../../Utils';

const {modalOuterContainer, header, body} = modalStyle;

const CommentBox = ({
  title = 'Add a Comment',
  description = 'Please provide your comments or feedback below',
  onSubmit = fallBack,
  onCancel = fallBack,
  placeHolder = 'Type your comment or feedback here',
  feedback = '',
  isLoading = false,
  textLimit = 500,
  visible = true,
}) => {
  const [input, setInput] = useState(feedback);

  useEffect(() => {
    if (feedback) {
      setInput(feedback);
    }
    return resetAllStates;
  }, [feedback, visible]);

  const resetAllStates = () => {
    setInput('');
  };

  const handleConfirm = useCallback(() => {
    onSubmit(input);
  }, [input, onSubmit]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <ModalContainer visible={visible} style={modalOuterContainer}>
      <Text style={header}>{title}</Text>
      <Text style={[body, styles.subHeading]}>{description}</Text>
      <InputField
        value={input}
        onChange={setInput}
        placeholder={placeHolder}
        maxLength={textLimit}
        editable={!isLoading}
        onSubmitEditing={handleConfirm}
      />
      <TextLimit currentLength={input.length} maxLength={textLimit} />
      <FooterButtons
        onSubmit={handleConfirm}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  subHeading: {
    fontWeight: '400',
  },
});

export default React.memo(CommentBox);
