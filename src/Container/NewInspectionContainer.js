import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {NewInspectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {
  removeCarVerificationItemURI,
  removeExteriorItemURI,
  removeTiresItemURI,
} from '../Store/Actions';
import {Types} from '../Store/Types';

const NewInspectionContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {carVerificationItems, exteriorItems, tires} = useSelector(
    state => state.newInspection,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    isCarVerification: true,
    isExterior: false,
    isTires: false,
  });
  const modalDetailsInitialState = {
    key: 'licensePlate',
    title: 'License Plate',
    source: require('../Assets/Images/license_number.jpg'),
    instructionalText:
      'Please take a photo of the License plate on the vehicle',
    instructionalSubHeadingText: '',
    buttonText: 'Capture Now',
    category: 'CarVerification',
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

  useEffect(() => {
    return () => {
      setModalDetails(modalDetailsInitialState);
      setModalVisible(false);
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
    console.log('Cross Pressed');
    dispatch(removeCarVerificationItemURI(key));
  };
  const handleExteriorCrossPress = key => {
    console.log('Cross Pressed');
    dispatch(removeExteriorItemURI(key));
  };
  const handleTiresCrossPress = key => {
    console.log('Cross Pressed');
    dispatch(removeTiresItemURI(key));
  };
  const handleCaptureNowPress = (isVideo, key) => {
    setModalVisible(false);
    setModalDetails(modalDetailsInitialState);
    if (isVideo) {
      navigation.navigate(ROUTES.VIDEO, {type: key});
    } else {
      navigation.navigate(ROUTES.CAMERA, {
        title: modalDetails.category,
        type: key,
      });
    }
  };
  const handleSubmitPress = () => dispatch({type: Types.CLEAR_NEW_INSPECTION});

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
    />
  );
};

export default NewInspectionContainer;
