import React from 'react';
import {View, Text, Modal} from 'react-native';

import {modalStyle} from '../Assets/Styles';
import {PrimaryGradientButton} from './index';

const {
  modalOuterContainer,
  container,
  modalContainer,
  header,
  body,
  footer,
  button,
  yesText,
} = modalStyle;

const NumberPlateInUseModal = ({onOkPress}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={true}
    style={modalOuterContainer}>
    <View style={container}>
      <View style={modalContainer}>
        <Text style={header} />
        <Text style={body}>
          The currently selected license plate is under inspection by another
          user. Please select a different vehicle.
        </Text>
        <View style={footer}>
          <PrimaryGradientButton
            text={'OK'}
            buttonStyle={button}
            textStyle={yesText}
            onPress={onOkPress}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export default NumberPlateInUseModal;
