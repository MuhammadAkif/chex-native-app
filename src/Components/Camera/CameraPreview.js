import React from 'react';
import {StatusBar, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {colors, PreviewStyles} from '../../Assets/Styles';
import {PreviewFooter} from '../index';
import {BackArrow} from '../../Assets/Icons';

const {white, cobaltBlueLight} = colors;

const CameraPreview = ({isImageURL, orientation, handleNavigationBackPress, handleRetryPress, handleNextPress}) => {
  const isLandscape = orientation?.includes('landscape');

  return (
    <View style={PreviewStyles.recordingPreviewContainer}>
      {/* Header */}
      <View style={PreviewStyles.headerContainer}>
        <BackArrow height={hp('8%')} width={wp('8%')} color={white} onPress={handleNavigationBackPress} />
      </View>

      {/* Image Container (NO ROTATION HERE) */}
      <View
        style={{
          ...PreviewStyles.videoContainer,
          width: isLandscape ? hp('80%') : wp('90%'), // swap sizes
          height: isLandscape ? wp('90%') : hp('80%'), // swap sizes
        }}>
        <FastImage
          source={{uri: isImageURL}}
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
            transform: isLandscape ? [{rotate: '90deg'}] : [],
          }}
        />
      </View>

      {/* Footer */}
      <PreviewFooter onRetryPress={handleRetryPress} onNextPress={handleNextPress} />
      <StatusBar backgroundColor={cobaltBlueLight} barStyle="light-content" translucent />
    </View>
  );
};

export default CameraPreview;
