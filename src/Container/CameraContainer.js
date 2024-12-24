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
import ImagePicker from 'react-native-image-crop-picker';

import {colors, PreviewStyles} from '../Assets/Styles';
import {BackArrow} from '../Assets/Icons';
import {
  CameraFooter,
  CameraPreview,
  CaptureImageModal,
  DiscardInspectionModal,
} from '../Components';
import {ROUTES} from '../Navigation/ROUTES';
import {
  clearInspectionImages,
  setLicensePlateNumber,
  getMileage,
  updateVehicleImage,
} from '../Store/Actions';
import {
  checkRelevantType,
  exteriorVariant,
  getCurrentDate,
  getSignedUrl,
  handle_Session_Expired,
  handleNewInspectionPress,
  hasCameraAndMicrophoneAllowed,
  isNotEmpty,
  newInspectionUploadError,
  uploadFile,
} from '../Utils';
import {
  darkImageError,
  EXPIRY_INSPECTION,
  HARDWARE_BACK_PRESS,
  INSPECTION,
  IS_BACK_CAMERA,
  PHYSICAL_DEVICES,
  S3_BUCKET_BASEURL,
  SWITCH_CAMERA,
  uploadFailed,
} from '../Constants';
import ExpiredInspectionModal from '../Components/PopUpModals/ExpiredInspectionModal';
import {IMAGES} from '../Assets/Images';
import {
  styleMapping,
  switchFrameIcon,
  switchOrientation,
} from '../Utils/helpers';

const {white} = colors;
const defaultOrientation = 'portrait';
const {container, headerContainer} = PreviewStyles;

const {NEW_INSPECTION, INSPECTION_SELECTION} = ROUTES;
const isUploadFailedInitialState = {visible: false, title: '', message: ''};

