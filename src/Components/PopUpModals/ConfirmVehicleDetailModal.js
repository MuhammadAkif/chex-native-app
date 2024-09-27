import React, {useState} from 'react';
import {View, Text, Modal, StyleSheet, TextInput} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {PrimaryGradientButton} from '../index';
import {circleBorderRadius, colors, modalStyle} from '../../Assets/Styles';

const ConfirmVehicleDetailModal = ({
  title = 'Vehicle Detail',
  description = 'System was unable to detect the license plate number. Please type the license plate number below:',
  onConfirmPress,
  onCrossPress,
  buttonText = 'Confirm',
  placeHolder = 'Enter License Plate Number',
  numberPlateText = '',
  isLoading = false,
}) => {
  const [numberPlate, setNumberPlate] = useState(numberPlateText);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      // onRequestClose={onCrossPress}
      style={modalStyle.modalOuterContainer}>
      <View style={modalStyle.container}>
        <View style={modalStyle.modalContainer}>
          {/*<TouchableOpacity style={styles.crossIcon} onPress={onCrossPress}>*/}
          {/*  <Cross color={colors.white} height={hp('3.5%')} width={wp('7.5')} />*/}
          {/*</TouchableOpacity>*/}
          <Text style={modalStyle.header}>{title}</Text>
          {numberPlateText?.length === 0 && (
            <Text style={[modalStyle.body, {color: colors.red}]}>
              {description}
            </Text>
          )}
          <TextInput
            value={numberPlate}
            placeholder={placeHolder}
            placeholderTextColor={colors.gray}
            style={styles.numberPlateInput}
            enterKeyHint={'done'}
            editable={!isLoading}
            onChangeText={setNumberPlate}
            onSubmitEditing={() => onConfirmPress(numberPlate)}
          />
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
    backgroundColor: colors.orange,
    borderRadius: circleBorderRadius,
    position: 'absolute',
    zIndex: 1,
    top: hp('0.5%'),
    right: wp('1.5%'),
  },
  numberPlateInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    height: hp('4%'),
    width: wp('80%'),
    padding: hp('1%'),
    color: colors.black,
  },
});

export default ConfirmVehicleDetailModal;
