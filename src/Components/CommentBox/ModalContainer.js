import React from 'react';
import {View, Modal} from 'react-native';

import {modalStyle} from '../../Assets/Styles';

const {container, modalContainer} = modalStyle;

const ModalContainer = ({visible, children, style}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    style={style}>
    <View style={container}>
      <View style={modalContainer}>{children}</View>
    </View>
  </Modal>
);

export default ModalContainer;
