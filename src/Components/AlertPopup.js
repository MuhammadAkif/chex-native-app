import React from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';

import {PrimaryGradientButton, SecondaryButton} from './';
import {modalStyle} from '../Assets/Styles';
import {SESSION_EXPIRED} from '../Constants';
import {fallBack} from '../Utils';

const {TITLE, MESSAGE, BUTTON} = SESSION_EXPIRED;

const {
  modalOuterContainer,
  container,
  modalContainer,
  header,
  body,
  footer,
  button: buttonStyle,
  yesText,
  noTextStyle,
  noButton,
} = modalStyle;

const AlertPopup = ({
  visible = false,
  onYesPress = fallBack,
  title = TITLE,
  message = MESSAGE,
  yesButtonText = BUTTON,
  cancelButtonStyle = {},
  cancelButtonText = '',
  cancelButtonTextStyle = {},
  onCancelPress = fallBack,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    style={modalOuterContainer}>
    <View style={{...container, ...StyleSheet.absoluteFillObject}}>
      <View style={modalContainer}>
        <Text style={header}>{title}</Text>
        <Text style={body}>{message}</Text>
        <View style={footer}>
          <PrimaryGradientButton
            text={yesButtonText}
            buttonStyle={buttonStyle}
            textStyle={yesText}
            onPress={onYesPress}
          />
          {cancelButtonText && (
            <SecondaryButton
              text={cancelButtonText}
              buttonStyle={[buttonStyle, noButton, cancelButtonStyle]}
              onPress={onCancelPress}
              textStyle={[noTextStyle, cancelButtonTextStyle]}
            />
          )}
        </View>
      </View>
    </View>
  </Modal>
);

export default AlertPopup;
