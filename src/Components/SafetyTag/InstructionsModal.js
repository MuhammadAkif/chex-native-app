import React from 'react';
import {Modal, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../Assets/Styles';
import DeviceInstructions from './DeviceInstructions';

const {black, white, gray} = colors;

const InstructionsModal = ({visible, onClose}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Device Setup Guide</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <DeviceInstructions />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: wp('90%'),
    height: hp('80%'),
    backgroundColor: white,
    borderRadius: wp('4%'),
    overflow: 'hidden',
    shadowColor: black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  title: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
  },
  closeButton: {
    padding: wp('2%'),
  },
  closeButtonText: {
    fontSize: hp('2.5%'),
    color: black,
    fontWeight: 'bold',
  },
});

export default InstructionsModal; 