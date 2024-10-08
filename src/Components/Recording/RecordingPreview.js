import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';

import {colors} from '../../Assets/Styles';
import {PreviewFooter} from '../index';
import {BackArrow} from '../../Assets/Icons';

const {white} = colors;

const RecordingPreview = ({
  isVideoURI,
  handleNavigationBackPress,
  styles,
  handleRetryPress,
  handleNextPress,
  isVideoPaused,
}) => {
  const [isPaused, setIsPaused] = useState(isVideoPaused);

  return (
    <View style={styles.recordingPreviewContainer}>
      <View style={styles.headerContainer}>
        <BackArrow
          height={hp('8%')}
          width={wp('8%')}
          color={white}
          onPress={handleNavigationBackPress}
        />
      </View>
      <View style={styles.videoContainer}>
        <Video
          controls={false}
          repeat={true}
          paused={isPaused}
          playInBackground={false}
          resizeMode={'contain'}
          style={[StyleSheet.absoluteFillObject, {borderRadius: 10}]}
          source={{uri: isVideoURI}}
        />
      </View>
      <PreviewFooter
        onRetryPress={handleRetryPress}
        onNextPress={() => {
          setIsPaused(true);
          handleNextPress();
        }}
      />
    </View>
  );
};

export default RecordingPreview;
