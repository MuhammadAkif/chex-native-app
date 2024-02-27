import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../Assets/Styles';
import {Bars} from '../Assets/Icons';

const HeaderBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.openDrawer()}>
      <Bars height={hp('5%')} width={wp('6%')} color={colors.white} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('4%'),
  },
});

export default HeaderBackButton;
