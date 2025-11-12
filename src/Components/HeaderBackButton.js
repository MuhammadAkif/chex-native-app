import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../Assets/Styles';
import {BackArrow, Bars} from '../Assets/Icons';

const {white} = colors;

const HeaderBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.container} onPress={navigation?.goBack}>
      <BackArrow color={white} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
  },
});

export default HeaderBackButton;
