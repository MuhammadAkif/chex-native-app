import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Platform} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';

import {
  colors,
  expandedCardStyles,
  ItemPickerStyles,
} from '../../Assets/Styles';
import {CrossFilled, Play} from '../../Assets/Icons';

const height = hp('5%');
const width = wp('5%');

const VideoPicker = ({
  onPress,
  text,
  pickerText,
  videoURL,
  onClearPress,
  isLoading,
  handleMediaModalDetailsPress,
}) => (
  <View style={expandedCardStyles.uploadImageAndTextContainer}>
    {videoURL ? (
      <TouchableOpacity
        style={ItemPickerStyles.container}
        disabled={isLoading}
        onPress={handleMediaModalDetailsPress}>
        <TouchableOpacity
          style={expandedCardStyles.crossContainer}
          onPress={onClearPress}>
          <CrossFilled
            height={hp('5%')}
            width={wp('5%')}
            color={colors.orangePeel}
          />
        </TouchableOpacity>
        <Video
          source={{uri: videoURL}}
          controls={false}
          repeat={false}
          paused={Platform.OS !== 'android'}
          playInBackground={false}
          style={StyleSheet.absoluteFill}
          muted={true}
        />
        <Play
          height={hp('4%')}
          width={wp('4%')}
          color={'rgba(255, 255, 255, 0.7)'}
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={expandedCardStyles.uploadImageContainer}
        onPress={onPress}>
        <View style={expandedCardStyles.cameraIconContainer}>
          <View style={{left: '4%'}}>
            <Play height={height} width={width} color={colors.blueGray} />
          </View>
        </View>
        <Text
          style={[
            expandedCardStyles.uploadImageText,
            expandedCardStyles.textColor,
            expandedCardStyles.pickerTextSize,
          ]}>
          {pickerText}
        </Text>
      </TouchableOpacity>
    )}
    <Text style={expandedCardStyles.uploadImageText}>{text}</Text>
  </View>
);

export default VideoPicker;