const CameraContainer = ({route, navigation}) => {
  const {selectedInspectionID} = useSelector(state => state.newInspection);
  const dispatch = useDispatch();
  const {navigate, goBack, canGoBack} = navigation;
  const {
    user: {token, data},
  } = useSelector(state => state?.auth);
  const {vehicle_Type, variant} = useSelector(state => state.newInspection);
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
  const [isUploadFailed, setIsUploadFailed] = useState(
    isUploadFailedInitialState,
  );
  const {type, modalDetails, inspectionId} = route.params;
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [orientation, setOrientation] = useState(defaultOrientation);
  const {
    category,
    subCategory,
    instructionalText,
    source,
    title,
    isVideo,
    groupType,
  } = modalDetails;
  const frameStyles = {
    portrait: {
      ...styles.portraitFrame,
      ...styleMapping[orientation][subCategory],
    },
    landscape: {
      ...styles.landscapeFrame,
      ...styleMapping[orientation][subCategory],
    },
  };
  const activeFrameStyle = frameStyles[orientation];
  const frameUri = IMAGES[orientation][subCategory] || '';
  const RightIcon = switchFrameIcon[orientation];
  const haveFrame = isNotEmpty(frameUri);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      resetAllStates();
    };
  }, []);

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

  function resetAllStates() {
    setIsImageURL('');
    setIsImageFile({});
    setIsModalVisible(false);
    setProgress(0);
    setIsExpiryInspectionVisible(false);
    setOrientation(defaultOrientation);
    setIsUploadFailed(isUploadFailedInitialState);
  }

  function handle_Hardware_Back_Press() {
    if (isImageURL) {
      handleRetryPress();
      return true;
    } else if (canGoBack()) {
      navigate(NEW_INSPECTION);
      return true;
    }
    return false;
  }

  const handleNavigationBackPress = () => goBack();

  const handleVisible = () => {
    setProgress(0);
    setIsModalVisible(false);
  };

  const handleSwitchCamera = () => setIsBackCamera(!isBackCamera);

  const handleCaptureNowPress = async () => {
    hasCameraAndMicrophoneAllowed().then();
    if (cameraRef.current) {
      let file = await cameraRef?.current?.takePhoto();
      const filePath = `file://${file.path}`;
      setIsImageFile(file);
      setIsImageURL(filePath);
    }
  };

  const handleRetryPress = () => {
    setIsImageURL('');
    setIsImageFile({});
  };

  const handleResponse = async key => {
    const haveType = checkRelevantType(groupType);
    let extension = isImageFile.path.split('.').pop() || 'jpeg';
    const mime = 'image/' + extension;
    let body = {
      category: subCategory,
      url: key,
      extension: mime,
      groupType: groupType,
      dateImage: getCurrentDate(),
      hasAdded: vehicle_Type,
    };
    if (haveType) {
      body = {...body, variant: variant};
    }
    const image_url = `${S3_BUCKET_BASEURL}${key}`;
    if (category === 'CarVerification' && type === 'licensePlate') {
      await handleExtractNumberPlate(image_url);
    }
    if (category === 'CarVerification' && type === 'odometer') {
      try {
        dispatch(getMileage(image_url));
      } catch (error) {
        throw error;
      }
    }
    try {
      await uploadFile(
        uploadImageToStore,
        body,
        inspectionId,
        token,
        handleError,
        dispatch,
      );
    } catch (error) {
      onUploadFailed(error);
    }
  };

  function onUploadFailed(error) {
    const {statusCode = null} = error?.response?.data || {};
    const {message} = error;
    const {title = uploadFailed.title, message: msg = uploadFailed.message} =
      newInspectionUploadError(statusCode || '');
    let body = {visible: true, title, message: msg};
    const isDarkImage = message === darkImageError.message;
    const message_ = isDarkImage ? message : uploadFailed.message;
    setIsModalVisible(false);

    if (isDarkImage) {
      body = {...body, message: message_};
      setIsUploadFailed(body);
    } else if (statusCode === 401) {
      handle_Session_Expired(statusCode, dispatch);
    } else if (statusCode === 403) {
      handleError(true);
    } else {
      setIsUploadFailed(body);
    }
  }
  function uploadImageToStore(imageID) {
    const isLicensePlate =
      category === 'CarVerification' && type === 'licensePlate';
    const isOdometer = category === 'CarVerification' && type === 'odometer';
    const types = ['Interior', 'Exterior'];
    const haveType = types.includes(category);
    const annotationDetails = {uri: isImageURL};
    let type_ = type;
    if (haveType) {
      type_ = exteriorVariant(type_, variant);
    }
    const displayAnnotation = haveType && vehicle_Type === 'new';
    dispatch(updateVehicleImage(groupType, type_, isImageURL, imageID));
    const params = {
      isLicensePlate: isLicensePlate,
      isOdometer: isOdometer,
      displayAnnotation: displayAnnotation,
      fileId: imageID,
      annotationDetails: annotationDetails,
      is_Exterior: haveType,
    };
    navigate(NEW_INSPECTION, params);
  }

  const handleExtractNumberPlate = async imageUrl => {
    dispatch(setLicensePlateNumber(imageUrl));
  };

  const handleError = (inspectionDeleted = false) => {
    setIsUploadFailed(isUploadFailedInitialState);
    if (inspectionDeleted) {
      setIsExpiryInspectionVisible(true);
    } else {
      setProgress(0);
    }
  };

  const handleNextPress = async () => {
    let extension = isImageFile.path.split('.').pop() || 'jpeg';
    const mime = 'image/' + extension;
    setIsModalVisible(true);
    try {
      await getSignedUrl(
        token,
        mime,
        isImageFile.path,
        setProgress,
        handleResponse,
        handleError,
        dispatch,
        selectedInspectionID,
        subCategory,
        variant || 0,
        'app',
        data?.companyId,
        category,
      );
    } catch (error) {
      onUploadFailed(error);
    }
  };

  function onRetryPress() {
    handleError(false);
  }

  const onNewInspectionPress = async () => {
    await handleNewInspectionPress(
      dispatch,
      setIsLoading,
      data?.companyId,
      navigation,
      resetAllStates,
    )
      .then(() => {
        dispatch(clearInspectionImages());
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleExitPress = () => {
    resetAllStates();
    navigate(INSPECTION_SELECTION);
  };

  const handleOnRightIconPress = () =>
    setOrientation(prevState => switchOrientation[prevState]);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // includeBase64: true,
    })
      .then(image => {
        const {sourceURL, path} = image;
        setIsImageFile(image);
        setIsImageURL(sourceURL || path);
      })
      .catch(error => console.log(error.code));
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
          isExterior={checkRelevantType(groupType)}
          isCarVerification={groupType === INSPECTION.carVerificiationItems}
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
        <View style={container}>
          {isImageURL ? (
            <FastImage
              priority={'normal'}
              resizeMode={'stretch'}
              style={[StyleSheet.absoluteFill, {borderRadius: 25}]}
              source={{uri: isImageURL}}
            />
          ) : (
            selectedCamera && (
              <>
                {haveFrame && (
                  <View style={styles.frameContainer}>
                    <FastImage
                      resizeMode={'stretch'}
                      priority={'high'}
                      style={activeFrameStyle}
                      source={frameUri}
                    />
                  </View>
                )}
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
              </>
            )
          )}
          <View style={{...headerContainer, zIndex: 19}}>
            <TouchableOpacity onPress={handleNavigationBackPress}>
              <BackArrow height={hp('8%')} width={wp('8%')} color={white} />
            </TouchableOpacity>
          </View>
          <CameraFooter
            isCamera={true}
            handleSwitchCamera={handleSwitchCamera}
            handleCaptureNowPress={handleCaptureNowPress}
            RightIcon={RightIcon}
            onRightIconPress={handleOnRightIconPress}
            displayFrame={haveFrame}
            handleImagePicker={handleImagePicker}
            isCameraIcon={false}
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
      {isUploadFailed.visible && (
        <DiscardInspectionModal
          onYesPress={onRetryPress}
          title={isUploadFailed.title}
          description={isUploadFailed.message}
          yesButtonText={'Retry'}
          dualButton={false}
          onNoPress={undefined}
          noButtonText={undefined}
          noButtonStyle={undefined}
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
const styles = StyleSheet.create({
  frameContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 19,
  },
  landscapeFrame: {
    height: hp('30%'),
    transform: [{scale: 1.5}, {rotate: '-90deg'}],
  },
  portraitFrame: {
    width: wp('95%'),
  },
});
export default CameraContainer;
