import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import { PrimaryGradientButton, SecondaryButton } from '../index';
import { modalStyle } from '../../Assets/Styles';
import { IMAGES } from '../../Assets/Images';

const { expiry_Inspection } = IMAGES;
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

const ExpiredInspectionModal = ({
  description,
  confirmButtonText,
  cancelButtonText,
  onConfirmPress,
  onCancelPress,
  cancelTextStyle,
  cancelButtonStyle,
  dualButton = true,
  visible = true,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const defaultDescription = description || t('expiryInspection.description');
  const defaultConfirmButtonText = confirmButtonText || t('expiryInspection.confirmButton');
  const defaultCancelButtonText = cancelButtonText || t('expiryInspection.cancelButton');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      // onRequestClose={onCancelPress}
      style={modalOuterContainer}>
      <View style={container}>
        <View style={modalContainer}>
          <Text style={header} />
          <FastImage
            source={expiry_Inspection}
            priority={'normal'}
            resizeMode={'stretch'}
            style={styles.image}
          />
          <Text style={body} textTransform={'uppercase'}>
            {defaultDescription}
          </Text>
          <View style={footer}>
            <PrimaryGradientButton
              disabled={isLoading}
              text={defaultConfirmButtonText}
              buttonStyle={{ ...button, width: wp('40%') }}
              textStyle={yesText}
              onPress={onConfirmPress}
            />
            {dualButton && (
              <SecondaryButton
                disabled={isLoading}
                text={defaultCancelButtonText}
                buttonStyle={[button, noButton, cancelButtonStyle]}
                onPress={onCancelPress}
                textStyle={[noTextStyle, cancelTextStyle]}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: hp('40%'),
    width: wp('70%'),
  },
});
export default ExpiredInspectionModal;
