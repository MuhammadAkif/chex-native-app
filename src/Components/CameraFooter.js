import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';
import {FlipCamera, Landscape, PhotoLibrary, Record} from '../Assets/Icons';
import {fallBack} from '../Utils';
import {Platforms} from '../Constants';

const {OS} = Platform;
const {IOS} = Platforms;
const {white, red} = colors;
const EmptyView = () => <View style={styles.emptyView} />;

const CameraFooter = ({
  isCamera = true,
  isRecording,
  handleSwitchCamera,
  handleCaptureNowPress,
  displayFrame = false,
  onRightIconPress = fallBack,
  RightIcon = Landscape,
  handleImagePicker,
}) => {
  const switchRightIcon = {
    true: RightIcon,
    false: EmptyView,
  };
  const ActiveRightIcon = switchRightIcon[displayFrame];

  return (
    <View style={styles.cameraOptionContainer}>
      <TouchableOpacity
        onPress={handleSwitchCamera}
        activeOpacity={1}
        style={styles.iconPadding}>
        <FlipCamera height={hp('5%')} width={wp('10%')} color={white} />
      </TouchableOpacity>
      <Record
        height={hp('10%')}
        width={wp('20%')}
        color={isCamera ? white : red}
        onPress={handleCaptureNowPress}
      />
      <TouchableOpacity
        onPress={onRightIconPress}
        activeOpacity={1}
        style={styles.iconPadding}>
        <ActiveRightIcon />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  cameraOptionContainer: {
    flex: OS === IOS ? 0.2 : 0,
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
  iconPadding: {
    padding: wp('2%'),
  },
});

export default CameraFooter;
