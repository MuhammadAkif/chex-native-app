import React from 'react';
import {View, Text, Modal} from 'react-native';

import {PrimaryGradientButton, SecondaryButton} from '../index';
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
  noButton,
  noTextStyle,
} = modalStyle;

const DiscardInspectionModal = ({
  description,
  onYesPress,
  onNoPress,
  noButtonText,
  noButtonStyle,
  title = '',
  dualButton = true,
  yesButtonText = 'Yes',
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={true}
    onRequestClose={onNoPress}
    style={modalOuterContainer}>
    <View style={container}>
      <View style={modalContainer}>
        {title && <Text style={header}>{title}</Text>}
        <Text style={body}>{description}</Text>
        <View style={footer}>
          <PrimaryGradientButton
            text={yesButtonText}
            buttonStyle={button}
            textStyle={yesText}
            onPress={onYesPress}
          />
          {dualButton && (
            <SecondaryButton
              text={'No'}
              buttonStyle={[button, noButton, noButtonStyle]}
              onPress={onNoPress}
              textStyle={[noTextStyle, noButtonText]}
            />
          )}
        </View>
      </View>
    </View>
  </Modal>
);

export default DiscardInspectionModal;
