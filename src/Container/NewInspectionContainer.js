import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';

import {NewInspectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {
  RemoveCarVerificationItemURI,
  RemoveExteriorItemURI,
  RemoveTiresItemURI,
} from '../Store/Actions';
import {Types} from '../Store/Types';
import {colors} from '../Assets/Styles';
import {DEV_URL} from '../Constants';

const NewInspectionContainer = ({route, navigation}) => {
  const dispatch = useDispatch();
  let {carVerificationItems, exteriorItems, tires, selectedInspectionID} =
    useSelector(state => state.newInspection);
  const {token} = useSelector(state => state?.auth);
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
  const [previousRoute, setPreviousRoute] = useState('');
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
    if (route) {
      const {routeName} = route.params;
      setPreviousRoute(routeName);
    }
  }, [route]);
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
  }

  const handleBackPress = () => {
    resetAllStates();
    navigation.navigate(previousRoute);
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
    console.log('token => ', token);
    console.log('selectedInspectionID => ', selectedInspectionID);
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
            console.log('location res => ', res);
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
    />
  );
};

export default NewInspectionContainer;
