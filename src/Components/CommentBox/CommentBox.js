import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import ModalContainer from './ModalContainer';
import InputField from './InputField';
import TextLimit from './TextLimit';
import {colors, modalStyle} from '../../Assets/Styles';
import {PrimaryGradientButton, SecondaryButton} from '../index';

const {royalBlue} = colors;
const {
  modalOuterContainer,
  header,
  body,
  footer,
  button: buttonStyle,
  yesText: textStyle,
} = modalStyle;

const CommentBox = ({
  title = 'Add a Comment',
  description = 'Please provide your comments or feedback below',
  onSubmit,
  onCancel,
  buttonText = 'Submit',
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
      <View style={footer}>
        <PrimaryGradientButton
          text={buttonText}
          disabled={isLoading}
          buttonStyle={buttonStyle}
          textStyle={textStyle}
          onPress={onSubmit}
        />
        <SecondaryButton
          text={'Cancel'}
          disabled={isLoading}
          buttonStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          onPress={handleCancel}
        />
      </View>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    height: hp('4.1%'),
    width: wp('30%'),
    borderRadius: hp('10%'),
    borderColor: royalBlue,
  },
  cancelButtonText: {
    fontSize: hp('2%'),
    color: royalBlue,
  },
  subHeading: {
    fontWeight: '400',
  },
});

export default React.memo(CommentBox);
