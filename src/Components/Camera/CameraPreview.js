import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {colors, PreviewStyles} from '../../Assets/Styles';
import {PreviewFooter} from '../index';
import {BackArrow} from '../../Assets/Icons';

const {white} = colors;
const {recordingPreviewContainer, headerContainer, videoContainer} =
  PreviewStyles;

const CameraPreview = ({image_url, onBackPress, onRetryPress, onNextPress}) => (
  <View style={recordingPreviewContainer}>
    <View style={headerContainer}>
      <BackArrow
        height={hp('8%')}
        width={wp('8%')}
        color={white}
        onPress={onBackPress}
      />
    </View>
    <View style={videoContainer}>
      <FastImage
        source={{uri: image_url}}
        priority={'normal'}
        resizeMode={'stretch'}
        style={[StyleSheet.absoluteFillObject, {borderRadius: 10}]}
      />
    </View>
    <PreviewFooter onRetryPress={onRetryPress} onNextPress={onNextPress} />
    {/*<StatusBar
      backgroundColor={cobaltBlueLight}
      barStyle="light-content"
      translucent={true}
    />*/}
  </View>
);

export default CameraPreview;
