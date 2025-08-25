import React, {useState} from 'react';
import {Modal, StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import CircularProgress from 'react-native-circular-progress-indicator';
import {Cross, Exclamation, Expand, Info} from '../../Assets/Icons';
import {colors} from '../../Assets/Styles';
import {PrimaryGradientButton} from '../index';
import Collapse from '../../Assets/Icons/Collapse';
import {ANNOTATE_IMAGE_DETAILS, Platforms} from '../../Constants';

const {OS} = Platform;
const {ANDROID} = Platforms;
const {title: Title, annotateText, description, skipText, instruction, source: imagePath} = ANNOTATE_IMAGE_DETAILS;
const {white, orangePeel, royalBlue, cobaltBlueDark} = colors;

const AnnotateImageModal = ({
  modalVisible,
  handleVisible,
  source = imagePath,
  instructionalText = description,
  instructionalSubHeadingText = instruction,
  annotateButtonText = annotateText,
  skipButtonText = skipText,
  title = Title,
  isVideo = false,
  isLoading = false,
  progress = 0,
  isCarVerification = false,
  isExterior = true,
  handleAnnotatePress,
  handleSkipPress,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  let height = hp('5%');
  let width = wp('5%');
  const imageHeight = {
    true: hp('20%'),
    false: hp('30%'),
  };
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleSkipPress}
      style={styles.container}>
      <View style={styles.centeredView}>
        <TouchableOpacity style={styles.crossIconContainer} onPress={handleSkipPress} disabled={isLoading}>
          <Cross height={hp('8%')} width={wp('10%')} color={white} />
        </TouchableOpacity>
        <View
          style={[
            styles.header,
            {
              flex: instructionalSubHeadingText ? 1.5 : 1,
              flexGrow: isExterior ? 2 : 1,
            },
          ]}>
          <Text style={[styles.titleText, styles.textColor, {bottom: isFullScreen ? hp('3%') : null}]}>{title}</Text>
          {isVideo ? (
            <>
              {OS === ANDROID ? (
                <View style={styles.image}>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      color: white,
                      right: 0,
                      zIndex: 1,
                    }}
                    onPress={() => setIsFullScreen(!isFullScreen)}>
                    {isFullScreen ? <Expand height={height} width={width} color={white} /> : <Collapse height={height} width={width} color={white} />}
                  </TouchableOpacity>
                  <Video
                    source={source}
                    autoplay={true}
                    fullScreenOnLongPress={true}
                    style={{height: isFullScreen ? hp('50%') : hp('25%'), width: wp('90%')}}
                  />
                </View>
              ) : (
                <Video source={source} controls={true} playInBackground={false} resizeMode={'contain'} style={styles.image} />
              )}
            </>
          ) : (
            <View>
              <FastImage
                source={source}
                priority={'normal'}
                resizeMode={'stretch'}
                style={[styles.image, {height: imageHeight[isCarVerification]}]}
              />
              <Exclamation style={styles.damageIcon} height={hp('3%')} width={wp('6%')} />
            </View>
          )}
          <View style={styles.instructionsAndSubHeadingContainer}>
            <View style={[styles.instructionsContainer, {top: isFullScreen ? hp('25%') : null}]}>
              <Info height={hp('4%')} width={wp('7%')} color={white} />
              <Text style={[styles.instructionsText, styles.textColor]}>{instructionalText}</Text>
            </View>
            {instructionalSubHeadingText && (
              <View style={styles.subHeadingContainer}>
                <Text
                  style={[
                    styles.instructionsText,
                    {
                      color: white,
                      width: wp('75%'),
                      fontSize: hp('2%'),
                    },
                  ]}>
                  {instructionalSubHeadingText}
                  <Text style={styles.bold}>{title} </Text>
                  image?
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
                top: OS === ANDROID && isFullScreen ? hp('8%') : null,
              },
            ]}>
            <CircularProgress
              maxValue={100}
              value={progress}
              valueSuffix={'%'}
              radius={OS === ANDROID && isFullScreen ? 40 : 80}
              progressValueColor={white}
              activeStrokeColor={orangePeel}
              titleStyle={{fontWeight: 'bold'}}
            />
            <Text style={[styles.textColor, styles.loadingText]}>{progress === 100 ? 'Finalizing Upload' : 'Uploading'}</Text>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <PrimaryGradientButton text={annotateButtonText} onPress={handleAnnotatePress} />
            <PrimaryGradientButton text={skipButtonText} colors={[royalBlue, royalBlue]} onPress={handleSkipPress} />
          </View>
        )}
        <View style={styles.footerView} />
      </View>
      <StatusBar backgroundColor="rgba(0, 27, 81, 0.9)" barStyle="light-content" translucent={true} />
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
    backgroundColor: cobaltBlueDark,
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
  body: {
    flex: 1,
    width: wp('100%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: wp('90%'),
    borderRadius: 10,
  },
  video: {
    height: OS === ANDROID ? '100%' : hp('25%'),
    width: OS === ANDROID ? '90%' : wp('90%'),
    borderRadius: 10,
    left: OS === ANDROID ? wp('5%') : null,
  },
  crossIconContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  textColor: {
    color: white,
  },
  footerView: {
    flex: 0.1,
  },
  instructionsAndSubHeadingContainer: {
    alignItems: 'center',
    rowGap: hp('2%'),
  },
  loadingText: {
    fontSize: hp('1.8%'),
    paddingTop: hp('1%'),
  },
  footerContainer: {
    flex: 0.5,
    justifyContent: 'space-around',
  },
  bold: {
    fontWeight: '600',
  },
  damageIcon: {
    position: 'absolute',
    top: hp('15%'),
    right: wp('42%'),
  },
});

export default AnnotateImageModal;
