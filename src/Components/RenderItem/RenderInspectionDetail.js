import React from 'react';
import {Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {circleBorderRadius, colors} from '../../Assets/Styles';
import {Platforms, S3_BUCKET_BASEURL} from '../../Constants';
import {isNotEmpty} from '../../Utils';
import {formatTitle} from '../../Utils/helpers';
import {Custom_Image} from '../index';

const {WINDOW} = Platforms;
const {width} = Dimensions.get(WINDOW);
const {black} = colors;

const RenderInspectionDetail = ({item, handleDisplayMedia, categoryCount}) => {
  const {category, url} = item;
  let title = formatTitle(category);
  const mediaUrl = {
    true: S3_BUCKET_BASEURL + url,
    false: url,
  };
  let currentMediaUrl = mediaUrl[url.split('/')[0] === 'uploads'];

  return (
    <TouchableOpacity
      disabled={!isNotEmpty(currentMediaUrl)}
      style={styles.container}
      onPress={() => handleDisplayMedia(item)}>
      <Custom_Image source={{uri: currentMediaUrl}} />
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
  loadingText: {
    fontSize: hp('1.8%'),
    paddingTop: hp('1%'),
  },
});

export default RenderInspectionDetail;
