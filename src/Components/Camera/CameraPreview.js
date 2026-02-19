import React from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {colors, PreviewStyles} from '../../Assets/Styles';
import {PreviewFooter} from '../index';
import {BackArrow} from '../../Assets/Icons';

const {white, cobaltBlueLight} = colors;
const {recordingPreviewContainer, headerContainer, videoContainer} = PreviewStyles;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

const CameraPreview = ({isImageURL, handleNavigationBackPress, handleRetryPress, handleNextPress, inspectionScreen}) => {
  return (
    <View style={recordingPreviewContainer}>
      <View style={headerContainer}>
        <BackArrow height={hp('8%')} width={wp('8%')} color={white} onPress={handleNavigationBackPress} />
      </View>
      {inspectionScreen ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={[{height: hp('25%'), width: wp('100%'), overflow: 'hidden', alignSelf: 'center'}]}>
            <FastImage
              source={{uri: isImageURL}}
              priority={'normal'}
              resizeMode={'contain'}
              style={[{width: SCREEN_WIDTH, height: SCREEN_HEIGHT, marginTop: -((SCREEN_HEIGHT - hp(25)) / 2)}]}
            />
          </View>
        </View>
      ) : (
        <View style={videoContainer}>
          <FastImage
            source={{uri: isImageURL}}
            priority={'normal'}
            resizeMode={'contain'}
            style={[StyleSheet.absoluteFillObject, {borderRadius: 10}]}
          />
        </View>
      )}
      <PreviewFooter onRetryPress={handleRetryPress} onNextPress={handleNextPress} />
      <StatusBar backgroundColor={cobaltBlueLight} barStyle="light-content" translucent={true} />
    </View>
  );
};

export default CameraPreview;

