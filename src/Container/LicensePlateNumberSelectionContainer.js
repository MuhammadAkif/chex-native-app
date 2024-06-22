import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {LicensePlateNumberSelectionScreen} from '../Screens';
import {
  CREATE_INSPECTION_URL,
  FETCH_NUMBER_PLATE_URL,
  DEV_URL,
  HARDWARE_BACK_PRESS,
} from '../Constants';
// import {DEV_URL} from '@env'
import {ROUTES} from '../Navigation/ROUTES';
import {colors} from '../Assets/Styles';
import {NumberPlateSelectedAction} from '../Store/Actions';
import {uploadInProgressMediaToStore} from '../Utils';
import {Types} from '../Store/Types';

const LicensePlateNumberSelectionContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token, data} = useSelector(state => state?.auth);
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
    <ActivityIndicator size={'small'} color={colors.white} />
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
    if (navigation.canGoBack()) {
      navigation.goBack();
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
    dispatch({type: Types.company_ID, payload: data?.companyId});
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(CREATE_INSPECTION_URL, body, {headers: headers})
      .then(response => {
        setIsLoading(false);
        setInspectionID(response.data.id);
        dispatch(NumberPlateSelectedAction(response.data.id));
        resetAllStates();
        navigation.navigate(ROUTES.NEW_INSPECTION, {
          routeName: ROUTES.LICENSE_PLATE_SELECTION,
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
    axios
      .get(`${DEV_URL}/api/v1/files/details/${inspectionID}`)
      .then(res => {
        uploadInProgressMediaToStore(res?.data?.files, dispatch);
        setIsLoading(false);
        dispatch(NumberPlateSelectedAction(inspectionID));
        navigation.navigate(ROUTES.NEW_INSPECTION, {
          routeName: ROUTES.LICENSE_PLATE_SELECTION,
        });
      })
      .catch(error => {
        setIsLoading(false);
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
