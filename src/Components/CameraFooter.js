import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';
import {FlipCamera, Landscape, Record} from '../Assets/Icons';
import {fallBack} from '../Utils';

const {white, red} = colors;
const EmptyView = () => <View style={styles.emptyView} />;

const CameraFooter = ({
  isCamera,
  isRecording,
  handleSwitchCamera,
  handleCaptureNowPress,
  displayFrame = false,
  onRightIconPress = fallBack,
  RightIcon = Landscape,
}) => {
  const switchRightIcon = {
    true: RightIcon,
    false: EmptyView,
  };
  const ActiveRightIcon = switchRightIcon[displayFrame];

  return (
    <View style={styles.cameraOptionContainer}>
      <FlipCamera
        height={hp('8%')}
        width={wp('10%')}
        color={white}
        onPress={handleSwitchCamera}
      />
      <Record
        height={hp('10%')}
        width={wp('20%')}
        color={isCamera ? white : red}
        onPress={handleCaptureNowPress}
      />
      <TouchableOpacity onPress={onRightIconPress} activeOpacity={1}>
        <ActiveRightIcon />
      </TouchableOpacity>
    </View>
  );
};
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
  emptyView: {
    height: hp('5%'),
    width: wp('10%'),
  },
});

export default CameraFooter;
