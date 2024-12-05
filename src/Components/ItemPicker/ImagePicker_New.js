import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
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
import {Camera, CrossFilled, Damage_Vehicle} from '../../Assets/Icons';
import {Platforms} from '../../Constants';
import {Custom_Image} from '../index';

const {WINDOW} = Platforms;
const iconHeight = hp('5%');
const iconWidth = wp('5%');
const {height, width} = Dimensions.get(WINDOW);
const {orangePeel, blueGray} = colors;
const {
  uploadImageAndTextContainer,
  crossContainer,
  uploadImageContainer,
  cameraIconContainer,
  uploadImageText,
  textColor,
} = expandedCardStyles;
const {container} = ItemPickerStyles;

const ImagePicker_New = ({
  onPress,
  text,
  pickerText,
  imageURL,
  onClearPress,
  isLoading,
  handleMediaModalDetailsPress,
  isAnnotated,
  displayImage = true,
}) => (
  <View style={uploadImageAndTextContainer}>
    {imageURL && displayImage ? (
      <TouchableOpacity
        style={{...container, ...styles.size}}
        disabled={isLoading}
        onPress={handleMediaModalDetailsPress}>
        <TouchableOpacity style={crossContainer} onPress={onClearPress}>
          <CrossFilled
            height={hp('2.5%')}
            width={wp('7%')}
            color={orangePeel}
          />
        </TouchableOpacity>
        <FastImage
          source={{uri: imageURL}}
          priority={'normal'}
          resizeMode={'stretch'}
          style={[StyleSheet.absoluteFill, {borderRadius: wp('4%')}]}
        />
        {/*<Custom_Image
          source={{uri: imageURL}}
          imageStyle={{height: '100%', width: '100%', borderRadius: wp('5%')}}
        />*/}
        {isAnnotated && <Damage_Vehicle style={styles.icon} />}
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={{...uploadImageContainer, ...styles.size}}
        onPress={onPress}>
        <View
          style={{
            ...cameraIconContainer,
            height: width * 0.12,
            width: width * 0.12,
          }}>
          <Camera height={iconHeight} width={iconWidth} color={blueGray} />
        </View>
        <Text
          style={{
            ...uploadImageText,
            ...textColor,
            fontSize: hp('1.35%'),
          }}>
          {pickerText}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    bottom: hp('0.8%'),
    left: wp('2%'),
  },
  size: {
    height: hp('12%'),
    width: wp('25%'),
  },
  image: {
    ...StyleSheet.absoluteFill,
    height: null,
    width: null,
    borderRadius: wp('5%'),
  },
});

export default ImagePicker_New;
