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
const {gray, paleBlue, royalBlue, orangePeel, blueGray} = colors;

const ImagePicker = ({
  onPress,
  text,
  pickerText,
  imageURL,
  onClearPress,
  isLoading,
  handleMediaModalDetailsPress,
}) => {
  const active_Colors = {
    true: gray,
    false: '#D1E3F7',
  };
  const active_BG_Colors = {
    true: gray,
    false: paleBlue,
  };
  const active_Text_Colors = {
    true: gray,
    false: royalBlue,
  };
  const activeColor = active_Colors[isLoading];
  const activeBackgroundColor = active_BG_Colors[isLoading];
  const activeTextColor = active_Text_Colors[isLoading];
  return (
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
              height={hp('3%')}
              width={wp('5%')}
              color={orangePeel}
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
          style={[
            expandedCardStyles.uploadImageContainer,
            {borderColor: activeColor},
          ]}
          disabled={isLoading}
          onPress={onPress}>
          <View
            style={[
              expandedCardStyles.cameraIconContainer,
              {backgroundColor: activeBackgroundColor},
            ]}>
            <Camera height={height} width={width} color={blueGray} />
          </View>
          <Text
            style={[
              expandedCardStyles.uploadImageText,
              expandedCardStyles.textColor,
              expandedCardStyles.pickerTextSize,
              {color: activeTextColor},
            ]}>
            {pickerText}
          </Text>
        </TouchableOpacity>
      )}
      <Text
        style={{
          ...expandedCardStyles.uploadImageText,
          ...expandedCardStyles.uploadImageTitleText,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default ImagePicker;
