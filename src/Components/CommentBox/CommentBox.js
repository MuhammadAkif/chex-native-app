import React, {useState, useCallback} from 'react';
import {StyleSheet, Text} from 'react-native';

import ModalContainer from './ModalContainer';
import InputField from './InputField';
import TextLimit from './TextLimit';
import {modalStyle} from '../../Assets/Styles';
import {FooterButtons} from '../index';

const {modalOuterContainer, header, body} = modalStyle;

const CommentBox = ({
  title = 'Add a Comment',
  description = 'Please provide your comments or feedback below',
  onSubmit,
  onCancel,
  placeHolder = 'Type your comment or feedback here',
  numberPlateText = '',
  isLoading = false,
  textLimit = 500,
  visible = true,
}) => {
  const [numberPlate, setNumberPlate] = useState(numberPlateText);

  const handleConfirm = useCallback(() => {
    onSubmit(numberPlate);
  }, [numberPlate, onSubmit]);
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <ModalContainer visible={visible} style={modalOuterContainer}>
      <Text style={header}>{title}</Text>
      <Text style={[body, styles.subHeading]}>{description}</Text>
      <InputField
        value={numberPlate}
        onChange={setNumberPlate}
        placeholder={placeHolder}
        maxLength={textLimit}
        editable={!isLoading}
        onSubmitEditing={handleConfirm}
      />
      <TextLimit currentLength={numberPlate.length} maxLength={textLimit} />
      <FooterButtons
        onSubmit={onSubmit}
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
