import React from 'react';
import {View, Text, Modal} from 'react-native';

import {PrimaryGradientButton, SecondaryButton} from '../index';
import {modalStyle} from '../../Assets/Styles';

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
    style={modalStyle.modalOuterContainer}>
    <View style={modalStyle.container}>
      <View style={modalStyle.modalContainer}>
        {title && <Text style={modalStyle.header}>{title}</Text>}
        <Text style={modalStyle.body}>{description}</Text>
        <View style={modalStyle.footer}>
          <PrimaryGradientButton
            text={yesButtonText}
            buttonStyle={modalStyle.button}
            textStyle={modalStyle.yesText}
            onPress={onYesPress}
          />
          {dualButton && (
            <SecondaryButton
              text={'No'}
              buttonStyle={[
                modalStyle.button,
                modalStyle.noButton,
                noButtonStyle,
              ]}
              onPress={onNoPress}
              textStyle={[modalStyle.noTextStyle, noButtonText]}
            />
          )}
        </View>
      </View>
    </View>
  </Modal>
);

export default DiscardInspectionModal;
