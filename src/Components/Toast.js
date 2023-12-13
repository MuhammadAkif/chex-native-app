import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {XMark, Check} from '../Assets/Icons';
import {colors} from '../Assets/Styles';

const Toast = ({message, onCrossPress, isVisible}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    style={styles.container}>
    <View style={styles.centeredView}>
      <View style={styles.messageTextContainer}>
        <View style={styles.iconContainer}>
          <Check height={hp('3%')} width={wp('5%')} color={colors.white} />
        </View>
        <Text style={styles.messageText}>{message}</Text>
        <TouchableOpacity
          style={[styles.iconContainer, {backgroundColor: 'transparent'}]}
          onPress={onCrossPress}>
          <XMark height={hp('3%')} width={wp('5%')} color={colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    paddingTop: hp('8%'),
    alignItems: 'center',
  },
  tickContainer: {
    height: '4%',
    backgroundColor: 'red',
    width: '10%',
  },
  messageTextContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  messageText: {
    paddingVertical: 8,
    paddingLeft: hp('1%'),
    width: wp('60%'),
    color: colors.black,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brightGreen,
    paddingHorizontal: wp('2%'),
  },
});

export default Toast;
