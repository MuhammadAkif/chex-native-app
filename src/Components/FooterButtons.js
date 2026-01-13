import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { PrimaryGradientButton, SecondaryButton } from './index';
import { colors, modalStyle } from '../Assets/Styles';

import { useTranslation } from 'react-i18next';

const { footer: container_, button: buttonStyles, yesText: textStyle } = modalStyle;
const { royalBlue } = colors;

const FooterButtons = ({
  containerStyle,
  confirmText,
  isLoading = false,
  confirmButtonStyle = {},
  cancelButtonStyle = {},
  confirmTextStyle = {},
  cancelTextStyle = {},
  onSubmit,
  onCancel,
  cancelText,
  disabledConfirm = false,
}) => {
  const { t } = useTranslation();
  const handleSubmit = useCallback(onSubmit, [onSubmit]);
  const handleCancel = useCallback(onCancel, [onCancel]);

  const displayConfirmText = confirmText || t('common.submit');
  const displayCancelText = cancelText || t('common.cancel');

  return (
    <View style={[container_, styles.container, containerStyle]}>
      <PrimaryGradientButton
        text={displayConfirmText}
        disabled={isLoading}
        buttonStyle={[buttonStyles, styles.buttons, confirmButtonStyle]}
        textStyle={[textStyle, confirmTextStyle]}
        onPress={handleSubmit}
        buttonDisabled={disabledConfirm}
      />
      <SecondaryButton
        text={displayCancelText}
        disabled={isLoading}
        buttonStyle={[styles.cancelButton, styles.buttons, cancelButtonStyle]}
        textStyle={[styles.cancelButtonText, cancelTextStyle]}
        onPress={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  cancelButton: {
    height: hp('4.1%'),
    width: wp('30%'),
    borderRadius: hp('10%'),
    borderColor: royalBlue,
  },
  cancelButtonText: {
    fontSize: hp('2%'),
    color: royalBlue,
  },
  subHeading: {
    fontWeight: '400',
  },
  buttons: {
    height: hp('5%'),
    width: wp('35%'),
  },
});

export default FooterButtons;
