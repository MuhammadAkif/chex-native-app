import React from 'react';
import {TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Exclamation} from '../../Assets/Icons';

const RenderIcons = ({
  marker,
  index,
  handleExclamationMarkPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        zIndex: 1,
        top: marker.coordinates.y,
        left: marker.coordinates.x,
      }}
      disabled={disabled}
      onPress={() => handleExclamationMarkPress(marker.id)}>
      <Exclamation height={hp('3%')} width={wp('6%')} />
    </TouchableOpacity>
  );
};

export default RenderIcons;
/*
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Exclamation, Remove} from '../../Assets/Icons';
import {fallBack} from '../../Utils';
import {colors} from '../../Assets/Styles';

const RenderIcons = props => {
  const {
    marker,
    index,
    handleExclamationMarkPress = fallBack('ExclamationMarkPressed'),
    disabled = false,
    onRemovePress = fallBack('crossed!'),
  } = props;
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        top: marker.coordinates.y - hp('2%'),
        left: marker.coordinates.x - wp('5%'),
        borderWidth: 1,
      }}
      disabled={disabled}>
      <TouchableOpacity style={styles.removeIcon} onPress={onRemovePress}>
        <Remove height={hp('3%')} width={wp('5%')} />
      </TouchableOpacity>
      <View style={styles.exclamationMark} />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => handleExclamationMarkPress(marker.id)}>
        <Exclamation height={hp('3%')} width={wp('6%')} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    // padding: wp('2%'),
    // backgroundColor: 'rgba(251, 49, 49, 0.4)',
  },
  removeIcon: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
    bottom: hp('4.5%'),
  },
  exclamationMark: {
    position: 'absolute',
    height: hp('2.5%'),
    width: wp('5%'),
    backgroundColor: colors.white,
    borderRadius: wp('7%'),
    top: hp('1.1%'),
    bottom: 0,
    left: wp('2.3%'),
    right: 0,
  },
});
export default RenderIcons;

*/
