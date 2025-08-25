import React, {useEffect, useState} from 'react';
import {View, Text, Modal, StyleSheet, TextInput, Keyboard, TouchableOpacity, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {PrimaryGradientButton} from '../index';
import {circleBorderRadius, colors, modalStyle} from '../../Assets/Styles';
import {removeAlphabets} from '../../Utils/helpers';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

const {red, gray, orange, black} = colors;
const {modalOuterContainer, container, modalContainer, header, body, footer, button, yesText} = modalStyle;

const ConfirmVehicleDetailModal = ({
  visible = true,
  title = 'Vehicle Detail',
  description = 'System was unable to detect the license plate number. Please type the license plate number below:',
  onConfirmPress,
  onCrossPress,
  buttonText = 'Confirm',
  placeHolder = 'Enter License Plate Number',
  numberPlateText = '',
  isLoading = false,
  textLimit = 20,
  keyboardType = 'default',
  inputMode,
  errorMessage = '',
}) => {
  const [numberPlate, setNumberPlate] = useState(numberPlateText);
  const text_Limit = numberPlate.length + '/' + textLimit;

  useEffect(() => {
    handleInputChange(numberPlateText);
  }, [numberPlateText]);

  const onTouchDismissKeyboard = () => Keyboard.dismiss();
  function clearState() {
    setNumberPlate('');
  }
  function handleInputChange(text) {
    if (inputMode === 'decimal') {
      let input = removeAlphabets(text);

      let list = ['0', ''];

      if (list.includes(input)) {
        input = '';
      }
      setNumberPlate(input);
    } else {
      setNumberPlate(text);
    }
  }

  return (
    <Modal animationType="slide" statusBarTranslucent transparent={true} visible={visible} style={modalOuterContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <TouchableOpacity style={container} activeOpacity={1} onPress={onTouchDismissKeyboard}>
          <View style={modalContainer}>
            <Text style={header}>{title}</Text>
            {numberPlateText?.length === 0 && <Text style={[body, {color: red}]}>{description}</Text>}
            {errorMessage && <Text style={[body, {color: red}]}>{errorMessage}</Text>}
            <TextInput
              value={numberPlate}
              placeholder={placeHolder}
              placeholderTextColor={gray}
              style={styles.numberPlateInput}
              enterKeyHint={'done'}
              editable={!isLoading}
              onChangeText={handleInputChange}
              maxLength={textLimit}
              keyboardType={keyboardType}
              inputMode={inputMode}
              onSubmitEditing={() => onConfirmPress(numberPlate)}
            />
            <Text style={styles.textLimit}>{text_Limit}</Text>
            <View style={footer}>
              <PrimaryGradientButton
                text={buttonText}
                disabled={isLoading}
                buttonStyle={button}
                textStyle={yesText}
                onPress={() => onConfirmPress(numberPlate, clearState)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  crossIcon: {
    backgroundColor: orange,
    borderRadius: circleBorderRadius,
    position: 'absolute',
    zIndex: 1,
    top: hp('0.5%'),
    right: wp('1.5%'),
  },
  numberPlateInput: {
    borderWidth: 1,
    borderColor: gray,
    fontSize: hp('1.8%'),
    padding: wp('2.5%'),
    width: wp('80%'),
    color: black,
  },
  textLimit: {
    width: '95%',
    color: black,
    textAlign: 'right',
    fontSize: hp('1.6%'),
  },
});

export default ConfirmVehicleDetailModal;
