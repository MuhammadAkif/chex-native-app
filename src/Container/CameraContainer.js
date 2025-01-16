import React, {useEffect, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import {PreviewStyles} from '../Assets/Styles';
import {
  CaptureImageModal,
  CustomCamera,
  DiscardInspectionModal,
} from '../Components';
import {ROUTES} from '../Navigation/ROUTES';
import {
  clearInspectionImages,
  setLicensePlateNumber,
  getMileage,
  updateVehicleImage,
  setImageDimensions,
} from '../Store/Actions';
import {
  checkRelevantType,
  exteriorVariant,
  getCurrentDate,
  getSignedUrl,
  handle_Session_Expired,
  handleNewInspectionPress,
  isNotEmpty,
  newInspectionUploadError,
  uploadFile,
} from '../Utils';
import {
  darkImageError,
  EXPIRY_INSPECTION,
  HARDWARE_BACK_PRESS,
  INSPECTION,
  S3_BUCKET_BASEURL,
  uploadFailed,
} from '../Constants';
import ExpiredInspectionModal from '../Components/PopUpModals/ExpiredInspectionModal';
import {IMAGES} from '../Assets/Images';
import {
  getFileMimeType,
  styleMapping,
  switchFrameIcon,
  switchOrientation,
} from '../Utils/helpers';
import {useAuth, useMediaPicker} from '../hooks';

const defaultOrientation = 'portrait';
const {container} = PreviewStyles;

const {NEW_INSPECTION, INSPECTION_SELECTION} = ROUTES;
const isUploadFailedInitialState = {visible: false, title: '', message: ''};

const CameraContainer = ({route, navigation}) => {
  const {error, selectMedia} = useMediaPicker();
  const {selectedInspectionID} = useSelector(state => state.newInspection);
  const dispatch = useDispatch();
  const {navigate, goBack, canGoBack} = navigation;
  const {user, token} = useAuth();
  const {vehicle_Type, variant} = useSelector(state => state.newInspection);
  const [isImageFile, setIsImageFile] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExpiryInspectionVisible, setIsExpiryInspectionVisible] =
    useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploadFailed, setIsUploadFailed] = useState(
    isUploadFailedInitialState,
  );
  const {type, modalDetails, inspectionId} = route.params;
  const [hideFrame, setHideFrame] = useState(false);
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
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, [isImageFile]);

  function resetAllStates() {
    setIsImageFile({});
    setIsModalVisible(false);
    setProgress(0);
    setIsExpiryInspectionVisible(false);
    setOrientation(defaultOrientation);
    setIsUploadFailed(isUploadFailedInitialState);
    setHideFrame(false);
  }

  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      navigate(NEW_INSPECTION);
      return true;
    }
    return false;
  }

  const handleNavigationBackPress = () => goBack();

  const handleCaptureNowPress = async file => {
    setHideFrame(true);
    dispatch(setImageDimensions(file));
    setIsImageFile(file);
  };

  const handleRetryPress = () => {
    setIsImageFile({});
    setHideFrame(false);
  };

  const handleResponse = async key => {
    const haveType = checkRelevantType(groupType);
    const mime = getFileMimeType(isImageFile.path);

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
    const isOdometer = category === 'CarVerification' && type === 'odometer';

    const validTypes = ['Interior', 'Exterior'];
    const hasValidType = validTypes.includes(category);
    const annotationDetails = {uri: isImageFile.uri};

    // Determine the type for exterior variant if applicable
    let selectedType = type;
    if (hasValidType) {
      selectedType = exteriorVariant(selectedType, variant);
    }

    // Check if annotations should be displayed
    const displayAnnotation = hasValidType && vehicle_Type === 'new';

    // Dispatch an action to update the vehicle image in the store
    dispatch(
      updateVehicleImage(groupType, selectedType, isImageFile.uri, imageID),
    );

    // Prepare navigation parameters
    const params = {
      isLicensePlate,
      isOdometer,
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
    const mimeType = getFileMimeType(isImageFile.path);

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
        'app',
        user?.companyId,
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
  const onCaptureError = error => {
    console.error(error);
  };
  /**
   * Opens the image picker, allowing the user to select an image and sets the selected image data.
   */
  const handleImagePicker = () => {
    try {
      const response = selectMedia();
      setIsImageFile(response);
    } catch (err) {
      throw error;
    }
  };

  return (
    <>
      <View style={{...container, paddingTop: null}}>
        <CustomCamera
          onCapture={handleCaptureNowPress}
          onBackPress={handleNavigationBackPress}
          onRetryPress={handleRetryPress}
          onNextPress={handleNextPress}
          displayFrame={haveFrame}
          onFramePress={handleOnRightIconPress}
          RightIcon={RightIcon}>
          {!hideFrame && haveFrame && (
            <View style={styles.frameContainer}>
              <FastImage
                resizeMode={'stretch'}
                priority={'high'}
                style={activeFrameStyle}
                source={frameUri}
              />
            </View>
          )}
        </CustomCamera>
      </View>
      {isExpiryInspectionVisible && (
        <ExpiredInspectionModal
          onConfirmPress={onNewInspectionPress}
          onCancelPress={handleExitPress}
          visible={true}
          isLoading={isLoading}
          confirmButtonText={EXPIRY_INSPECTION.confirmButton}
        />
      )}
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
    zIndex: 1,
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
