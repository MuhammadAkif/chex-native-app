import React, {useCallback, useEffect} from 'react';
import {View, Text, Modal} from 'react-native';

import {PrimaryGradientButton, SecondaryButton} from '../../index';
import {colors, modalStyle} from '../../../Assets/Styles';
import {Bluetooth} from '../../../Assets/Icons';
import styles from './styles';
import {useBoolean} from '../../../hooks';
import {fallBack} from '../../../Utils';

const {
  modalOuterContainer,
  container,
  modalContainer,
  header,
  body,
  footer,
  button,
  yesText,
  noButton,
  noTextStyle,
} = modalStyle;
const {red} = colors;

const DeviceConnectionModal = ({
  isVisible = true,
  description = 'Would you like to connect?',
  onConfirmPress = fallBack,
  onCancelPress = fallBack,
  title = 'Safety tag device noted in your proximity',
  confirmText = 'Connect',
  cancelText = 'Cancel',
  willDisconnect = true,
}) => {
  const {
    value: visible,
    toggle: toggleVisibility,
    setTrue: setVisible,
    setFalse: removeVisible,
  } = useBoolean(true);

  useEffect(() => {
    if (isVisible) {
      setVisible();
    } else {
      removeVisible();
    }
  }, [isVisible, setVisible, removeVisible]);

  const handleConfirmPress = useCallback(() => {
    onConfirmPress();
    toggleVisibility();
  }, [onConfirmPress, toggleVisibility]);

  const handleCancelPress = useCallback(() => {
    onCancelPress();
    toggleVisibility();
  }, [onCancelPress, toggleVisibility]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancelPress}
      style={modalOuterContainer}>
      <View style={container}>
        <View style={[modalContainer, styles.modalContainer]}>
          <View style={styles.iconContainer}>
            <Bluetooth />
          </View>
          <Text style={[header, styles.title]}>{title}</Text>
          <Text style={[body, styles.description]}>{description}</Text>
          <View style={footer}>
            <PrimaryGradientButton
              text={confirmText}
              buttonStyle={[button, styles.button]}
              textStyle={yesText}
              onPress={handleConfirmPress}
              colors={willDisconnect ? [red, red] : undefined}
            />
            <SecondaryButton
              text={cancelText}
              buttonStyle={[button, noButton, styles.button]}
              onPress={handleCancelPress}
              textStyle={noTextStyle}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeviceConnectionModal;
