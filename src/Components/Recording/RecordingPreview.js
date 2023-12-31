import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';

import {colors} from '../../Assets/Styles';
import {PreviewFooter} from '../index';
import {BackArrow} from '../../Assets/Icons';

const RecordingPreview = ({
  isVideoURI,
  handleNavigationBackPress,
  styles,
  handleRetryPress,
  handleNextPress,
}) => (
  <View style={styles.recordingPreviewContainer}>
    <View style={styles.headerContainer}>
      <BackArrow
        height={hp('8%')}
        width={wp('8%')}
        color={colors.white}
        onPress={handleNavigationBackPress}
      />
    </View>
    <View style={styles.videoContainer}>
      <Video
        controls={false}
        repeat={true}
        playInBackground={false}
        style={[StyleSheet.absoluteFillObject, {borderRadius: 10}]}
        source={{uri: isVideoURI}}
      />
    </View>
    <PreviewFooter
      onRetryPress={handleRetryPress}
      onNextPress={handleNextPress}
    />
  </View>
);

export default RecordingPreview;
