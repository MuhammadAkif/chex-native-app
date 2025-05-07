import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {History} from '../../Assets/Icons';
import styles from './styles';
import {fallBack} from '../../Utils';
import {colors} from '../../Assets/Styles';

const {orange} = colors;

const IconLabel = ({
  IconName = History,
  IconHeight = hp('2.2%'),
  IconWidth = wp('5%'),
  IconColor = orange,
  label = 'Label',
  onPress = fallBack,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <IconName height={IconHeight} width={IconWidth} color={IconColor} />
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default IconLabel;
