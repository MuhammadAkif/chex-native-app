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
  UpdateInteriorItemURI,
  UpdateTiresItemURI,
} from '../Store/Actions';
import {
  exteriorVariant,
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
  Interior: UpdateInteriorItemURI,
  Exterior: UpdateExteriorItemURI,
  Tires: UpdateTiresItemURI,
};
const {white} = colors;

const {NEW_INSPECTION, INSPECTION_SELECTION} = ROUTES;
const {IS_LICENSE_PLATE_UPLOADED, plate_Number, CLEAR_INSPECTION_IMAGES} =
  Types;
const CameraContainer = ({route, navigation}) => {
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
    const {INTERIOR, EXTERIOR} = INSPECTION;
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
    if (groupType === INTERIOR || groupType === EXTERIOR) {
      body = {...body, variant: variant};
    }
    if (category === 'CarVerification' && type === 'licensePlate') {
      await handleExtractNumberPlate(`${S3_BUCKET_BASEURL}${key}`);
    }
    await uploadFile(
      uploadImageToStore,
      body,
      inspectionId,
      token,
      handleError,
      dispatch,
    );
  };
  function uploadImageToStore(imageID) {
    const isLicensePlate =
      category === 'CarVerification' && type === 'licensePlate';
    const is_Interior = category === 'Interior';
    const is_Exterior = category === 'Exterior';
    const annotationDetails = {uri: isImageURL};
    let type_ = type;
    if (is_Exterior || is_Interior) {
      type_ = exteriorVariant(type_, variant);
    }
    const displayAnnotation =
      (is_Interior && vehicle_Type === 'new') ||
      (is_Exterior && vehicle_Type === 'new');
    const UPDATE_INSPECTION_IMAGES = handleUpdateStoreMedia[category];
    dispatch(UPDATE_INSPECTION_IMAGES(type_, isImageURL, imageID));
    if (isLicensePlate) {
      dispatch({type: IS_LICENSE_PLATE_UPLOADED});
    }
    navigate(NEW_INSPECTION, {
      isLicensePlate: isLicensePlate,
      displayAnnotation: displayAnnotation,
      fileId: imageID,
      annotationDetails: annotationDetails,
      is_Exterior: is_Exterior || is_Interior,
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
        dispatch({type: plate_Number, payload: res?.data?.plateNumber});
      })
      .catch(error => console.log('AI error => ', error));
  };
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
        dispatch({type: CLEAR_INSPECTION_IMAGES});
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };
  const handleExitPress = () => {
    resetAllStates();
    navigate(INSPECTION_SELECTION);
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
              <BackArrow height={hp('8%')} width={wp('8%')} color={white} />
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
