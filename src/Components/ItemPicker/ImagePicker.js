import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {
  colors,
  expandedCardStyles,
  ItemPickerStyles,
} from '../../Assets/Styles';
import {Camera, CrossFilled} from '../../Assets/Icons';

const height = hp('7%');
const width = wp('7%');

const ImagePicker = ({
  onPress,
  text,
  pickerText,
  imageURL,
  onClearPress,
  isLoading,
  handleMediaModalDetailsPress,
}) => (
  <View style={expandedCardStyles.uploadImageAndTextContainer}>
    {imageURL ? (
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
        <FastImage
          source={{uri: imageURL}}
          priority={'normal'}
          resizeMode={'stretch'}
          style={[StyleSheet.absoluteFill, {borderRadius: 3}]}
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={expandedCardStyles.uploadImageContainer}
        onPress={onPress}>
        <View style={expandedCardStyles.cameraIconContainer}>
          <Camera height={height} width={width} color={colors.blueGray} />
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

export default ImagePicker;
