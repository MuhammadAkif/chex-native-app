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
import {WINDOW} from '../../Constants';

const iconHeight = hp('5%');
const iconWidth = wp('5%');
const {height, width} = Dimensions.get(WINDOW);

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
  <View style={expandedCardStyles.uploadImageAndTextContainer}>
    {imageURL && displayImage ? (
      <TouchableOpacity
        style={[ItemPickerStyles.container, styles.size]}
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
          style={[StyleSheet.absoluteFill, {borderRadius: wp('5%')}]}
        />
        {isAnnotated && <Damage_Vehicle style={styles.icon} />}
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={[expandedCardStyles.uploadImageContainer, styles.size]}
        onPress={onPress}>
        <View
          style={[
            expandedCardStyles.cameraIconContainer,
            {
              height: width * 0.12,
              width: width * 0.12,
            },
          ]}>
          <Camera
            height={iconHeight}
            width={iconWidth}
            color={colors.blueGray}
          />
        </View>
        <Text
          style={{
            ...expandedCardStyles.uploadImageText,
            ...expandedCardStyles.textColor,
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
});

export default ImagePicker_New;
