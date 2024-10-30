import React from 'react';
import {View, Text, Modal} from 'react-native';

import {PrimaryGradientButton} from '../index';
import {modalStyle} from '../../Assets/Styles';

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

const InfoModal = ({isVisible, title, description, onOkPress}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    style={modalOuterContainer}>
    <View style={container}>
      <View style={modalContainer}>
        <Text style={header}>{title}</Text>
        <Text style={body}>{description}</Text>
        <View style={footer}>
          <PrimaryGradientButton
            text={'Ok'}
            buttonStyle={button}
            textStyle={yesText}
            onPress={onOkPress}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export default InfoModal;
