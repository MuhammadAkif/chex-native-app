import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../Assets/Styles';
import {Bars} from '../Assets/Icons';

const {white} = colors;

const HeaderBackButton = () => {
  const {openDrawer} = useNavigation();
  const onPress = () => openDrawer();
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Bars height={hp('5%')} width={wp('6%')} color={white} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('4%'),
  },
});

export default HeaderBackButton;
