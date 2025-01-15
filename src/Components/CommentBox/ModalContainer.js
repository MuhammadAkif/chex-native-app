import React from 'react';
import {View, Modal, TouchableOpacity} from 'react-native';

import {modalStyle} from '../../Assets/Styles';

const {container, modalContainer} = modalStyle;

const ModalContainer = ({visible, children, style, onPress}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    style={style}>
    <TouchableOpacity style={container} activeOpacity={1} onPress={onPress}>
      <View style={modalContainer}>{children}</View>
    </TouchableOpacity>
  </Modal>
);

export default ModalContainer;
