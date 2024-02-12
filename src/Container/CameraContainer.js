import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
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
import FastImage from 'react-native-fast-image';

import {colors, PreviewStyles} from '../Assets/Styles';
import {BackArrow} from '../Assets/Icons';
import {CameraFooter, CameraPreview, CaptureImageModal} from '../Components';
import {ROUTES} from '../Navigation/ROUTES';
import {
  UpdateCarVerificationItemURI,
  UpdateExteriorItemURI,
  UpdateTiresItemURI,
} from '../Store/Actions';
import {getCurrentDate, getSignedUrl, uploadFile} from '../Utils';

const CameraContainer = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state?.auth);
  const isFocused = useIsFocused();
  const cameraRef = useRef();
  const appState = useRef(AppState.currentState);
  const [selectedCamera, setSelectedCamera] = useState('back');
  const device = useCameraDevice(selectedCamera, {
    physicalDevices: [
      'wide-angle-camera',
      'ultra-wide-angle-camera',
      'telephoto-camera',
    ],
  });
  const [isBackCamera, setIsBackCamera] = useState(selectedCamera === 'front');
  const [isImageURL, setIsImageURL] = useState('');
  const [isImageFile, setIsImageFile] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const {type, modalDetails, inspectionId} = route.params;
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);
  const {
    category,
    subCategory,
    instructionalText,
    source,
    title,
    isVideo,
    groupType,
  } = modalDetails;
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      setIsImageURL('');
      setIsImageFile({});
      setIsModalVisible(false);
      setProgress(0);
    };
  }, []);

  useEffect(() => {
    if (isBackCamera) {
      setSelectedCamera('front');
    } else {
      setSelectedCamera('back');
    }
  }, [isBackCamera, device]);

  const handleNavigationBackPress = () => navigation.goBack();
  const handleVisible = () => {
    setProgress(0);
    setIsModalVisible(false);
  };
  const handleSwitchCamera = () => setIsBackCamera(!isBackCamera);
  const handleCaptureNowPress = async () => {
    if (cameraRef.current) {
      let file = await cameraRef?.current?.takePhoto();
      const filePath = `file://${file.path}`;
      setIsImageFile(file);
      setIsImageURL(filePath);
      // const result = await fetch(filePath);
      // const data = await result.blob();
    }
  };
  const handleRetryPress = () => {
    setIsImageURL('');
    setIsImageFile({});
  };
  const handleResponse = async key => {
    let extension = isImageFile.path.split('.')[1];
    const body = {
      category: subCategory,
      url: key,
      extension: `image/${extension}`,
      groupType: groupType,
      dateImage: getCurrentDate(),
    };
    await uploadFile(
      uploadImageToStore,
      body,
      inspectionId,
      token,
      handleError,
    );
  };
  function uploadImageToStore(imageID) {
    category === 'CarVerification'
      ? dispatch(UpdateCarVerificationItemURI(type, isImageURL, imageID))
      : category === 'Exterior'
      ? dispatch(UpdateExteriorItemURI(type, isImageURL, imageID))
      : dispatch(UpdateTiresItemURI(type, isImageURL, imageID));
    navigation.navigate(ROUTES.NEW_INSPECTION);
  }
  const handleError = () => {
    setIsModalVisible(false);
    setProgress(0);
  };
  const handleNextPress = () => {
    let extension = isImageFile.path.split('.')[2];

    setIsModalVisible(true);
    getSignedUrl(
      token,
      `image/${extension}`,
      isImageFile.path,
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
      {isImageURL ? (
        <CameraPreview
          handleNavigationBackPress={handleNavigationBackPress}
          handleRetryPress={handleRetryPress}
          handleNextPress={handleNextPress}
          isImageURL={isImageURL}
        />
      ) : (
        <View style={PreviewStyles.container}>
          {isImageURL ? (
            <FastImage
              priority={'normal'}
              resizeMode={'stretch'}
              style={[StyleSheet.absoluteFill, {borderRadius: 25}]}
              source={{uri: isImageURL}}
            />
          ) : (
            selectedCamera && (
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                photo={true}
                audio={false}
                isActive={isFocused && appState.current === 'active'}
                enableZoomGesture={true}
                includeBase64={true}
                format={format}
              />
            )
          )}
          <View style={PreviewStyles.headerContainer}>
            <TouchableOpacity onPress={handleNavigationBackPress}>
              <BackArrow
                height={hp('8%')}
                width={wp('8%')}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
          <CameraFooter
            isCamera={true}
            handleSwitchCamera={handleSwitchCamera}
            handleCaptureNowPress={handleCaptureNowPress}
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

export default CameraContainer;
