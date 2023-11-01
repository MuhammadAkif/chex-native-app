import React, {useEffect, useRef, useState} from 'react';
import {AppState, StatusBar, StyleSheet, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';

import {colors, PreviewStyles} from '../Assets/Styles';
import {BackArrow} from '../Assets/Icons';
import {CameraFooter, CaptureImageModal, RecordingPreview} from '../Components';
import {ROUTES} from '../Navigation/ROUTES';
import {UpdateExteriorItemURI} from '../Store/Actions';
import {getCurrentDate, getSignedUrl, uploadFile} from '../Utils';

const VideoContainer = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state?.auth);
  const isFocused = useIsFocused();
  const videoRef = useRef();
  const appState = useRef(AppState.currentState);
  const devices = useCameraDevices('wide-angle-camera');
  const [device, setDevice] = useState();
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [isVideoFile, setIsVideoFile] = useState({});
  const [isVideoURI, setIsVideoURI] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(30);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const {type, modalDetails, inspectionId} = route.params;
  const {subCategory, instructionalText, source, title, isVideo} = modalDetails;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      setIsVideoURI('');
      setIsRecording(false);
      setIsVideoFile({});
      setIsModalVisible(false);
      setProgress(0);
      // setCounter(30);
    };
  }, []);

  // useEffect(() => {
  //   let interval = null;
  //   counter === 0 && reset();
  //   if (isRecording) {
  //     interval = setInterval(() => {
  //       setCounter(counter - 1);
  //     }, 1000);
  //   } else {
  //     clearInterval(interval);
  //   }
  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, [counter, isRecording]);

  useEffect(() => {
    if (isBackCamera) {
      setDevice(devices.back);
    } else {
      setDevice(devices.front);
    }
  }, [isBackCamera, devices]);

  function reset() {
    setCounter(30);
    videoRef?.current?.stopRecording();
    setIsRecording(false);
  }
  const handleNavigationBackPress = () => navigation.goBack();
  const handleVisible = () => {
    setProgress(0);
    setIsModalVisible(false);
  };
  const handleSwitchCamera = () => setIsBackCamera(!isBackCamera);
  const handleRecordingPress = async () => {
    if (videoRef.current) {
      setIsRecording(false);
      if (isRecording) {
        await videoRef?.current?.stopRecording();
      } else {
        setIsRecording(true);
        videoRef?.current?.startRecording({
          onRecordingFinished: video => {
            setIsVideoFile(video);
            const path = video.path;
            setIsVideoURI(`file://${path}`);
          },
          onRecordingError: error => console.error(error.message),
        });
      }
    }
  };
  const handleVideoPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then(video => {
        setIsVideoFile(video);
        setIsVideoURI(video?.sourceURL);
      })
      .catch(error => console.log(error.code));
  };
  const handleRetryPress = () => {
    setIsRecording(false);
    setIsVideoURI('');
    setIsVideoFile({});
    // setCounter(30);
  };
  const handleResponse = key => {
    const body = {
      category: subCategory,
      url: key,
      extension: isVideoFile.mime,
      groupType: 'type',
      dateImage: getCurrentDate(),
    };
    uploadFile(body, inspectionId, token).then();
    dispatch(UpdateExteriorItemURI(type, isVideoURI));
    navigation.navigate(ROUTES.NEW_INSPECTION);
  };
  const handleNextPress = () => {
    setIsModalVisible(true);
    getSignedUrl(
      token,
      isVideoFile.mime,
      isVideoFile.path,
      setProgress,
      handleResponse,
    ).then();
  };

  return (
    <>
      {isModalVisible && (
        <CaptureImageModal
          isLoading={true}
          isVideo={isVideo}
          instructionalText={instructionalText}
          source={source}
          title={title}
          progress={progress}
          handleNavigationBackPress={handleNavigationBackPress}
          handleVisible={handleVisible}
        />
      )}
      {isVideoURI ? (
        <RecordingPreview
          handleNavigationBackPress={handleNavigationBackPress}
          styles={PreviewStyles}
          isVideoURI={isVideoURI}
          handleRetryPress={handleRetryPress}
          handleNextPress={handleNextPress}
        />
      ) : (
        <View style={PreviewStyles.container}>
          {device && (
            <Camera
              ref={videoRef}
              style={StyleSheet.absoluteFill}
              device={device}
              video={true}
              photo={false}
              audio={true}
              isActive={isFocused && appState.current === 'active'}
              enableZoomGesture={true}
            />
          )}
          <View style={PreviewStyles.headerContainer}>
            <BackArrow
              height={hp('8%')}
              width={wp('8%')}
              color={colors.white}
              onPress={handleNavigationBackPress}
            />
            {/*<Text style={PreviewStyles.counterText}>{counter}</Text>*/}
          </View>
          <CameraFooter
            isCamera={false}
            isRecording={isRecording}
            handleSwitchCamera={handleSwitchCamera}
            handleCaptureNowPress={handleRecordingPress}
            openPhotoLibrary={handleVideoPicker}
          />
        </View>
      )}
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
    </>
  );
};
export default VideoContainer;
