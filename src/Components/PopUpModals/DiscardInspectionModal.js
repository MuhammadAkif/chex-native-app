import React from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {PrimaryGradientButton, SecondaryButton} from '../index';
import {colors} from '../../Assets/Styles';

const DiscardInspectionModal = ({
  description,
  onYesPress,
  onNoPress,
  noButtonText,
  noButtonStyle,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={true}
    style={styles.modalOuterContainer}>
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Text style={styles.header} />
        <Text style={styles.body}>{description}</Text>
        <View style={styles.footer}>
          <PrimaryGradientButton
            text={'Yes'}
            buttonStyle={styles.button}
            textStyle={styles.yesText}
            onPress={onYesPress}
          />
          <SecondaryButton
            text={'No'}
            buttonStyle={[styles.button, styles.noButton, noButtonStyle]}
            onPress={onNoPress}
            textStyle={[styles.noTextStyle, noButtonText]}
          />
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOuterContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
  },
  header: {
    fontSize: hp('2%'),
    color: colors.red,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 30,
  },
  body: {
    fontSize: hp('1.7%'),
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontWeight: 'bold',
  },
  footer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    height: hp('4%'),
    width: wp('30%'),
  },
  noButton: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.brightBlue,
  },
  noTextStyle: {
    color: colors.brightBlue,
    fontWeight: 500,
  },
  yesText: {
    fontWeight: 500,
  },
});

export default DiscardInspectionModal;
