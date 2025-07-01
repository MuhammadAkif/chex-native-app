import React from 'react';
import { Modal, View, Text } from 'react-native';
import { PrimaryGradientButton } from './index';
import { modalStyle } from '../Assets/Styles';

const {
  modalOuterContainer,
  container,
  modalContainer,
  header,
  body,
  button,
  yesText,
} = modalStyle;

const buttonSpacing = { marginVertical: 6 };

const VehicleTypeModal = ({ visible, onSelect }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      style={modalOuterContainer}
    >
      <View style={container}>
        <View style={modalContainer}>
          <Text style={header}>Select Vehicle Type</Text>
          <Text style={body}>Please choose the type of vehicle for this inspection.</Text>
          <View style={{ flexDirection: 'column', width: '80%', paddingVertical: 10 }}>
            <PrimaryGradientButton
              text="Van"
              buttonStyle={[button, buttonSpacing, { width: '100%', alignSelf: 'center' }]}
              textStyle={yesText}
              onPress={() => onSelect('Van')}
            />
            <PrimaryGradientButton
              text="Truck"
              buttonStyle={[button, buttonSpacing, { width: '100%', alignSelf: 'center' }]}
              textStyle={yesText}
              onPress={() => onSelect('Truck')}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VehicleTypeModal; 