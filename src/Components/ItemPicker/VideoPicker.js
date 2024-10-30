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
import {Platforms} from '../../Constants';

const {OS} = Platform;
const {ANDROID} = Platforms;
const height = hp('5%');
const width = wp('5%');
const {orangePeel, blueGray} = colors;
const {
  uploadImageAndTextContainer,
  crossContainer,
  uploadImageContainer,
  cameraIconContainer,
  textColor,
  pickerTextSize,
  uploadImageText,
} = expandedCardStyles;
const {container} = ItemPickerStyles;

const VideoPicker = ({
  onPress,
  text,
  pickerText,
  videoURL,
  onClearPress,
  isLoading,
  handleMediaModalDetailsPress,
}) => (
  <View style={uploadImageAndTextContainer}>
    {videoURL ? (
      <TouchableOpacity
        style={container}
        disabled={isLoading}
        onPress={handleMediaModalDetailsPress}>
        <TouchableOpacity style={crossContainer} onPress={onClearPress}>
          <CrossFilled height={hp('3%')} width={wp('5%')} color={orangePeel} />
        </TouchableOpacity>
        <Video
          source={{uri: videoURL}}
          controls={false}
          repeat={false}
          resizeMode={'contain'}
          paused={OS !== ANDROID}
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
      <TouchableOpacity style={uploadImageContainer} onPress={onPress}>
        <View style={cameraIconContainer}>
          <View style={{left: '4%'}}>
            <Play height={height} width={width} color={blueGray} />
          </View>
        </View>
        <Text style={[uploadImageText, textColor, pickerTextSize]}>
          {pickerText}
        </Text>
      </TouchableOpacity>
    )}
    <Text style={uploadImageText}>{text}</Text>
  </View>
);

export default VideoPicker;
