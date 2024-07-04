import React, {useEffect, useState} from 'react';
import {ActivityIndicator, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

import {NewInspectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {
  NumberPlateSelectedAction,
  RemoveCarVerificationItemURI,
  RemoveExteriorItemURI,
  RemoveTiresItemURI,
} from '../Store/Actions';
import {Types} from '../Store/Types';
import {colors} from '../Assets/Styles';
import {
  DEV_URL,
  EXTRACT_NUMBER_PLATE,
  HARDWARE_BACK_PRESS,
  INSPECTION,
} from '../Constants';
import {
  EXTRACT_INSPECTION_ITEM_ID,
  isObjectEmpty,
  LicensePlateDetails,
  uploadInProgressMediaToStore,
} from '../Utils';

const IS_ALL_VEHICLE_PARTS_INITIAL_STATE = {
  isAllCarVerification: false,
  isAllExterior: false,
  isAllTires: false,
  isAllParts: false,
};

const NewInspectionContainer = ({route, navigation}) => {
  const dispatch = useDispatch();
  let {
    carVerificationItems,
    exteriorItems,
    tires,
    selectedInspectionID,
    company_ID,
    plateNumber,
    skipLeft,
    skipLeftCorners,
    skipRight,
    skipRightCorners,
  } = useSelector(state => state.newInspection);
  const {token} = useSelector(state => state?.auth);
  const modalMessageDetailsInitialState = {
    isVisible: false,
    title: '',
    message: '',
  };
  const deleteSuccess = {
    isVisible: true,
    title: '',
    message: 'Deleted Successfully.',
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [mediaModalDetails, setMediaModalDetails] = useState({});
  const [selectedOption, setSelectedOption] = useState({
    isCarVerification: true,
    isExterior: false,
    isTires: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteItem, setDeleteItem] = useState({category: null, key: null});
  const [isDiscardInspectionModalVisible, setIsDiscardInspectionModalVisible] =
    useState(false);
  const [
    isInspectionInProgressModalVisible,
    setIsInspectionInProgressModalVisible,
  ] = useState(false);
  const [isLicenseModalVisible, setIsLicenseModalVisible] = useState(false);
  // const [previousRoute, setPreviousRoute] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [inUseErrorTitle, setInUseErrorTitle] = useState('');
  const [inspectionID, setInspectionID] = useState(null);
  const modalDetailsInitialState = {
    ...LicensePlateDetails,
    isVideo: false,
  };
  const [modalDetails, setModalDetails] = useState(modalDetailsInitialState);
  const [modalMessageDetails, setModalMessageDetails] = useState(
    modalMessageDetailsInitialState,
  );
  // const [isAllExteriorImagesAvailable, setIsAllExteriorImagesAvailable] =
  //   useState(false);
  const [isAllVehicleParts, setIsAllVehicleParts] = useState(
    IS_ALL_VEHICLE_PARTS_INITIAL_STATE,
  );
  const submitText = isLoading ? (
    <ActivityIndicator size={'small'} color={colors.white} />
  ) : (
    'Submit'
  );

  useEffect(() => {
    let timeoutID;
    if (route.params) {
      const {routeName, isLicensePlate} = route.params;
      if (isLicensePlate) {
        setTimeout(() => setIsLicenseModalVisible(true), 1000);
      }
    }
  }, [route]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    let timeoutID = setTimeout(
      () => setModalMessageDetails(modalMessageDetailsInitialState),
      5000,
    );

    return () => {
      clearTimeout(timeoutID);
    };
  }, [modalMessageDetails]);
  useEffect(() => {
    if (exteriorItems?.exteriorLeft?.length) {
      dispatch({type: Types.SKIP_LEFT_CORNERS, payload: true});
    } else if (
      exteriorItems?.exteriorFrontLeftCorner?.length ||
      exteriorItems?.exteriorRearLeftCorner?.length
    ) {
      dispatch({type: Types.SKIP_LEFT, payload: true});
    } else {
      dispatch({type: Types.SKIP_LEFT, payload: false});
      dispatch({type: Types.SKIP_LEFT_CORNERS, payload: false});
    }
    if (exteriorItems?.exteriorRight?.length) {
      dispatch({type: Types.SKIP_RIGHT_CORNERS, payload: true});
    } else if (
      exteriorItems?.exteriorFrontRightCorner?.length ||
      exteriorItems?.exteriorRearRightCorner?.length
    ) {
      dispatch({type: Types.SKIP_RIGHT, payload: true});
    } else {
      dispatch({type: Types.SKIP_RIGHT, payload: false});
      dispatch({type: Types.SKIP_RIGHT_CORNERS, payload: false});
    }
  }, [exteriorItems]);
  useEffect(() => {
    handleIsAllVehicleParts();
  }, [carVerificationItems, exteriorItems, tires]);
  function handle_Hardware_Back_Press() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  }
  function resetAllStates() {
    setSelectedOption({
      isCarVerification: false,
      isExterior: false,
      isTires: false,
    });
    setModalDetails(modalDetailsInitialState);
    setModalVisible(false);
    setIsLoading(false);
    dispatch({type: Types.CLEAR_NEW_INSPECTION});
    setIsDiscardInspectionModalVisible(false);
    setDeleteItem({category: null, key: null});
    setModalMessageDetails(modalMessageDetailsInitialState);
    setIsDiscardInspectionModalVisible(false);
    setIsAllVehicleParts(IS_ALL_VEHICLE_PARTS_INITIAL_STATE);
    setInUseErrorTitle('');
  }

  function handleIsAllVehicleParts() {
    const {
      exteriorFront,
      exteriorRear,
      exteriorFrontLeftCorner,
      exteriorFrontRightCorner,
      exteriorRearLeftCorner,
      exteriorRearRightCorner,
      exteriorInsideCargoRoof,
    } = exteriorItems;
    const exteriorImages = {
      exteriorFront,
      exteriorRear,
      exteriorFrontLeftCorner,
      exteriorFrontRightCorner,
      exteriorRearLeftCorner,
      exteriorRearRightCorner,
      exteriorInsideCargoRoof,
    };
    const allCarVerification = !isObjectEmpty(carVerificationItems);
    const allExterior = !isObjectEmpty(exteriorImages);
    const allTires = !isObjectEmpty(tires);
    const allParts = allCarVerification && allExterior && allTires;
    setIsAllVehicleParts({
      isAllCarVerification: allCarVerification,
      isAllExterior: allExterior,
      isAllTires: allTires,
      isAllParts: allParts,
    });
  }

  const handleBackPress = () => {
    resetAllStates();
    navigation.goBack();
    // navigation.navigate(previousRoute);
  };
  //Collapsed Cards Functions starts here
  const handleCarVerificationSelection = () => {
    setSelectedOption(prevState => ({
      ...prevState,
      isCarVerification: !selectedOption.isCarVerification,
    }));
  };
  const handleExteriorSelection = () => {
    setSelectedOption(prevState => ({
      ...prevState,
      isExterior: !selectedOption.isExterior,
    }));
  };
  const handleTiresSelection = () => {
    setSelectedOption(prevState => ({
      ...prevState,
      isTires: !selectedOption.isTires,
    }));
  };
  //Collapsed Cards Functions ends here
  const handleItemPickerPress = details => {
    setModalDetails(details);
    setModalVisible(true);
  };
  const handleModalVisible = () => setModalVisible(!modalVisible);
  const handleCarVerificationCrossPress = async key => {
    let imageID =
      key === 'licensePlate'
        ? carVerificationItems.licensePlateID
        : carVerificationItems.odometerID;
    axios
      .delete(`${DEV_URL}/api/v1/files/${imageID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setModalMessageDetails(deleteSuccess);
        dispatch(RemoveCarVerificationItemURI(key));
      });
  };
  const handleExteriorCrossPress = async key => {
    let imageID = EXTRACT_INSPECTION_ITEM_ID(key);
    await axios
      .delete(`${DEV_URL}/api/v1/files/${imageID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setModalMessageDetails(deleteSuccess);
        dispatch(RemoveExteriorItemURI(key));
      });
  };
  // Media Modal logic starts here
  const handleTiresCrossPress = async key => {
    let imageID =
      key === 'leftFrontTire'
        ? tires?.leftFrontTireID
        : key === 'leftRearTire'
        ? tires?.leftRearTireID
        : key === 'rightFrontTire'
        ? tires.rightFrontTireID
        : tires.rightRearTireID;
    await axios
      .delete(`${DEV_URL}/api/v1/files/${imageID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setModalMessageDetails(deleteSuccess);
        dispatch(RemoveTiresItemURI(key));
      });
  };
  const handleMediaModalDetailsPress = (title, mediaURL, isVideo = false) => {
    setMediaModalDetails({
      title: title,
      source: mediaURL,
      isVideo: isVideo,
    });
    setMediaModalVisible(true);
  };
  const handleMediaModalDetailsCrossPress = () => {
    setMediaModalVisible(false);
    setMediaModalDetails({});
  };

  // Media Modal logic ends here
  const handleCaptureNowPress = (isVideo, key) => {
    setModalVisible(false);
    setModalDetails(modalDetailsInitialState);
    if (isVideo) {
      navigation.navigate(ROUTES.VIDEO, {
        type: key,
        modalDetails: modalDetails,
        inspectionId: selectedInspectionID,
      });
    } else {
      navigation.navigate(ROUTES.CAMERA, {
        type: key,
        modalDetails: modalDetails,
        inspectionId: selectedInspectionID,
      });
    }
  };
  const handleSubmitPress = () => {
    setIsLoading(true);
    axios
      .patch(`${DEV_URL}/api/v1/inspection/${selectedInspectionID}`, null, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        axios
          .put(
            `${DEV_URL}/api/v1/inspection/location`,
            {
              isLocation: true,
              inspectionId: selectedInspectionID,
            },
            {},
          )
          .then(res => {
            setIsLoading(false);
            dispatch({type: Types.CLEAR_NEW_INSPECTION});
            navigation.navigate(ROUTES.COMPLETED_INSPECTION);
          })
          .catch(error => {
            setIsLoading(false);
            console.log('Completed location error :', error);
          });
      })
      .catch(error => {
        setIsLoading(false);
        console.log('Completed Inspection error :', error);
      });
  };

  const handleOnCrossPress = (category, key) => {
    setIsDiscardInspectionModalVisible(true);
    setDeleteItem({category: category, key: key});
  };
  const handleYesPress = () => {
    const handleRemoveImage = {
      carVerificationItems: RemoveCarVerificationItemURI,
      exteriorItems: RemoveExteriorItemURI,
      tires: RemoveTiresItemURI,
    };
    const RemoveMethod = handleRemoveImage[deleteItem?.category];
    setIsDiscardInspectionModalVisible(false);
    const imageID = EXTRACT_INSPECTION_ITEM_ID(deleteItem?.key);
    axios
      .delete(`${DEV_URL}/api/v1/files/${imageID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setModalMessageDetails(deleteSuccess);
        dispatch(RemoveMethod(deleteItem?.key));
      })
      .catch(e => console.log('error deleting image => ', e));
  };
  const handleNoPress = () => {
    setIsDiscardInspectionModalVisible(false);
    setDeleteItem({category: null, key: null});
  };
  const handleOkPress = () =>
    setModalMessageDetails(modalMessageDetailsInitialState);
  const handleConfirmModalVisible = () =>
    setIsLicenseModalVisible(prevState => !prevState);
  const handleConfirmVehicleDetail = numberPlate => {
    const body = {
      licensePlateNumber: numberPlate,
      companyId: company_ID,
      inspectionId: selectedInspectionID,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    setIsLoading(true);
    axios
      .post(EXTRACT_NUMBER_PLATE, body, {headers: headers})
      .then(res => {
        // checkVehicleStatusToRender(selectedInspectionID);
      })
      .catch(e => {
        const statusCode = e?.response?.data?.statusCode;
        if (statusCode === 409) {
          setInspectionID(e?.response?.data?.inspectionId);
          setIsInspectionInProgressModalVisible(true);
          setErrorTitle(e?.response?.data?.errorMessage);
        } else if (e?.response?.data?.statusCode === 400) {
          setInUseErrorTitle(e?.response?.data?.message);
        }
      })
      .finally(() => {
        handleConfirmModalVisible();
        setIsLoading(false);
      });
  };

  const handleYesPressOfInProgressInspection = () => {
    setIsInspectionInProgressModalVisible(false);
    setIsLoading(true);
    setErrorTitle('');
    axios
      .get(`${DEV_URL}/api/v1/files/details/${inspectionID}`)
      .then(res => {
        uploadInProgressMediaToStore(res?.data?.files, dispatch);
        setIsLoading(false);
        dispatch(NumberPlateSelectedAction(inspectionID));
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error of selected inspection in progress => ', error);
        // if (error.message === 'Request failed with status code 500') {
        //   setNumberPlateInUseError(true);
        // }
      });
  };
  return (
    <NewInspectionScreen
      selectedOption={selectedOption}
      handleCarVerificationSelection={handleCarVerificationSelection}
      handleExteriorSelection={handleExteriorSelection}
      handleTiresSelection={handleTiresSelection}
      modalVisible={modalVisible}
      handleModalVisible={handleModalVisible}
      source={modalDetails?.source}
      instructionalText={modalDetails?.instructionalText}
      buttonText={modalDetails?.buttonText}
      title={modalDetails?.title}
      isVideo={modalDetails?.isVideo}
      modalKey={modalDetails?.key}
      isExterior={modalDetails?.groupType === INSPECTION.EXTERIOR}
      isCarVerification={
        modalDetails?.groupType === INSPECTION.CAR_VERIFICATION
      }
      instructionalSubHeadingText={modalDetails?.instructionalSubHeadingText}
      handleItemPickerPress={handleItemPickerPress}
      handleCaptureNowPress={handleCaptureNowPress}
      carVerificationItems={carVerificationItems}
      exteriorItems={exteriorItems}
      tires={tires}
      isBothCarVerificationImagesAvailable={
        isAllVehicleParts.isAllCarVerification
      }
      isAllExteriorImagesAvailable={isAllVehicleParts.isAllExterior}
      isBothTiresImagesAvailable={isAllVehicleParts.isAllTires}
      isVehicleAllPartsImagesAvailable={isAllVehicleParts.isAllParts}
      handleSubmitPress={handleSubmitPress}
      isLoading={isLoading}
      submitText={submitText}
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      handleMediaModalDetailsCrossPress={handleMediaModalDetailsCrossPress}
      mediaModalDetails={mediaModalDetails}
      mediaModalVisible={mediaModalVisible}
      onYesPress={handleYesPress}
      onNoPress={handleNoPress}
      isDiscardInspectionModalVisible={isDiscardInspectionModalVisible}
      handleOnCrossPress={handleOnCrossPress}
      handleBackPress={handleBackPress}
      modalMessageDetails={modalMessageDetails}
      handleOkPress={handleOkPress}
      isLicenseModalVisible={isLicenseModalVisible}
      handleConfirmModalVisible={handleConfirmModalVisible}
      handleConfirmVehicleDetail={handleConfirmVehicleDetail}
      plateNumber={plateNumber}
      errorTitle={errorTitle}
      handleYesPressOfInProgressInspection={
        handleYesPressOfInProgressInspection
      }
      isInspectionInProgressModalVisible={isInspectionInProgressModalVisible}
      inUseErrorTitle={inUseErrorTitle}
      // skipLeft={skipLeft}
      // skipLeftCorners={skipLeftCorners}
      // skipRight={skipRight}
      // skipRightCorners={skipRightCorners}
    />
  );
};

export default NewInspectionContainer;
