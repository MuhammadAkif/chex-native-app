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
import {Custom_Image} from '../index';

const height = hp('7%');
const width = wp('7%');
const {gray, paleBlue, royalBlue, orangePeel, blueGray} = colors;
const {
  uploadImageAndTextContainer,
  crossContainer,
  uploadImageContainer,
  cameraIconContainer,
  uploadImageText,
  textColor,
  pickerTextSize,
  uploadImageTitleText,
} = expandedCardStyles;
const {container} = ItemPickerStyles;

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
    <View style={uploadImageAndTextContainer}>
      {imageURL ? (
        <TouchableOpacity
          style={container}
          disabled={isLoading}
          onPress={handleMediaModalDetailsPress}>
          <TouchableOpacity style={crossContainer} onPress={onClearPress}>
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
          {/*<Custom_Image
            source={{uri: imageURL}}
            imageStyle={{height: '100%', width: '100%'}}
          />*/}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[uploadImageContainer, {borderColor: activeColor}]}
          disabled={isLoading}
          onPress={onPress}>
          <View
            style={[
              cameraIconContainer,
              {backgroundColor: activeBackgroundColor},
            ]}>
            <Camera height={height} width={width} color={blueGray} />
          </View>
          <Text
            style={[
              uploadImageText,
              textColor,
              pickerTextSize,
              {color: activeTextColor},
            ]}>
            {pickerText}
          </Text>
        </TouchableOpacity>
      )}
      <Text
        style={{
          ...uploadImageText,
          ...uploadImageTitleText,
        }}>
        {text}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFill,
    height: null,
    width: null,
    borderRadius: 3,
  },
});
export default ImagePicker;
