import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {LicensePlateNumberSelectionScreen} from '../Screens';
import {HARDWARE_BACK_PRESS, API_ENDPOINTS, generateApiUrl} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {colors} from '../Assets/Styles';
import {numberPlateSelected, setCompanyId, setVehicleTypeModalVisible} from '../Store/Actions';
import {handle_Session_Expired, uploadInProgressMediaToStore} from '../Utils';

const {CREATE_INSPECTION_URL, FETCH_NUMBER_PLATE_URL} = API_ENDPOINTS;
const {NEW_INSPECTION, LICENSE_PLATE_SELECTION} = ROUTES;
const {white} = colors;

const LicensePlateNumberSelectionContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {canGoBack, goBack, navigate} = navigation;
  const {
    user: {token, data},
  } = useSelector(state => state?.auth);
  const [selectedNP, setSelectedNP] = useState(null);
  const [search, setSearch] = useState('');
  const [numberPlate, setNumberPlate] = useState([]);
  const [numberPlateInUseError, setNumberPlateInUseError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscardInspectionModalVisible, setIsDiscardInspectionModalVisible] =
    useState(false);
  const [inspectionID, setInspectionID] = useState(null);
  const [errorTitle, setErrorTitle] = useState('');
  const filterNP = numberPlate.filter(NP =>
    NP.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedText = isLoading ? (
    <ActivityIndicator size={'small'} color={white} />
  ) : (
    'Select'
  );

  useFocusEffect(
    useCallback(() => {
      fetchNP();

      return () => resetAllStates();
    }, []),
  );
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      goBack();
      return true;
    }
    return false;
  }
  function resetAllStates() {
    setNumberPlate([]);
    setSearch('');
    setSelectedNP(null);
    setIsLoading(false);
    setErrorTitle('');
    setInspectionID(null);
  }
  function fetchNP() {
    axios
      .post(FETCH_NUMBER_PLATE_URL, {
        companyId: data?.companyId,
      })
      .then(response => {
        setNumberPlate(response.data);
      })
      .catch(err => console.log('error: ', err?.response?.data?.errors));
  }
  const handleSearchInput = text => setSearch(text);
  const handleSelectedNP = item => {
    setSelectedNP(item);
  };
  const handleSubmit = () => {
    setIsLoading(true);
    const body = {
      licensePlateNumber: selectedNP,
      companyId: data?.companyId,
    };
    dispatch(setCompanyId(data?.companyId));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(CREATE_INSPECTION_URL, body, {headers: headers})
      .then(response => {
        setIsLoading(false);
        setInspectionID(response.data.id);
        dispatch(numberPlateSelected(response.data.id));
        resetAllStates();
        dispatch(setVehicleTypeModalVisible(true));
        navigate(NEW_INSPECTION, {
          routeName: LICENSE_PLATE_SELECTION,
        });
      })
      .catch(err => {
        setInspectionID(err?.response?.data?.inspectionId);
        const inProgressLicensePlateErrorMessage = `Inspection for license plate #${selectedNP} is already in progress. Would you like to visit in progress inspections page?`;
        // const errorMessage =
        //   err?.response?.data?.errorMessage ?? err?.response?.data?.message[0];
        setErrorTitle(inProgressLicensePlateErrorMessage);
        setIsLoading(false);
        setIsDiscardInspectionModalVisible(true);
        // Alert.alert('', errorMessage);
      });
  };
  const handleYesPressOfInProgressInspection = () => {
    setIsDiscardInspectionModalVisible(false);
    setIsLoading(true);
    setErrorTitle('');
    const endPoint = generateApiUrl(`files/details/${inspectionID}`);

    axios
      .get(endPoint)
      .then(res => {
        uploadInProgressMediaToStore(res?.data?.files, dispatch);
        setIsLoading(false);
        dispatch(numberPlateSelected(inspectionID));
        dispatch(setVehicleTypeModalVisible(true));
        navigate(NEW_INSPECTION, {
          routeName: LICENSE_PLATE_SELECTION,
        });
      })
      .catch(error => {
        setIsLoading(false);
        const statusCode = error?.response?.data?.statusCode;
        if (statusCode === 401) {
          handle_Session_Expired(statusCode, dispatch);
        }
        console.log('error of selected inspection in progress => ', error);
        if (error.message === 'Request failed with status code 500') {
          setNumberPlateInUseError(true);
        }
      });
  };
  const handleOkPress = () => setNumberPlateInUseError(false);
  const onNoPress = () => {
    setIsDiscardInspectionModalVisible(false);
    setErrorTitle('');
  };

  return (
    <LicensePlateNumberSelectionScreen
      handleSelectedNP={handleSelectedNP}
      selectedNP={selectedNP}
      data={filterNP}
      search={search}
      handleSearchInput={handleSearchInput}
      handleSubmit={handleSubmit}
      selectText={selectedText}
      isLoading={isLoading}
      errorTitle={errorTitle}
      isDiscardInspectionModalVisible={isDiscardInspectionModalVisible}
      onYesPress={handleYesPressOfInProgressInspection}
      onNoPress={onNoPress}
      handleOkPress={handleOkPress}
      numberPlateInUseError={numberPlateInUseError}
    />
  );
};

export default LicensePlateNumberSelectionContainer;
