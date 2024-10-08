import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';

const {red, lightGray, white, steelGray} = colors;
const activeColor = {
  true: red,
  false: lightGray,
};
const activeTextTypeColor = {
  true: white,
  false: steelGray,
};
const activeTextBold = {
  true: '700',
  false: '400',
};

const RenderDamageTypes = ({
  item,
  selectedDamage,
  handleDamageDetails,
  disabled,
}) => {
  const isActive = selectedDamage === item;
  const activeTypeColor = activeColor[isActive];
  const activeTextColor = activeTextTypeColor[isActive];
  const active_Text_Bold = activeTextBold[isActive];
  const style = {
    ...styles.text,
    color: activeTextColor,
    fontWeight: active_Text_Bold,
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{...styles.container, backgroundColor: activeTypeColor}}
      onPress={() => handleDamageDetails('type', item)}>
      <Text style={style}>{item}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('6%'),
    borderRadius: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: hp('0.5%'),
  },
  text: {
    fontSize: hp('2.0%'),
  },
});

export default RenderDamageTypes;
