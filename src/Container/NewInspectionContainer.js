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
  CREATE_INSPECTION_URL,
  DEV_URL,
  EXTRACT_NUMBER_PLATE,
  HARDWARE_BACK_PRESS,
} from '../Constants';
import {uploadInProgressMediaToStore} from '../Utils';

const NewInspectionContainer = ({route, navigation}) => {
  const dispatch = useDispatch();
  let {
    carVerificationItems,
    exteriorItems,
    tires,
    selectedInspectionID,
    isVehicleDetailVisible,
    company_ID,
    plateNumber,
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
  const [previousRoute, setPreviousRoute] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [inspectionID, setInspectionID] = useState(null);
  const modalDetailsInitialState = {
    key: 'licensePlate',
    title: 'License Plate',
    source: require('../Assets/Images/license_number.jpg'),
    instructionalText:
      'Please take a photo of the License plate on the vehicle',
    instructionalSubHeadingText: '',
    buttonText: 'Capture Now',
    category: 'CarVerification',
    subCategory: 'license_plate',
    isVideo: false,
  };
  const [modalDetails, setModalDetails] = useState(modalDetailsInitialState);
  const [modalMessageDetails, setModalMessageDetails] = useState(
    modalMessageDetailsInitialState,
  );
  let isBothCarVerificationImagesAvailable =
    carVerificationItems.licensePlate !== '' &&
    carVerificationItems.odometer !== '';
  let isAllExteriorImagesAvailable =
    exteriorItems.exteriorLeft !== '' &&
    exteriorItems.exteriorRight !== '' &&
    exteriorItems.exteriorFront !== '' &&
    exteriorItems.exteriorRear !== '';
  let isBothTiresImagesAvailable =
    tires.leftFrontTire !== '' &&
    tires.leftRearTire !== '' &&
    tires.rightFrontTire !== '' &&
    tires.rightRearTire !== '';
  let isVehicleAllPartsImagesAvailable =
    isBothCarVerificationImagesAvailable &&
    isAllExteriorImagesAvailable &&
    isBothTiresImagesAvailable;
  const submitText = isLoading ? (
    <ActivityIndicator size={'small'} color={colors.white} />
  ) : (
    'Submit'
  );

  useEffect(() => {
    if (route.params) {
      const {routeName} = route.params;
      setPreviousRoute(routeName);
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
    let imageID =
      key === 'exteriorLeft'
        ? exteriorItems?.exteriorLeftID
        : key === 'exteriorRight'
        ? exteriorItems?.exteriorRightID
        : key === 'exteriorFront'
        ? exteriorItems.exteriorFrontID
        : exteriorItems?.exteriorRearID;
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
  const handleMediaModalDetailsPress = (title, mediaURL, isVideo) => {
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
    setIsDiscardInspectionModalVisible(false);
    if (deleteItem.category === 'carVerificationItems') {
      handleCarVerificationCrossPress(deleteItem.key).then();
    } else if (deleteItem.category === 'exteriorItems') {
      handleExteriorCrossPress(deleteItem.key).then();
    } else if (deleteItem.category === 'tires') {
      handleTiresCrossPress(deleteItem.key).then();
    } else {
      return true;
    }
  };
  const handleNoPress = () => {
    setIsDiscardInspectionModalVisible(false);
    setDeleteItem({category: null, key: null});
  };
  const handleOkPress = () =>
    setModalMessageDetails(modalMessageDetailsInitialState);
  const handleConfirmModalVisible = () =>
    dispatch({type: Types.IS_VEHICLE_DETAIL_VISIBLE, payload: false});
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
      })
      .catch(e => {
        const statusCode = e?.response?.data?.statusCode;
        if (statusCode === 409) {
          setInspectionID(e?.response?.data?.inspectionId);
          setIsInspectionInProgressModalVisible(true);
          setErrorTitle(e?.response?.data?.errorMessage);
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
      source={modalDetails.source}
      instructionalText={modalDetails.instructionalText}
      buttonText={modalDetails.buttonText}
      title={modalDetails.title}
      isVideo={modalDetails.isVideo}
      modalKey={modalDetails.key}
      instructionalSubHeadingText={modalDetails.instructionalSubHeadingText}
      handleItemPickerPress={handleItemPickerPress}
      handleCaptureNowPress={handleCaptureNowPress}
      carVerificationItems={carVerificationItems}
      exteriorItems={exteriorItems}
      tires={tires}
      handleCarVerificationCrossPress={handleCarVerificationCrossPress}
      handleExteriorCrossPress={handleExteriorCrossPress}
      handleTiresCrossPress={handleTiresCrossPress}
      isBothCarVerificationImagesAvailable={
        isBothCarVerificationImagesAvailable
      }
      isAllExteriorImagesAvailable={isAllExteriorImagesAvailable}
      isBothTiresImagesAvailable={isBothTiresImagesAvailable}
      isVehicleAllPartsImagesAvailable={isVehicleAllPartsImagesAvailable}
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
      isVehicleDetailVisible={isVehicleDetailVisible}
      handleConfirmModalVisible={handleConfirmModalVisible}
      handleConfirmVehicleDetail={handleConfirmVehicleDetail}
      plateNumber={plateNumber}
      errorTitle={errorTitle}
      handleYesPressOfInProgressInspection={
        handleYesPressOfInProgressInspection
      }
      isInspectionInProgressModalVisible={isInspectionInProgressModalVisible}
    />
  );
};

export default NewInspectionContainer;
