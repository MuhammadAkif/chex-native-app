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
import {useAuth} from '../hooks';

const {white} = colors;
const defaultOrientation = 'portrait';
const {container, headerContainer} = PreviewStyles;

const {NEW_INSPECTION, INSPECTION_SELECTION} = ROUTES;
const isUploadFailedInitialState = {visible: false, title: '', message: ''};

const CameraContainer = ({route, navigation}) => {
  const {selectedInspectionID} = useSelector(state => state.newInspection);
  const dispatch = useDispatch();
  const {navigate, goBack, canGoBack} = navigation;
  const {user} = useAuth();
  const {vehicle_Type, variant} = useSelector(state => state.newInspection);
  const isFocused = useIsFocused();
  const cameraRef = useRef();
  const appState = useRef(AppState.currentState);
  const [selectedCamera, setSelectedCamera] = useState('back');
  /*const device = useCameraDevice(selectedCamera, {
    physicalDevices: PHYSICAL_DEVICES,
  });
  const [isBackCamera, setIsBackCamera] = useState(
    IS_BACK_CAMERA[selectedCamera],
  );*/
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
  /*const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);*/
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
  /*useEffect(() => {
    setSelectedCamera(SWITCH_CAMERA[isBackCamera]);
  }, [isBackCamera, device]);*/

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
    if (category === 'CarVerification' && type === 'licensePlate') {
      await handleExtractNumberPlate(`${S3_BUCKET_BASEURL}${key}`);
    }
    /*Setting delay because the backend needs processing time to do some actions*/
    setTimeout(async () => {
      try {
        await uploadFile(uploadImageToStore, body, inspectionId);
      } catch (error) {
        onUploadFailed(error);
      }
    }, 2000);
  };

  /**
   * Handles the failure of an image upload by displaying relevant error messages and managing session states.
   *
   * @param {Object} error - The error object from the upload process, which may contain status code and message.
   */
  function onUploadFailed(error) {
    const {statusCode = null} = error?.response?.data || {};
    const {message} = error;

    const {
      title = uploadFailed.title,
      message: defaultErrorMessage = uploadFailed.message,
    } = newInspectionUploadError(statusCode || '');

    const isDarkImage = message === darkImageError.message;
    const displayMessage = isDarkImage ? message : defaultErrorMessage;

    setIsModalVisible(false);

    const errorBody = {
      visible: true,
      title,
      message: displayMessage,
    };
    console.log({statusCode});
    if (isDarkImage) {
      setIsUploadFailed(errorBody);
    } else if (statusCode === 401) {
      handle_Session_Expired(statusCode, dispatch);
    } else if (statusCode === 403) {
      handleError(true);
    } else {
      setIsUploadFailed(errorBody);
    }
  }

  /**
   * Uploads an image to the store and navigates to the inspection screen with relevant parameters.
   *
   * @param {string} imageID - The unique identifier of the image to be uploaded.
   */
  function uploadImageToStore(imageID) {
    const isLicensePlate =
      category === 'CarVerification' && type === 'licensePlate';
    const validTypes = ['Interior', 'Exterior'];
    const hasValidType = validTypes.includes(category);
    const annotationDetails = {uri: isImageURL};

    // Determine the type for exterior variant if applicable
    let selectedType = type;
    if (hasValidType) {
      selectedType = exteriorVariant(selectedType, variant);
    }

    // Check if annotations should be displayed
    const displayAnnotation = hasValidType && vehicle_Type === 'new';

    // Dispatch an action to update the vehicle image in the store
    dispatch(updateVehicleImage(groupType, selectedType, isImageURL, imageID));

    // Prepare navigation parameters
    const params = {
      isLicensePlate,
      displayAnnotation,
      fileId: imageID,
      annotationDetails,
      isExterior: hasValidType,
    };

    // Navigate to the new inspection screen with prepared parameters
    navigate(NEW_INSPECTION, params);
  }

  const handleExtractNumberPlate = async imageUrl => {
    dispatch(setLicensePlateNumber(imageUrl));
  };

  const handleError = (inspectionDeleted = false) => {
    console.log({inspectionDeleted});
    setIsUploadFailed(isUploadFailedInitialState);
    if (inspectionDeleted) {
      setIsExpiryInspectionVisible(true);
    } else {
      setProgress(0);
    }
  };

  /**
   * Handles the next button press, initiating the process to get a signed URL and upload an image.
   *
   * @returns {Promise<void>} Resolves once the signed URL is obtained and upload is initiated.
   */
  const handleNextPress = async () => {
    const fileExtension = isImageFile.path.split('.').pop() || 'jpeg';
    const mimeType = `image/${fileExtension}`;

    setIsModalVisible(true);
    try {
      await getSignedUrl(
        mimeType,
        isImageFile.path,
        setProgress,
        handleResponse,
        selectedInspectionID,
        subCategory,
        variant || 0,
      );
    } catch (error) {
      onUploadFailed(error);
    }
  };

  function onRetryPress() {
    handleError(false);
  }

  const onNewInspectionPress = async () => {
    try {
      await handleNewInspectionPress(
        dispatch,
        setIsLoading,
        user?.companyId,
        navigation,
      );
      resetAllStates();
      dispatch(clearInspectionImages());
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleExitPress = () => {
    resetAllStates();
    navigate(INSPECTION_SELECTION);
  };

  const handleOnRightIconPress = () =>
    setOrientation(prevState => switchOrientation[prevState]);

  /**
   * Opens the image picker, allowing the user to select an image and sets the selected image data.
   */
  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
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
                {/*<Camera
                  ref={cameraRef}
                  style={StyleSheet.absoluteFill}
                  device={device}
                  photo={true}
                  audio={false}
                  isActive={isFocused && appState.current === 'active'}
                  enableZoomGesture={true}
                  includeBase64={true}
                  format={format}
                />*/}
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
