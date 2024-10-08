import React, {useState} from 'react';
import {View, Text, Modal, StyleSheet, TextInput} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {PrimaryGradientButton} from '../index';
import {circleBorderRadius, colors, modalStyle} from '../../Assets/Styles';

const {red, gray, orange, black} = colors;

const ConfirmVehicleDetailModal = ({
  title = 'Vehicle Detail',
  description = 'System was unable to detect the license plate number. Please type the license plate number below:',
  onConfirmPress,
  onCrossPress,
  buttonText = 'Confirm',
  placeHolder = 'Enter License Plate Number',
  numberPlateText = '',
  isLoading = false,
  textLimit = 20,
}) => {
  const [numberPlate, setNumberPlate] = useState(numberPlateText);
  const text_Limit = numberPlate.length + '/' + textLimit;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      style={modalStyle.modalOuterContainer}>
      <View style={modalStyle.container}>
        <View style={modalStyle.modalContainer}>
          <Text style={modalStyle.header}>{title}</Text>
          {numberPlateText?.length === 0 && (
            <Text style={[modalStyle.body, {color: red}]}>{description}</Text>
          )}
          <TextInput
            value={numberPlate}
            placeholder={placeHolder}
            placeholderTextColor={gray}
            style={styles.numberPlateInput}
            enterKeyHint={'done'}
            editable={!isLoading}
            onChangeText={setNumberPlate}
            maxLength={textLimit}
            onSubmitEditing={() => onConfirmPress(numberPlate)}
          />
          <Text style={styles.textLimit}>{text_Limit}</Text>
          <View style={modalStyle.footer}>
            <PrimaryGradientButton
              text={buttonText}
              disabled={isLoading}
              buttonStyle={modalStyle.button}
              textStyle={modalStyle.yesText}
              onPress={() => onConfirmPress(numberPlate)}
            />
          </View>
        </View>
      </View>
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
    height: hp('4%'),
    width: wp('80%'),
    padding: hp('1%'),
    color: black,
  },
  textLimit: {
    width: '95%',
    color: black,
    textAlign: 'right',
  },
});

export default ConfirmVehicleDetailModal;
