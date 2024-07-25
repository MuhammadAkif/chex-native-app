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

const ExpiredInspectionModal = ({
  description = EXPIRY_INSPECTION.description,
  confirmButtonText = EXPIRY_INSPECTION.confirmButton,
  cancelButtonText = EXPIRY_INSPECTION.cancelButton,
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
    style={modalStyle.modalOuterContainer}>
    <View style={modalStyle.container}>
      <View style={modalStyle.modalContainer}>
        <Text style={modalStyle.header} />
        <FastImage
          source={IMAGES.expiry_Inspection}
          priority={'normal'}
          resizeMode={'stretch'}
          style={styles.image}
        />
        <Text style={modalStyle.body} textTransform={'uppercase'}>
          {description}
        </Text>
        <View style={modalStyle.footer}>
          <PrimaryGradientButton
            disabled={isLoading}
            text={confirmButtonText}
            buttonStyle={{...modalStyle.button, width: wp('40%')}}
            textStyle={modalStyle.yesText}
            onPress={onConfirmPress}
          />
          {dualButton && (
            <SecondaryButton
              disabled={isLoading}
              text={cancelButtonText}
              buttonStyle={[
                modalStyle.button,
                modalStyle.noButton,
                cancelButtonStyle,
              ]}
              onPress={onCancelPress}
              textStyle={[modalStyle.noTextStyle, cancelTextStyle]}
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
