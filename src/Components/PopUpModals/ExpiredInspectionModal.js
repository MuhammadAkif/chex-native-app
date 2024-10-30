import React from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {PrimaryGradientButton, SecondaryButton} from '../index';
import {modalStyle} from '../../Assets/Styles';
import {EXPIRY_INSPECTION} from '../../Constants';
import {IMAGES} from '../../Assets/Images';

const {
  description: description_,
  confirmButton,
  cancelButton,
} = EXPIRY_INSPECTION;
const {expiry_Inspection} = IMAGES;
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
  description = description_,
  confirmButtonText = confirmButton,
  cancelButtonText = cancelButton,
  onConfirmPress,
  onCancelPress,
  cancelTextStyle,
  cancelButtonStyle,
  dualButton = true,
  visible = true,
  isLoading = false,
}) => (
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
          {description}
        </Text>
        <View style={footer}>
          <PrimaryGradientButton
            disabled={isLoading}
            text={confirmButtonText}
            buttonStyle={{...button, width: wp('40%')}}
            textStyle={yesText}
            onPress={onConfirmPress}
          />
          {dualButton && (
            <SecondaryButton
              disabled={isLoading}
              text={cancelButtonText}
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
