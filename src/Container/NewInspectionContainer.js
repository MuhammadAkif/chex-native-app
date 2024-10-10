import React, {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

import {NewInspectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {
  NumberPlateSelectedAction,
  RemoveCarVerificationItemURI,
  RemoveExteriorItemURI,
  RemoveTiresItemURI,
  Update_Is_License_Plate_Uploaded,
  Category_Variant,
  File_Details,
  showToast,
} from '../Store/Actions';
import {Types} from '../Store/Types';
import {
  API_ENDPOINTS,
  Delete_Messages,
  generateApiUrl,
  HARDWARE_BACK_PRESS,
  INSPECTION,
} from '../Constants';
import {
  exteriorVariant,
  EXTRACT_INSPECTION_ITEM_ID,
  extractCoordinates,
  extractIDs,
  get_Inspection_Details,
  handle_Session_Expired,
  haveOneValue,
  isNotEmpty,
  isObjectEmpty,
  LicensePlateDetails,
  uploadInProgressMediaToStore,
} from '../Utils';
import {
  ExteriorItemsExpandedCard,
  ExteriorItemsExpandedCard_Old,
} from '../Components';

const {
  EXTRACT_NUMBER_PLATE_URL,
  INSPECTION_TIRE_STATUS_URL,
  REMOVE_ALL_TIRES_URL,
  ANNOTATION_URL,
  LOCATION_URL,
} = API_ENDPOINTS;

const IS_ALL_VEHICLE_PARTS_INITIAL_STATE = {
  isAllCarVerification: false,
  isAllExterior: false,
  isAllTires: false,
  isAllParts: false,
};

const {
  INSPECTION_SELECTION,
  INSPECTION_IN_PROGRESS,
  VIDEO,
  CAMERA,
  COMPLETED_INSPECTION,
} = ROUTES;
const {
  SKIP_LEFT,
  SKIP_LEFT_CORNERS,
  SKIP_RIGHT,
  SKIP_RIGHT_CORNERS,
  CLEAR_NEW_INSPECTION,
  CLEAR_TIRES,
  VEHICLE_TYPE,
} = Types;

const annotationModalInitialState = {
  title: '',
  type: '',
  uri: '',
  fileId: '',
  source: '',
};

const exteriorItemsExpandedCards = {
  existing: ExteriorItemsExpandedCard_Old,
  new: ExteriorItemsExpandedCard,
};

const NewInspectionContainer = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {canGoBack, goBack, navigate} = navigation;
  let {
    carVerificationItems,
    exteriorItems,
    tires,
    selectedInspectionID,
    plateNumber,
    /* skipLeft,
    skipLeftCorners,
    skipRight,
    skipRightCorners,*/
    isLicensePlateUploaded,
    vehicle_Type,
    variant,
    fileDetails,
  } = useSelector(state => state.newInspection);
  const {
    user: {token, data},
  } = useSelector(state => state?.auth);
  const [modalVisible, setModalVisible] = useState(false);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [mediaModalDetails, setMediaModalDetails] = useState({});
  const [selectedOption, setSelectedOption] = useState({
    isCarVerification: true,
    isExterior: false,
    isTires: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
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
  const [annotationModalDetails, setAnnotationModalDetails] = useState(
    annotationModalInitialState,
  );
  const [displayTires, setDisplayTires] = useState(true);
  const [displayAnnotationPopUp, setDisplayAnnotationPopUp] = useState(false);
  const [displayAnnotation, setDisplayAnnotation] = useState(false);
  const [checkTireStatus, setCheckTireStatus] = useState(true);
  const [isAllVehicleParts, setIsAllVehicleParts] = useState(
    IS_ALL_VEHICLE_PARTS_INITIAL_STATE,
  );
  const [fileID, setFileID] = useState('');
  const [isExterior, setIsExterior] = useState(false);
  const ActiveExteriorItemsExpandedCard =
    exteriorItemsExpandedCards[vehicle_Type];
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    if (route.params?.routeName === INSPECTION_IN_PROGRESS && checkTireStatus) {
      vehicleTireStatusToRender(selectedInspectionID).then(() =>
        setCheckTireStatus(false),
      );
    }
    if (route.params) {
      const {
        isLicensePlate,
        displayAnnotation,
        fileId,
        annotationDetails,
        is_Exterior,
        routeName,
      } = route.params;
      if (routeName !== INSPECTION_SELECTION) {
        setTimeout(() => {
          setIsLicenseModalVisible(isLicensePlate || false);
          setDisplayAnnotationPopUp(displayAnnotation || false);
        }, 1000);
        setFileID(fileId || '');
        setAnnotationModalDetails(prevState => ({
          ...prevState,
          uri: annotationDetails?.uri || '',
        }));
        setIsExterior(is_Exterior || false);
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
    handleExteriorLeft();
    handleExteriorRight();
  }, [exteriorItems]);
  useEffect(() => {
    handleIsAllVehicleParts();
  }, [carVerificationItems, exteriorItems, tires, displayTires]);
  useEffect(() => {
    const isTiresUploaded = haveOneValue(tires);
    if (!displayTires && isTiresUploaded) {
      handleRemovedAllTires().then();
    } else if (!displayTires) {
      setLoadingIndicator(false);
    } else {
      setLoadingIndicator(false);
    }
  }, [displayTires]);
  useEffect(() => {
    if (!isNotEmpty(selectedInspectionID)) {
      resetAllStates();
    }
  }, [selectedInspectionID]);
  useEffect(() => {
    const licenseBoolean = isNotEmpty(carVerificationItems.licensePlate);
    dispatch(Update_Is_License_Plate_Uploaded(licenseBoolean));
  }, [carVerificationItems.licensePlate]);
  const shouldAnnotate = vehicle_Type === 'new' && isExterior;
  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      goBack();
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
    dispatch({type: CLEAR_NEW_INSPECTION});
    setIsDiscardInspectionModalVisible(false);
    setDeleteItem({category: null, key: null});
    setIsDiscardInspectionModalVisible(false);
    setIsAllVehicleParts(IS_ALL_VEHICLE_PARTS_INITIAL_STATE);
    setInUseErrorTitle('');
    setLoadingIndicator(false);
    setDisplayTires(true);
    setCheckTireStatus(true);
    setFileID('');
    setDisplayAnnotationPopUp(false);
    setDisplayAnnotation(false);
    setIsExterior(false);
  }
  function handleExteriorLeft() {
    if (isNotEmpty(exteriorItems?.exteriorLeft)) {
      dispatch({type: SKIP_LEFT_CORNERS, payload: true});
    } else if (
      isNotEmpty(exteriorItems?.exteriorFrontLeftCorner) ||
      isNotEmpty(exteriorItems?.exteriorRearLeftCorner)
    ) {
      dispatch({type: SKIP_LEFT, payload: true});
    } else {
      dispatch({type: SKIP_LEFT, payload: false});
      dispatch({type: SKIP_LEFT_CORNERS, payload: false});
    }
  }
  function handleExteriorRight() {
    if (isNotEmpty(exteriorItems?.exteriorRight)) {
      dispatch({type: SKIP_RIGHT_CORNERS, payload: true});
    } else if (
      isNotEmpty(exteriorItems?.exteriorFrontRightCorner) ||
      isNotEmpty(exteriorItems?.exteriorRearRightCorner)
    ) {
      dispatch({type: SKIP_RIGHT, payload: true});
    } else {
      dispatch({type: SKIP_RIGHT, payload: false});
      dispatch({type: SKIP_RIGHT_CORNERS, payload: false});
    }
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
    const skipOnlyTires = allCarVerification && allExterior;
    const shouldDisplayTire = {
      true: {
        isAllTires: allTires,
        isAllParts: allParts,
      },
      false: {
        isAllTires: false,
        isAllParts: skipOnlyTires,
      },
    };
    setIsAllVehicleParts({
      isAllCarVerification: allCarVerification,
      isAllExterior: allExterior,
      ...shouldDisplayTire[displayTires],
    });
  }

  const handleBackPress = () => {
    resetAllStates();
    goBack();
    // navigate(previousRoute);
  };
  //Collapsed Cards Functions starts here
  const handleCardExpansion = key => {
    setSelectedOption(prevState => ({
      ...prevState,
      [key]: !selectedOption[key],
    }));
  };
  //Collapsed Cards Functions ends here
  const handleItemPickerPress = (details, variant = 0) => {
    dispatch(Category_Variant(variant));
    setModalDetails(details);
    setModalVisible(true);
  };
  const handleModalVisible = () => setModalVisible(!modalVisible);
  // Media Modal logic starts here
  const handleMediaModalDetailsPress = (
    title,
    mediaURL,
    isVideo = false,
    image_ID = '',
  ) => {
    const coordinates = extractCoordinates(fileDetails, image_ID);
    setMediaModalDetails({
      title: title,
      source: mediaURL,
      isVideo: isVideo,
      coordinates: coordinates,
    });
    setMediaModalVisible(true);
  };
  const handleMediaModalDetailsCrossPress = () => {
    setMediaModalVisible(false);
    setMediaModalDetails({});
  };
  // Media Modal logic ends here
  const handleCaptureNowPress = (isVideo, key) => {
    const paths = {
      true: VIDEO,
      false: CAMERA,
    };
    const path = paths[isVideo];
    const details = {
      title: modalDetails.title,
      type: key,
      uri: '',
      source: modalDetails.source,
      fileId: '',
    };
    setAnnotationModalDetails(details);
    setModalVisible(false);
    setModalDetails(modalDetailsInitialState);
    navigate(path, {
      type: key,
      modalDetails: modalDetails,
      inspectionId: selectedInspectionID,
    });
  };
  const handleSubmitPress = () => {
    setIsLoading(true);
    const endPoint = generateApiUrl(`inspection/${selectedInspectionID}`);

    axios
      .patch(endPoint, null, config)
      .then(() => {
        axios
          .put(
            LOCATION_URL,
            {
              isLocation: true,
              inspectionId: selectedInspectionID,
            },
            {},
          )
          .then(() => {
            setIsLoading(false);
            dispatch({type: CLEAR_NEW_INSPECTION});
            resetAllStates();
            navigate(COMPLETED_INSPECTION);
          })
          .catch(error => {
            setIsLoading(false);
            const statusCode = error?.response?.data?.statusCode;
            if (statusCode === 401) {
              handle_Session_Expired(statusCode, dispatch);
            }
          });
      })
      .catch(error => {
        setIsLoading(false);
        console.log('Completed Inspection error :', error);
        const statusCode = error?.response?.data?.statusCode;
        if (statusCode === 401) {
          handle_Session_Expired(statusCode, dispatch);
        }
      });
  };

  const handleOnCrossPress = (category, key, variant = 0) => {
    dispatch(Category_Variant(variant));
    setIsDiscardInspectionModalVisible(true);
    setDeleteItem({category: category, key: key});
  };
  const handleYesPress = () => {
    let key_ = deleteItem?.key;
    if (deleteItem?.category === INSPECTION.EXTERIOR) {
      key_ = exteriorVariant(key_, variant);
    }
    const handleRemoveImage = {
      carVerificationItems: RemoveCarVerificationItemURI,
      exteriorItems: RemoveExteriorItemURI,
      tires: RemoveTiresItemURI,
    };
    const RemoveMethod = handleRemoveImage[deleteItem?.category];
    setIsDiscardInspectionModalVisible(false);
    const imageID = EXTRACT_INSPECTION_ITEM_ID(key_);
    const endPoint = generateApiUrl(`files/${imageID}`);

    axios
      .delete(endPoint, config)
      .then(() => {
        dispatch(showToast(Delete_Messages.success, 'success'));
        dispatch(RemoveMethod(key_));
      })
      .catch(e => {
        const {success, failed} = Delete_Messages;
        const message = {
          types: {
            true: 'success',
            error: 'error',
          },
          messages: {
            true: success,
            false: failed,
          },
        };
        console.log('error deleting image => ', e);
        const statusCode = e?.response?.data?.statusCode;
        const alreadyRemoved = statusCode === 404;
        const activeMessage =
          message.messages[alreadyRemoved] ||
          'This image has already been deleted.';
        const activeType = message.types[alreadyRemoved] || 'error';
        if (statusCode === 401) {
          handle_Session_Expired(statusCode, dispatch);
        }

        if (alreadyRemoved) {
          dispatch(RemoveMethod(key_));
        }
        dispatch(showToast(activeMessage, activeType));
      });
  };
  const handleNoPress = () => {
    setIsDiscardInspectionModalVisible(false);
    setDeleteItem({category: null, key: null});
  };
  const handleConfirmModalVisible = () =>
    setIsLicenseModalVisible(prevState => !prevState);
  const handleConfirmVehicleDetail = numberPlate => {
    if (isNotEmpty(numberPlate.trim())) {
      const body = {
        licensePlateNumber: numberPlate,
        companyId: data?.companyId,
        inspectionId: selectedInspectionID,
      };
      setIsLoading(true);
      axios
        .post(EXTRACT_NUMBER_PLATE_URL, body, config)
        .then(res => {
          const vehicleType = res?.data?.hasAdded || 'existing';
          dispatch({type: VEHICLE_TYPE, payload: vehicleType});
          vehicleTireStatusToRender(selectedInspectionID).then(() =>
            setLoadingIndicator(false),
          );
        })
        .catch(e => {
          const statusCode = e?.response?.data?.statusCode;
          if (statusCode === 409) {
            const vehicleType = e?.response?.data?.hasAdded || 'existing';
            dispatch({type: VEHICLE_TYPE, payload: vehicleType});
            setInspectionID(e?.response?.data?.inspectionId);
            setIsInspectionInProgressModalVisible(true);
            setErrorTitle(e?.response?.data?.errorMessage);
          } else if (e?.response?.data?.statusCode === 400) {
            setInUseErrorTitle(e?.response?.data?.message);
          }
        })
        .finally(() => {
          setLoadingIndicator(false);
          handleConfirmModalVisible();
          setIsLoading(false);
        });
    }
  };

  const handleYesPressOfInProgressInspection = () => {
    setIsInspectionInProgressModalVisible(false);
    setLoadingIndicator(true);
    setErrorTitle('');
    const endPoint = generateApiUrl(`files/details/${inspectionID}`);

    axios
      .get(endPoint)
      .then(res => {
        const details = res?.data?.files;
        uploadInProgressMediaToStore(details, dispatch);
        vehicleTireStatusToRender(inspectionID).then();
        dispatch(NumberPlateSelectedAction(inspectionID));
        dispatch(File_Details(details, inspectionID));
      })
      .catch(error => {
        setLoadingIndicator(false);
        const statusCode = error?.response?.data?.statusCode;
        if (statusCode === 401) {
          handle_Session_Expired(statusCode, dispatch);
        }
        console.log('error of selected inspection in progress => ', error);
      });
  };
  //Tire Rendering logic start here
  async function vehicleTireStatusToRender(inspection_ID) {
    setLoadingIndicator(true);
    const body = {
      inspectionId: inspection_ID,
    };
    await axios
      .post(INSPECTION_TIRE_STATUS_URL, body, config)
      .then(res => {
        const {
          data: {displayTire},
        } = res;
        setDisplayTires(displayTire);
        setLoadingIndicator(!displayTire);
      })
      .catch(e => {
        console.log(
          'error while check tire status again inspection => ',
          e.message,
        );
      })
      .finally(() => setLoadingIndicator(false));
  }
  async function handleRemovedAllTires() {
    let removeTiresList = extractIDs(tires) || [];
    const body = {fileId: removeTiresList};
    await axios
      .post(REMOVE_ALL_TIRES_URL, body, config)
      .then(res => {
        dispatch({type: CLEAR_TIRES});
      })
      .catch(e => {})
      .finally(() => {
        setLoadingIndicator(false);
      });
  }
  //Tire Rendering logic ends here

  //Annotation logic starts here
  const handleSkipPress = () => {
    setDisplayAnnotationPopUp(!displayAnnotationPopUp);
  };
  const handleAnnotationPress = () => {
    setDisplayAnnotationPopUp(!displayAnnotationPopUp);
    setDisplayAnnotation(!displayAnnotation);
  };
  const handleAnnotationSubmit = async (details, callback) => {
    setIsLoading(true);
    const body = {
      coordinateArray: details,
      inspectionId: selectedInspectionID,
      fileId: fileID,
    };
    axios
      .post(ANNOTATION_URL, body, config)
      .then(res => {
        callback();
        get_Inspection_Details(dispatch, selectedInspectionID);
      })
      .catch(error => {
        console.log({error});
        const statusCode = error?.response?.data?.statusCode;
        if (statusCode === 401) {
          handle_Session_Expired(statusCode, dispatch);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setDisplayAnnotation(!displayAnnotation);
      });
  };
  const handleAnnotationCancel = () => {
    get_Inspection_Details(dispatch, selectedInspectionID).then();
    setDisplayAnnotation(!displayAnnotation);
  };
  //Annotation logic ends here
  return (
    <NewInspectionScreen
      selectedOption={selectedOption}
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
      handleMediaModalDetailsPress={handleMediaModalDetailsPress}
      handleMediaModalDetailsCrossPress={handleMediaModalDetailsCrossPress}
      mediaModalDetails={mediaModalDetails}
      mediaModalVisible={mediaModalVisible}
      onYesPress={handleYesPress}
      onNoPress={handleNoPress}
      isDiscardInspectionModalVisible={isDiscardInspectionModalVisible}
      handleOnCrossPress={handleOnCrossPress}
      handleBackPress={handleBackPress}
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
      handleCardExpansion={handleCardExpansion}
      // skipLeft={skipLeft}
      // skipLeftCorners={skipLeftCorners}
      // skipRight={skipRight}
      // skipRightCorners={skipRightCorners}
      displayTires={displayTires}
      loadingIndicator={loadingIndicator}
      displayAnnotationPopUp={displayAnnotationPopUp}
      handleSkipPress={handleSkipPress}
      handleAnnotatePress={handleAnnotationPress}
      displayAnnotation={displayAnnotation}
      handleAnnotationSubmit={handleAnnotationSubmit}
      handleAnnotationCancel={handleAnnotationCancel}
      annotationModalDetails={annotationModalDetails}
      isLicensePlateUploaded={isLicensePlateUploaded}
      ActiveExteriorItemsExpandedCard={ActiveExteriorItemsExpandedCard}
      vehicle_Type={shouldAnnotate}
    />
  );
};

export default NewInspectionContainer;
