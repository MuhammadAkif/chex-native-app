import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
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
  const devices = useCameraDevices('wide-angle-camera');
  const [device, setDevice] = useState();
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [isImageURL, setIsImageURL] = useState('');
  const [isImageFile, setIsImageFile] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const {type, modalDetails, inspectionId} = route.params;
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
      setDevice(devices.back);
    } else {
      setDevice(devices.front);
    }
  }, [isBackCamera, devices]);

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
  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(async image => {
        setIsImageFile(image);
        setIsImageURL(image?.path);
      })
      .catch(error => console.log(error.code));
  };
  const handleRetryPress = () => {
    setIsImageURL('');
    setIsImageFile({});
  };
  const handleResponse = async key => {
    const body = {
      category: subCategory,
      url: key,
      extension: isImageFile.mime,
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
    setIsModalVisible(true);
    getSignedUrl(
      token,
      isImageFile.mime,
      isImageFile.path,
      // isImageFile.sourceURL,
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
            device && (
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                photo={true}
                audio={false}
                isActive={isFocused && appState.current === 'active'}
                enableZoomGesture={true}
                includeBase64={true}
              />
            )
          )}
          <TouchableOpacity
            style={PreviewStyles.headerContainer}
            onPress={handleNavigationBackPress}>
            <BackArrow
              height={hp('8%')}
              width={wp('8%')}
              color={colors.white}
              // onPress={handleNavigationBackPress}
            />
          </TouchableOpacity>
          <CameraFooter
            isCamera={true}
            handleSwitchCamera={handleSwitchCamera}
            handleCaptureNowPress={handleCaptureNowPress}
            openPhotoLibrary={handleImagePicker}
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
