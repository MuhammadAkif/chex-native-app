import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import CircularProgress from 'react-native-circular-progress-indicator';
import VideoPlayer from 'react-native-video-player';

import {Cross, Expand, Info} from '../Assets/Icons';
import {colors, dot} from '../Assets/Styles';
import {PrimaryGradientButton} from './index';
import Collapse from '../Assets/Icons/Collapse';
import {ANDROID} from '../Constants';

const CaptureImageModal = ({
  modalVisible,
  handleVisible,
  handleCaptureImage,
  source,
  instructionalText,
  instructionalSubHeadingText,
  buttonText,
  title,
  isVideo,
  modalKey,
  isLoading,
  progress,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  let height = hp('5%');
  let width = wp('5%');
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleVisible}
      style={styles.container}>
      <View style={styles.centeredView}>
        <TouchableOpacity
          style={styles.crossIconContainer}
          onPress={handleVisible}
          disabled={isLoading}>
          <Cross height={hp('8%')} width={wp('10%')} color={colors.white} />
        </TouchableOpacity>
        <View
          style={[
            styles.header,
            {
              flex: instructionalSubHeadingText ? 1.5 : 1,
            },
          ]}>
          <Text
            style={[
              styles.titleText,
              styles.textColor,
              {bottom: isFullScreen ? hp('3%') : null},
            ]}>
            {title}
          </Text>
          {isVideo ? (
            <>
              {Platform.OS === ANDROID ? (
                <View style={styles.image}>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      color: '#fff',
                      right: 0,
                      zIndex: 1,
                    }}
                    onPress={() => setIsFullScreen(!isFullScreen)}>
                    {isFullScreen ? (
                      <Expand
                        height={height}
                        width={width}
                        color={colors.white}
                      />
                    ) : (
                      <Collapse
                        height={height}
                        width={width}
                        color={colors.white}
                      />
                    )}
                  </TouchableOpacity>
                  <VideoPlayer
                    video={source}
                    videoHeight={isFullScreen ? hp('50%') : hp('25%')}
                    videoWidth={wp('90%')}
                    autoplay={true}
                    fullScreenOnLongPress={true}
                  />
                </View>
              ) : (
                <Video
                  source={source}
                  controls={true}
                  playInBackground={false}
                  resizeMode={'contain'}
                  style={styles.image}
                />
              )}
            </>
          ) : (
            <FastImage
              source={source}
              priority={'normal'}
              resizeMode={'stretch'}
              style={styles.image}
            />
          )}
          <View style={styles.instructionsAndSubHeadingContainer}>
            <View
              style={[
                styles.instructionsContainer,
                {top: isFullScreen ? hp('25%') : null},
              ]}>
              <Info height={hp('7%')} width={wp('7%')} color={colors.white} />
              <Text style={[styles.instructionsText, styles.textColor]}>
                {instructionalText}
              </Text>
            </View>
            {instructionalSubHeadingText && (
              <View style={styles.subHeadingContainer}>
                <View style={[dot, styles.dot]} />
                <Text
                  style={[
                    styles.instructionsText,
                    {color: colors.blueGray, width: wp('75%')},
                  ]}>
                  {instructionalSubHeadingText}
                </Text>
              </View>
            )}
          </View>
        </View>
        {isLoading ? (
          <View
            style={[
              styles.body,
              {
                justifyContent: 'center',
                top: Platform.OS === ANDROID && isFullScreen ? hp('8%') : null,
              },
            ]}>
            <CircularProgress
              maxValue={100}
              value={progress}
              valueSuffix={'%'}
              radius={Platform.OS === ANDROID && isFullScreen ? 40 : 80}
              progressValueColor={colors.white}
              activeStrokeColor={colors.orangePeel}
              titleStyle={{fontWeight: 'bold'}}
            />
            <Text style={[styles.textColor, styles.loadingText]}>
              {progress === 100 ? 'Finalizing Upload' : 'Uploading'}
            </Text>
          </View>
        ) : (
          <View style={styles.body}>
            <PrimaryGradientButton
              text={buttonText}
              onPress={() => handleCaptureImage(isVideo, modalKey)}
            />
          </View>
        )}
        <View style={styles.footerView} />
      </View>
      <StatusBar
        backgroundColor="rgba(0, 27, 81, 0.9)"
        barStyle="light-content"
        translucent={true}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
    paddingTop: hp('7%'),
  },
  header: {
    flex: 1,
    width: wp('100%'),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  titleText: {
    fontSize: hp('3%'),
    fontWeight: '600',
  },
  instructionsContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  instructionsText: {
    fontSize: hp('1.8%'),
    width: wp('80%'),
  },
  subHeadingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: wp('80%'),
    paddingLeft: 20,
  },
  dot: {
    backgroundColor: colors.white,
    marginRight: 10,
    top: 0,
  },
  body: {
    flex: 1,
    width: wp('100%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    height: hp('25%'),
    width: wp('90%'),
    borderRadius: 10,
  },
  video: {
    height: Platform.OS === ANDROID ? '100%' : hp('25%'),
    width: Platform.OS === ANDROID ? '90%' : wp('90%'),
    borderRadius: 10,
    left: Platform.OS === ANDROID ? wp('5%') : null,
  },
  imageStyle: {
    height: hp('50%'),
    width: wp('90%'),
    borderRadius: 10,
    marginVertical: hp('2%'),
    left: Platform.OS === ANDROID ? wp('5%') : null,
  },
  crossIconContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  textColor: {
    color: colors.white,
  },
  footerView: {
    flex: 0.1,
  },
  instructionsAndSubHeadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: hp('1.8%'),
    paddingTop: hp('1%'),
  },
});

export default CaptureImageModal;
