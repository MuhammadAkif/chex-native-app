import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {BackArrow} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';
import FlashModeToggle from './FlashMode/FlashModeToggle';

const {white} = colors;

const CameraHeader = ({onClose, onFlashModeChange, flashMode}) => {
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          top,
        },
      ]}>
      <BackArrow
        height={hp('4%')}
        width={wp('8%')}
        color={white}
        onPress={onClose}
      />
      <FlashModeToggle
        height={hp('4%')}
        width={wp('6%')}
        color={white}
        flashMode={flashMode}
        onFlashModeChange={onFlashModeChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: wp('5%'),
    zIndex: 100,
  },
});

export default CameraHeader;
