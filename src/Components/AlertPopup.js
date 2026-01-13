import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { PrimaryGradientButton, SecondaryButton } from './';
import { modalStyle } from '../Assets/Styles';
import { fallBack } from '../Utils';

import { useTranslation } from 'react-i18next';

const { modalOuterContainer, container, modalContainer, header, body, footer, button: buttonStyle, yesText, noTextStyle, noButton } = modalStyle;

const AlertPopup = ({
  visible = false,
  onYesPress = fallBack,
  title,
  message,
  yesButtonText,
  cancelButtonStyle = {},
  cancelButtonText = '',
  cancelButtonTextStyle = {},
  onCancelPress = fallBack,
}) => {
  const { t } = useTranslation();

  const displayTitle = title || t('session.expired.title');
  const displayMessage = message || t('session.expired.message');
  const displayYesButtonText = yesButtonText || t('session.expired.button');

  return (
    <Modal animationType="slide" transparent={true} visible={visible} statusBarTranslucent style={modalOuterContainer}>
      <View style={{ ...container, ...StyleSheet.absoluteFillObject }}>
        <View style={modalContainer}>
          <Text style={header}>{displayTitle}</Text>
          <Text style={body}>{displayMessage}</Text>
          <View style={footer}>
            <PrimaryGradientButton text={displayYesButtonText} buttonStyle={buttonStyle} textStyle={yesText} onPress={onYesPress} />
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
};

export default AlertPopup;
