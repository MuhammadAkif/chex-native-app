import React from 'react';
import {Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {circleBorderRadius, colors} from '../../Assets/Styles';
import {INSPECTION_TITLE, S3_BUCKET_BASEURL, WINDOW} from '../../Constants';
import { isNotEmpty } from "../../Utils";

const {width} = Dimensions.get(WINDOW);

const RenderInspectionDetail = ({item, handleDisplayMedia}) => {
  let mediaURL =
    item?.url?.split('/')[0] === 'uploads'
      ? `${S3_BUCKET_BASEURL}${item?.url}`
      : item?.url;
  const title = INSPECTION_TITLE[item?.category] || 'No Title';

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
    color: colors.black,
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
/*
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';

import {circleBorderRadius, colors} from '../../Assets/Styles';
import {Play} from '../../Assets/Icons';
import {extractTitle} from '../../Utils';
import {ANDROID, S3_BUCKET_BASEURL, WINDOW} from '../../Constants';
// import {S3_BUCKET_BASEURL} from '@env'

const {width} = Dimensions.get(WINDOW);

const RenderInspectionDetail = ({item, handleDisplayMedia}) => {
  let mediaURL =
    item?.url.split('/')[0] === 'uploads'
      ? `${S3_BUCKET_BASEURL}${item?.url}`
      : item?.url;
  const isVideo = item?.extension === 'video/mp4' || item?.extension === '.mp4';

  return (
    <>
      {!isVideo ? (
        <TouchableOpacity
          style={styles.container}
          onPress={() => handleDisplayMedia(item)}>
          <FastImage
            source={{uri: mediaURL}}
            resizeMode={'stretch'}
            style={styles.image}
          />
          <Text style={styles.text}>
            {extractTitle(item?.groupType, item?.category)}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.container}
          onPress={() => handleDisplayMedia(item)}>
          <Video
            source={{uri: mediaURL}}
            controls={false}
            repeat={false}
            paused={Platform.OS !== ANDROID}
            playInBackground={false}
            style={styles.image}
            muted={true}
          />
          {isVideo && (
            <View style={styles.circle}>
              <Play
                height={hp('4%')}
                width={wp('4%')}
                color={'rgba(255, 255, 255, 0.7)'}
              />
            </View>
          )}
          <Text style={styles.text}>
            {extractTitle(item?.groupType, item?.category)}
          </Text>
        </TouchableOpacity>
      )}
    </>
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
    color: colors.black,
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

*/
