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
  clearInspectionImages,
  setLicensePlateNumber,
  updateVehicleImage,
} from '../Store/Actions';
import {
  checkRelevantType,
  exteriorVariant,
  getCurrentDate,
  getSignedUrl,
  handleNewInspectionPress,
  isNotEmpty,
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
    const url = S3_BUCKET_BASEURL + key;
    const haveType = checkRelevantType(groupType);
    let extension = isImageFile.path.split('.').pop();
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
      await uploadFile(
        uploadImageToStore,
        body,
        inspectionId,
        token,
        handleError,
        dispatch,
      );
    }, 2000);
  };
  function uploadImageToStore(imageID) {
    const isLicensePlate =
      category === 'CarVerification' && type === 'licensePlate';
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
      displayAnnotation: displayAnnotation,
      fileId: imageID,
      annotationDetails: annotationDetails,
      is_Exterior: haveType,
    };
    navigate(NEW_INSPECTION, params);
  }
  const handleExtractNumberPlate = async imageURL => {
    const body = {image_url: imageURL};
    const headers = {
      api_token: AI_API_TOKEN,
    };
    await axios
      .post(EXTRACT_NUMBER_PLATE_WITH_AI, body, {headers: headers})
      .then(onExtractNumberPlateSuccess)
      .catch(onExtractNumberPlateFail);
  };
  function onExtractNumberPlateSuccess(res) {
    const {plateNumber = null} = res?.data || {};
    dispatch(setLicensePlateNumber(plateNumber));
  }
  function onExtractNumberPlateFail(error) {
    console.log('AI error => ', error);
  }
  const handleError = (inspectionDeleted = false) => {
    if (inspectionDeleted) {
      setIsModalVisible(false);
      setIsExpiryInspectionVisible(true);
    } else {
      setIsModalVisible(false);
      setProgress(0);
    }
  };
  const handleNextPress = () => {
    let extension = isImageFile.path.split('.')[2];
    const mime = 'image/' + extension;
    setIsModalVisible(true);
    getSignedUrl(
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
