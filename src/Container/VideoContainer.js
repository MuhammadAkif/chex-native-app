import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

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
  const [selectedCamera, setSelectedCamera] = useState('back');
  const device = useCameraDevice(selectedCamera, {
    physicalDevices: [
      'wide-angle-camera',
      'ultra-wide-angle-camera',
      'telephoto-camera',
    ],
  });
  const format = useCameraFormat(device, [
    {videoResolution: {width: 3048, height: 2160}},
    {fps: 60},
  ]);
  const [isBackCamera, setIsBackCamera] = useState(selectedCamera === 'front');
  const [isVideoFile, setIsVideoFile] = useState({});
  const [isVideoURI, setIsVideoURI] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(30);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const {type, modalDetails, inspectionId} = route.params;
  const {subCategory, instructionalText, source, title, isVideo, groupType} =
    modalDetails;

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
      setCounter(30);
    };
  }, []);

  useEffect(() => {
    let interval = null;
    counter === 0 && reset();
    if (isRecording) {
      interval = setInterval(() => {
        setCounter(counter - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [counter, isRecording]);

  useEffect(() => {
    if (isBackCamera) {
      setSelectedCamera('front');
    } else {
      setSelectedCamera('back');
    }
  }, [isBackCamera, device]);

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
            const path = `file://${video.path}`;
            // Platform.OS === 'android' ? video.path : `file://${video.path}`;
            setIsVideoURI(path);
          },
          onRecordingError: error => console.error(error.message),
        });
      }
    }
  };
  const handleRetryPress = () => {
    setIsRecording(false);
    setIsVideoURI('');
    setIsVideoFile({});
    setCounter(30);
  };
  const handleResponse = async key => {
    const body = {
      category: subCategory,
      url: key,
      extension: 'video/mp4',
      groupType: groupType,
      dateImage: getCurrentDate(),
    };
    await uploadFile(
      uploadVideoToStore,
      body,
      inspectionId,
      token,
      handleError,
    );
  };
  function uploadVideoToStore(imageID) {
    dispatch(UpdateExteriorItemURI(type, isVideoURI, imageID));
    navigation.navigate(ROUTES.NEW_INSPECTION);
  }
  const handleError = () => {
    setIsModalVisible(false);
    setProgress(0);
  };
  const handleNextPress = () => {
    setIsModalVisible(true);
    const path = isVideoFile.path.replace('file://', '');
    getSignedUrl(
      token,
      'video/mp4',
      path,
      setProgress,
      handleResponse,
      handleError,
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
          {selectedCamera && (
            <Camera
              ref={videoRef}
              style={StyleSheet.absoluteFill}
              device={device}
              video={true}
              photo={false}
              audio={true}
              isActive={isFocused && appState.current === 'active'}
              enableZoomGesture={true}
              format={format}
            />
          )}
          <View style={PreviewStyles.headerContainer}>
            <TouchableOpacity onPress={handleNavigationBackPress}>
              <BackArrow
                height={hp('8%')}
                width={wp('8%')}
                color={colors.white}
              />
            </TouchableOpacity>
            <View style={PreviewStyles.counterContainer}>
              <Text style={PreviewStyles.counterText}>{counter}</Text>
            </View>
          </View>
          <CameraFooter
            isCamera={false}
            isRecording={isRecording}
            handleSwitchCamera={handleSwitchCamera}
            handleCaptureNowPress={handleRecordingPress}
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
