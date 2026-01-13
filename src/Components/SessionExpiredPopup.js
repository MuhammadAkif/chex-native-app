import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrimaryGradientButton } from './';
import { modalStyle } from '../Assets/Styles';

const { container, modalContainer, header, body, footer, button, yesText } =
  modalStyle;

const SessionExpiredPopup = ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <View style={{ ...container, ...StyleSheet.absoluteFillObject }}>
      <View style={modalContainer}>
        <Text style={header}>{t('session.expired.title')}</Text>
        <Text style={body}>{t('session.expired.message')}</Text>
        <View style={footer}>
          <PrimaryGradientButton
            text={t('session.expired.button')}
            buttonStyle={button}
            textStyle={yesText}
            onPress={onPress}
          />
        </View>
      </View>
    </View>
  );
};

export default SessionExpiredPopup;
