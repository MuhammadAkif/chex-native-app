import React from 'react';
import {View, Text, Modal} from 'react-native';

import {modalStyle} from '../Assets/Styles';
import {PrimaryGradientButton} from './index';

const NumberPlateInUseModal = ({onOkPress}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={true}
    style={modalStyle.modalOuterContainer}>
    <View style={modalStyle.container}>
      <View style={modalStyle.modalContainer}>
        <Text style={modalStyle.header} />
        <Text style={modalStyle.body}>
          The currently selected license plate is under inspection by another
          user. Please select a different vehicle.
        </Text>
        <View style={modalStyle.footer}>
          <PrimaryGradientButton
            text={'OK'}
            buttonStyle={modalStyle.button}
            textStyle={modalStyle.yesText}
            onPress={onOkPress}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export default NumberPlateInUseModal;
