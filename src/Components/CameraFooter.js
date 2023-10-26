import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';
import {FlipCamera, Record} from '../Assets/Icons';
import PhotoLibrary from '../Assets/Icons/PhotoLibrary';

const CameraFooter = ({
  isCamera,
  isRecording,
  handleSwitchCamera,
  handleCaptureNowPress,
  openPhotoLibrary,
}) => (
  <View style={styles.cameraOptionContainer}>
    {!isRecording && (
      <FlipCamera
        height={hp('8%')}
        width={wp('10%')}
        color={colors.white}
        onPress={handleSwitchCamera}
      />
    )}
    <Record
      height={hp('10%')}
      width={wp('20%')}
      color={isCamera ? colors.white : colors.red}
      onPress={handleCaptureNowPress}
    />
    {!isRecording && (
      <TouchableOpacity onPress={openPhotoLibrary} activeOpacity={1}>
        <PhotoLibrary
          height={hp('5%')}
          width={wp('10%')}
          color={colors.white}
        />
      </TouchableOpacity>
    )}
  </View>
);
const styles = StyleSheet.create({
  cameraOptionContainer: {
    flex: Platform.OS === 'ios' ? 0.2 : 0,
    width: wp('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: '5%',
    zIndex: 20,
  },
});

export default CameraFooter;
