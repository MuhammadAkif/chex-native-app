import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Exclamation, Remove} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';
import {fallBack} from '../../Utils';

const RenderIcons = ({
  marker,
  handleExclamationMarkPress,
  disabled = false,
  selectedMarkerId,
  onCrossPressed = () => fallBack(),
}) => {
  const activeIcon = marker.id === selectedMarkerId;
  const background_Color = {
    true: 'rgba(251, 49, 49, 0.4)',
    false: 'transparent',
  };

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        zIndex: 1,
        top: marker.coordinates.y,
        left: marker.coordinates.x,
        backgroundColor: background_Color[activeIcon],
        padding: wp('2%'),
      }}
      disabled={disabled}
      onPress={() => handleExclamationMarkPress(marker.id)}>
      {activeIcon && (
        <Remove
          onPress={onCrossPressed}
          style={{
            ...styles.remove,
            top: -wp('5%'),
            right: 0,
          }}
          height={hp('2.5%')}
          width={wp('5%')}
        />
      )}
      <Exclamation height={hp('3%')} width={wp('6%')} />
      <View style={styles.exclamation} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  remove: {
    position: 'absolute',
    zIndex: 100,
  },
  exclamation: {
    backgroundColor: colors.white,
    height: wp('5%'),
    width: wp('5%'),
    borderRadius: wp('10%'),
    position: 'absolute',
    alignSelf: 'center',
    top: wp('3%'),
    zIndex: -1,
  },
});
export default RenderIcons;
