import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
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
import {Cross, Play} from '../../Assets/Icons';

const height = hp('5%');
const width = wp('5%');

const VideoPicker = ({onPress, text, pickerText, videoURL, onClearPress}) => (
  <View style={expandedCardStyles.uploadImageAndTextContainer}>
    {videoURL ? (
      <TouchableOpacity style={ItemPickerStyles.container}>
        <TouchableOpacity
          style={expandedCardStyles.crossContainer}
          onPress={onClearPress}>
          <Cross height={hp('5%')} width={wp('5%')} color={colors.red} />
        </TouchableOpacity>
        <Video
          source={{uri: videoURL}}
          controls={false}
          repeat={false}
          paused={true}
          playInBackground={false}
          style={StyleSheet.absoluteFill}
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
