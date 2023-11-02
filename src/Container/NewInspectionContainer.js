import React, {useEffect, useState} from 'react';
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
import {baseURL} from '../Constants';
import {ActivityIndicator} from 'react-native';
import {colors} from '../Assets/Styles';

const NewInspectionContainer = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {carVerificationItems, exteriorItems, tires} = useSelector(
    state => state.newInspection,
  );
  const {token} = useSelector(state => state?.auth);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    isCarVerification: true,
    isExterior: false,
    isTires: false,
  });
  const [inspectionID, setInspectionID] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
    if (route.params) {
      const {inspectionId} = route.params;
      setInspectionID(inspectionId);
    }
    return () => {
      setModalDetails(modalDetailsInitialState);
      setModalVisible(false);
      setIsLoading(false);
      dispatch({type: Types.CLEAR_NEW_INSPECTION});
    };
  }, []);

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
  const handleCarVerificationCrossPress = key => {
    dispatch(RemoveCarVerificationItemURI(key));
  };
  const handleExteriorCrossPress = key => {
    dispatch(RemoveExteriorItemURI(key));
  };
  const handleTiresCrossPress = key => {
    dispatch(RemoveTiresItemURI(key));
  };
  const handleCaptureNowPress = (isVideo, key) => {
    setModalVisible(false);
    setModalDetails(modalDetailsInitialState);
    if (isVideo) {
      navigation.navigate(ROUTES.VIDEO, {
        type: key,
        modalDetails: modalDetails,
        inspectionId: inspectionID,
      });
    } else {
      navigation.navigate(ROUTES.CAMERA, {
        type: key,
        modalDetails: modalDetails,
        inspectionId: inspectionID,
      });
    }
  };
  const handleSubmitPress = () => {
    setIsLoading(true);
    axios
      .patch(`${baseURL}/api/v1/inspection/${inspectionID}`, null, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setIsLoading(false);
        dispatch({type: Types.CLEAR_NEW_INSPECTION});
        navigation.navigate(ROUTES.COMPLETED_INSPECTION);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('Completed Inspection error :', error);
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
    />
  );
};

export default NewInspectionContainer;
