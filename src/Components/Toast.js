import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {XMark, Check, Cross} from '../Assets/Icons';
import {colors} from '../Assets/Styles';

const {red, gray, white, black, brightGreen} = colors;
const Toast_Icons = {
  true: Cross,
  false: Check,
};
const Background_Color = {
  true: red,
  false: brightGreen,
};
const Container_Top = {
  true: hp('5%'),
  false: null,
};

const Toast = ({message, onCrossPress, isError = false, isForgetPassword}) => {
  const ICON_COMPONENT = Toast_Icons[isError];
  const BACKGROUND_COLOR = Background_Color[isError];
  return (
    <View style={[styles.centeredView, {top: Container_Top[isForgetPassword]}]}>
      <View style={styles.messageTextContainer}>
        <View
          style={[styles.iconContainer, {backgroundColor: BACKGROUND_COLOR}]}>
          <ICON_COMPONENT height={hp('3%')} width={wp('5%')} color={white} />
        </View>
        <Text style={styles.messageText}>{message}</Text>
        <TouchableOpacity
          style={[styles.iconContainer, {backgroundColor: 'transparent'}]}
          onPress={onCrossPress}>
          <XMark height={hp('3%')} width={wp('5%')} color={gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1,
    right: wp('10%'),
  },
  tickContainer: {
    height: '4%',
    backgroundColor: 'red',
    width: '10%',
  },
  messageTextContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    backgroundColor: white,
    justifyContent: 'space-between',
  },
  messageText: {
    paddingVertical: 8,
    paddingLeft: hp('1%'),
    width: wp('60%'),
    color: black,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brightGreen,
    paddingHorizontal: wp('2%'),
  },
});

export default Toast;
