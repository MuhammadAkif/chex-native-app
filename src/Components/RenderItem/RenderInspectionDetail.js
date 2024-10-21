import React from 'react';
import {Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';

import {circleBorderRadius, colors} from '../../Assets/Styles';
import {S3_BUCKET_BASEURL, WINDOW} from '../../Constants';
import {isNotEmpty} from '../../Utils';
import {checkVideo, formatTitle} from '../../Utils/helpers';

const {width} = Dimensions.get(WINDOW);
const {black} = colors;

const Video_Component = ({uri = ''}) => (
  <Video
    source={{uri}}
    controls={true}
    playInBackground={false}
    resizeMode={'contain'}
    style={styles.image}
    paused={true}
  />
);
const Image_Component = ({uri = ''}) => (
  <FastImage source={{uri}} resizeMode={'stretch'} style={styles.image} />
);
const mediaOption = {
  true: Video_Component,
  false: Image_Component,
};

const RenderInspectionDetail = ({item, handleDisplayMedia, categoryCount}) => {
  const {category, extension, url} = item;
  let title = formatTitle(category);
  const isVideo = checkVideo[extension] || false;
  const mediaUrl = {
    true: S3_BUCKET_BASEURL + url,
    false: url,
  };
  let currentMediaUrl = mediaUrl[url.split('/')[0] === 'uploads'];
  const ActiveMedia = mediaOption[isVideo];

  return (
    <TouchableOpacity
      disabled={!isNotEmpty(currentMediaUrl)}
      style={styles.container}
      onPress={() => handleDisplayMedia(item)}>
      <ActiveMedia uri={currentMediaUrl} />
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
