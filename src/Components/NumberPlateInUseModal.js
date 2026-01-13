import React from 'react';
import { View, Text, Modal } from 'react-native';

import { modalStyle } from '../Assets/Styles';
import { PrimaryGradientButton } from './index';

import { useTranslation } from 'react-i18next';

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

const NumberPlateInUseModal = ({ onOkPress }) => {
  const { t } = useTranslation();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      style={modalOuterContainer}>
      <View style={container}>
        <View style={modalContainer}>
          <Text style={header} />
          <Text style={body}>
            {t('errors.licensePlateInUse')}
          </Text>
          <View style={footer}>
            <PrimaryGradientButton
              text={t('common.ok')}
              buttonStyle={button}
              textStyle={yesText}
              onPress={onOkPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NumberPlateInUseModal;
