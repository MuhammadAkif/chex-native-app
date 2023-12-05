import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const DrawerItemText = ({text, onPress, Icon, activeColor, textColor}) => (
  <TouchableOpacity
    style={[styles.container, {backgroundColor: activeColor}]}
    onPress={onPress}>
    {Icon}
    <Text style={[styles.contentItem, {color: textColor}]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginVertical: '1%',
    paddingVertical: '5%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  contentItem: {
    fontSize: hp('1.7%'),
    width: wp('50%'),
    textAlignVertical: 'center',
  },
});

export default DrawerItemText;
