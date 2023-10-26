import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';
import Bars from '../Assets/Icons/Bars';
import {useNavigation} from '@react-navigation/native';

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
    paddingHorizontal: 15,
  },
});

export default HeaderBackButton;
