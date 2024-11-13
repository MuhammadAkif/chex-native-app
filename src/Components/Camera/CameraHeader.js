import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {BackArrow} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';

const {white} = colors;

const CameraHeader = ({onClose}) => (
  <TouchableOpacity style={styles.header} onPress={onClose}>
    <BackArrow height={hp('4%')} width={wp('8%')} color={white} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('5%'),
    zIndex: 100,
    padding: wp('2%'),
  },
  button: {},
});

export default CameraHeader;
