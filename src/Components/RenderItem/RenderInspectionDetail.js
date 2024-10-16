import React from 'react';
import {Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {circleBorderRadius, colors} from '../../Assets/Styles';
import {INSPECTION_TITLE, S3_BUCKET_BASEURL, WINDOW} from '../../Constants';
import {isNotEmpty} from '../../Utils';
import {formatTitle} from '../../Utils/helpers';

const {width} = Dimensions.get(WINDOW);
const {black} = colors;

const RenderInspectionDetail = ({item, handleDisplayMedia, categoryCount}) => {
  let mediaURL =
    item?.url?.split('/')[0] === 'uploads'
      ? S3_BUCKET_BASEURL + item?.url
      : item?.url;
  // let title = INSPECTION_TITLE[item?.category] || 'No Title';
  let title = formatTitle(item?.category);
  return (
    <TouchableOpacity
      disabled={!isNotEmpty(mediaURL)}
      style={styles.container}
      onPress={() => handleDisplayMedia(item)}>
      <FastImage
        source={{uri: mediaURL}}
        resizeMode={'stretch'}
        style={styles.image}
      />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '3%',
  },
  image: {
    height: hp('12%'),
    width: wp('40%'),
    borderRadius: 10,
  },
  text: {
    fontSize: hp('1.7%'),
    lineHeight: 30,
    color: black,
  },
  circle: {
    height: width * 0.09,
    width: width * 0.09,
    borderRadius: circleBorderRadius,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '5%',
    backgroundColor: 'rgba(0, 27, 81, 0.4)',
    top: hp('5%'),
    left: wp('18.5%'),
    zIndex: 1,
  },
});

export default RenderInspectionDetail;
