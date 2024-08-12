import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  BackHandler,
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
import axios from 'axios';

import {colors, PreviewStyles} from '../Assets/Styles';
import {BackArrow} from '../Assets/Icons';
import {CameraFooter, CameraPreview, CaptureImageModal} from '../Components';
import {ROUTES} from '../Navigation/ROUTES';
import {
  UpdateCarVerificationItemURI,
  UpdateExteriorItemURI,
  UpdateTiresItemURI,
} from '../Store/Actions';
import {
  getCurrentDate,
  getSignedUrl,
  handleNewInspectionPress,
  uploadFile,
} from '../Utils';
import {
  AI_API_TOKEN,
  EXPIRY_INSPECTION,
  EXTRACT_NUMBER_PLATE_WITH_AI,
  HARDWARE_BACK_PRESS,
  INSPECTION,
  IS_BACK_CAMERA,
  PHYSICAL_DEVICES,
  S3_BUCKET_BASEURL,
  SWITCH_CAMERA,
} from '../Constants';
import {Types} from '../Store/Types';
import ExpiredInspectionModal from '../Components/PopUpModals/ExpiredInspectionModal';

const handleUpdateStoreMedia = {
  CarVerification: UpdateCarVerificationItemURI,
  Exterior: UpdateExteriorItemURI,
  Tires: UpdateTiresItemURI,
};

const CameraContainer = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {token, data} = useSelector(state => state?.auth);
  const isFocused = useIsFocused();
  const cameraRef = useRef();
  const appState = useRef(AppState.currentState);
  const [selectedCamera, setSelectedCamera] = useState('back');
  const device = useCameraDevice(selectedCamera, {
    physicalDevices: PHYSICAL_DEVICES,
  });
  const [isBackCamera, setIsBackCamera] = useState(
    IS_BACK_CAMERA[selectedCamera],
  );
  const [isImageURL, setIsImageURL] = useState('');
  const [isImageFile, setIsImageFile] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExpiryInspectionVisible, setIsExpiryInspectionVisible] =
    useState(false);
  const [progress, setProgress] = useState(0);
  const {type, modalDetails, inspectionId} = route.params;
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    category,
    subCategory,
    instructionalText,
    source,
    title,
    isVideo,
    groupType,
  } = modalDetails;
  const {NEW_INSPECTION, INSPECTION_SELECTION} = ROUTES;
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      resetAllStates();
    };
  }, []);
  function resetAllStates() {
    setIsImageURL('');
    setIsImageFile({});
    setIsModalVisible(false);
    setProgress(0);
    setIsExpiryInspectionVisible(false);
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, [isImageURL]);

  useEffect(() => {
    setSelectedCamera(SWITCH_CAMERA[isBackCamera]);
  }, [isBackCamera, device]);

  function handle_Hardware_Back_Press() {
    if (isImageURL) {
      handleRetryPress();
      return true;
    } else if (navigation.canGoBack()) {
      navigation.navigate(NEW_INSPECTION);
      return true;
    }
    return false;
  }
  const handleNavigationBackPress = () => navigation.goBack();
  /* const handleVisible = () => {
    setProgress(0);
    setIsModalVisible(false);
  }; */
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
    let extension = isImageFile.path.split('.')[2];
    const body = {
      category: subCategory,
      url: key,
      extension: `image/${extension}`,
      groupType: groupType,
      dateImage: getCurrentDate(),
    };
    if (category === 'CarVerification' && type === 'licensePlate') {
      await handleExtractNumberPlate(`${S3_BUCKET_BASEURL}${key}`);
    }
    await uploadFile(
      uploadImageToStore,
      body,
      inspectionId,
      token,
      handleError,
    );
  };
  function uploadImageToStore(imageID) {
    const UPDATE_INSPECTION_IMAGES = handleUpdateStoreMedia[category];
    const isCarVerificationLicensePlate =
      category === 'CarVerification' && type === 'licensePlate';
    dispatch(UPDATE_INSPECTION_IMAGES(type, isImageURL, imageID));
    navigation.navigate(NEW_INSPECTION, {
      isLicensePlate: isCarVerificationLicensePlate,
    });
  }
  const handleExtractNumberPlate = async imageURL => {
    const body = {image_url: imageURL};
    const headers = {
      api_token: AI_API_TOKEN,
    };
    await axios
      .post(EXTRACT_NUMBER_PLATE_WITH_AI, body, {headers: headers})
      .then(res => {
        console.log('AI res => ', res?.data);
        dispatch({type: Types.PLATE_NUMBER, payload: res?.data?.plateNumber});
      })
      .catch(error => console.log('AI error => ', error));
  };
  const handleError = (inspectionDeleted = false) => {
    setIsModalVisible(false);
    if (inspectionDeleted) {
      setIsExpiryInspectionVisible(true);
    } else {
      setProgress(0);
    }
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

  const onNewInspectionPress = async () => {
    await handleNewInspectionPress(
      dispatch,
      setIsLoading,
      data?.companyId,
      token,
      navigation,
      resetAllStates,
    )
      .then(() => {
        dispatch({type: Types.CLEAR_INSPECTION_IMAGES});
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };
  const handleExitPress = () => {
    resetAllStates();
    navigation.navigate(INSPECTION_SELECTION);
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
          isExterior={groupType === INSPECTION.EXTERIOR}
          isCarVerification={groupType === INSPECTION.CAR_VERIFICATION}
          // handleVisible={handleVisible}
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
      {isExpiryInspectionVisible && (
        <ExpiredInspectionModal
          onConfirmPress={onNewInspectionPress}
          onCancelPress={handleExitPress}
          visible={true}
          isLoading={isLoading}
          confirmButtonText={EXPIRY_INSPECTION.confirmButton}
        />
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
