import React, {useEffect, useRef, useState} from 'react';
import {AppState, StatusBar, StyleSheet, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';

import {colors, PreviewStyles} from '../Assets/Styles';
import {BackArrow} from '../Assets/Icons';
import {CameraFooter, RecordingPreview} from '../Components';
import {ROUTES} from '../Navigation/ROUTES';
import {updateExteriorItemURI} from '../Store/Actions';

const VideoContainer = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const videoRef = useRef();
  const appState = useRef(AppState.currentState);
  const devices = useCameraDevices('wide-angle-camera');
  const [device, setDevice] = useState();
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [isVideoURI, setIsVideoURI] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(30);
  const {type} = route.params;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      console.log('cleaning video uri');
      setIsVideoURI('');
      setIsRecording(false);
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
        console.log(video);
        setIsVideoURI(video?.sourceURL);
      })
      .catch(error => console.log(error.code));
  };
  const handleRetryPress = () => {
    setIsRecording(false);
    setIsVideoURI('');
    // setCounter(30);
  };
  const handleNextPress = () => {
    dispatch(updateExteriorItemURI(type, isVideoURI));
    navigation.navigate(ROUTES.NEW_INSPECTION);
  };

  return (
    <>
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
