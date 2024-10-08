import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {colors, PreviewStyles} from '../../Assets/Styles';
import {PreviewFooter} from '../index';
import {BackArrow} from '../../Assets/Icons';

const {white, cobaltBlueDark, cobaltBlueLight} = colors;

const CameraPreview = ({
  isImageURL,
  handleNavigationBackPress,
  handleRetryPress,
  handleNextPress,
}) => (
  <View style={PreviewStyles.recordingPreviewContainer}>
    <View style={PreviewStyles.headerContainer}>
      <BackArrow
        height={hp('8%')}
        width={wp('8%')}
        color={white}
        onPress={handleNavigationBackPress}
      />
    </View>
    <View style={PreviewStyles.videoContainer}>
      <FastImage
        source={{uri: isImageURL}}
        priority={'normal'}
        resizeMode={'stretch'}
        style={[StyleSheet.absoluteFillObject, {borderRadius: 10}]}
      />
    </View>
    <PreviewFooter
      onRetryPress={handleRetryPress}
      onNextPress={handleNextPress}
    />
    <StatusBar
      backgroundColor={cobaltBlueLight}
      barStyle="light-content"
      translucent={true}
    />
  </View>
);

export default CameraPreview;
