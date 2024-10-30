import React, {useState, useMemo} from 'react';
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
import {PrimaryGradientButton, Sub_Heading} from './index';
import Collapse from '../Assets/Icons/Collapse';
import {Platforms} from '../Constants';
import {
  headerFlex,
  headerFlexGrow,
  headerTextBottom,
  imageHeight,
  instructionsContainerTop,
} from '../Utils/helpers';

const {OS} = Platform;
const {ANDROID} = Platforms;
const Accordion = {
  true: Expand,
  false: Collapse,
};
const {blueGray, orangePeel, cobaltBlueDark, white} = colors;

const CaptureImageModal = ({
  modalVisible,
  handleVisible,
  handleCaptureImage,
  source,
  instructionalText,
  instructionalSubHeadingText,
  instructionalSubHeadingText_1,
  instructionalSubHeadingText_2,
  buttonText,
  title,
  isVideo = false,
  modalKey,
  isLoading = false,
  progress = 0,
  isCarVerification = false,
  isExterior = true,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const height = hp('5%');
  const width = wp('5%');
  const ACCORDION_COMPONENT = Accordion[isFullScreen];

  const calculatedStyles = useMemo(
    () => ({
      headerFlex: headerFlex[Boolean(instructionalSubHeadingText)],
      headerFlexGrow: headerFlexGrow[isExterior],
      headerTextBottom: headerTextBottom[isFullScreen],
      imageHeight: imageHeight[isCarVerification],
      instructionsContainerTop: instructionsContainerTop[isFullScreen],
    }),
    [instructionalSubHeadingText, isExterior, isFullScreen, isCarVerification],
  );
  /*const button = () => (
   <View style={styles.body}>
     <PrimaryGradientButton
       text={buttonText}
       onPress={() => handleCaptureImage(isVideo, modalKey)}
     />
   </View>
 );
 const footers = {true: ProgressCircle, false: button};
 const ActiveFooter = footers[isLoading];*/

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
          <Cross height={hp('8%')} width={wp('10%')} color={white} />
        </TouchableOpacity>
        <View
          style={[
            styles.header,
            {
              flex: calculatedStyles.headerFlex,
              flexGrow: calculatedStyles.headerFlexGrow,
            },
          ]}>
          <Text
            style={[
              styles.titleText,
              styles.textColor,
              {bottom: calculatedStyles.headerTextBottom},
            ]}>
            {title}
          </Text>
          {isVideo ? (
            <>
              {OS === ANDROID ? (
                <View style={styles.image}>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => setIsFullScreen(!isFullScreen)}>
                    <ACCORDION_COMPONENT
                      height={height}
                      width={width}
                      color={white}
                    />
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
              style={[styles.image, {height: calculatedStyles.imageHeight}]}
            />
          )}
          <View style={styles.instructionsAndSubHeadingContainer}>
            <View
              style={[
                styles.instructionsContainer,
                {top: calculatedStyles.instructionsContainerTop},
              ]}>
              <Info height={hp('4%')} width={wp('7%')} color={white} />
              <Text style={[styles.instructionsText, styles.textColor]}>
                {instructionalText}
              </Text>
            </View>
            <Sub_Heading text={instructionalSubHeadingText} styles={styles} />
            <Sub_Heading text={instructionalSubHeadingText_1} styles={styles} />
            <Sub_Heading text={instructionalSubHeadingText_2} styles={styles} />
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
        backgroundColor={cobaltBlueDark}
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
    backgroundColor: cobaltBlueDark,
    paddingTop: hp('7%'),
  },
  header: {
    flex: 1,
    width: wp('100%'),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    rowGap: hp('3%'),
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
  dot: {
    backgroundColor: white,
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
    width: wp('90%'),
    borderRadius: 10,
  },
  video: {
    height: OS === ANDROID ? '100%' : hp('25%'),
    width: OS === ANDROID ? '90%' : wp('90%'),
    borderRadius: 10,
    left: OS === ANDROID ? wp('5%') : null,
  },
  imageStyle: {
    height: hp('50%'),
    width: wp('90%'),
    borderRadius: 10,
    marginVertical: hp('2%'),
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
    rowGap: hp('0.5%'),
  },
  loadingText: {
    fontSize: hp('1.8%'),
    paddingTop: hp('1%'),
  },
  iconContainer: {
    position: 'absolute',
    color: '#fff',
    right: 0,
    top: 0,
    margin: 10,
  },
});

export default CaptureImageModal;
