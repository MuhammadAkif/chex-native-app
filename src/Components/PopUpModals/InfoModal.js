import React from 'react';
import {View, Text, Modal} from 'react-native';

import {PrimaryGradientButton} from '../index';
import {modalStyle} from '../../Assets/Styles';

const InfoModal = ({isVisible, title, description, onOkPress}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    style={modalStyle.modalOuterContainer}>
    <View style={modalStyle.container}>
      <View style={modalStyle.modalContainer}>
        <Text style={modalStyle.header}>{title}</Text>
        <Text style={modalStyle.body}>{description}</Text>
        <View style={modalStyle.footer}>
          <PrimaryGradientButton
            text={'Ok'}
            buttonStyle={modalStyle.button}
            textStyle={modalStyle.yesText}
            onPress={onOkPress}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export default InfoModal;
