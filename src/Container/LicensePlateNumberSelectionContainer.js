import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {LicensePlateNumberSelectionScreen} from '../Screens';
import {createInspectionURL, DEV_URL, fetchNPURL} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {colors} from '../Assets/Styles';
import {NumberPlateSelectedAction} from '../Store/Actions';
import {uploadInProgressMediaToStore} from '../Utils';

const LicensePlateNumberSelectionContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token, data} = useSelector(state => state?.auth);
  const [selectedNP, setSelectedNP] = useState(null);
  const [search, setSearch] = useState('');
  const [numberPlate, setNumberPlate] = useState([]);
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
      .post(fetchNPURL, {
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
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(createInspectionURL, body, {headers: headers})
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
        const inProgressLicensePlateErrorMessage = `Inspection for license plate #${selectedNP} is already in progress. Would you like to visit in progress inspections page?`;
        const errorMessage =
          err?.response?.data?.errorMessage ?? err?.response?.data?.message[0];
        // setErrorTitle(inProgressLicensePlateErrorMessage);
        setIsLoading(false);
        // setIsDiscardInspectionModalVisible(true);
        Alert.alert('', errorMessage);
      });
  };

  const handleYesPressOfInProgressInspection = () => {
    setIsDiscardInspectionModalVisible(false);
    setIsLoading(true);
    setErrorTitle('');
    // setInspectionID(inspectionId);
    axios
      .get(`${DEV_URL}/api/v1/files/details/${inspectionID}`)
      .then(res => {
        uploadInProgressMediaToStore(res?.data?.files, dispatch);
        setIsLoading(false);
        dispatch(NumberPlateSelectedAction(inspectionID));
        navigation.navigate(ROUTES.NEW_INSPECTION, {
          inspectionId: inspectionID,
        });
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error of selected inspection in progress => ', error);
      });
  };
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
    />
  );
};

export default LicensePlateNumberSelectionContainer;
