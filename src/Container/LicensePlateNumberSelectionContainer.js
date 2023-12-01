import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {LicensePlateNumberSelectionScreen} from '../Screens';
import {createInspectionURL, fetchNPURL} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {colors} from '../Assets/Styles';
import {NumberPlateSelectedAction} from '../Store/Actions';

const LicensePlateNumberSelectionContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token, data} = useSelector(state => state?.auth);
  const [selectedNP, setSelectedNP] = useState('');
  const [search, setSearch] = useState('');
  const [numberPlate, setNumberPlate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

      return () => {
        setNumberPlate([]);
        setSearch('');
        setSelectedNP('');
        setIsLoading(false);
      };
    }, []),
  );

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
        dispatch(NumberPlateSelectedAction(response.data.id));
        navigation.navigate(ROUTES.NEW_INSPECTION, {
          inspectionId: response.data.id,
        });
      })
      .catch(err => {
        const errorMessage =
          err?.response?.data?.errorMessage ?? err?.response?.data?.message[0];
        setIsLoading(false);
        Alert.alert('', errorMessage);
      });
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
    />
  );
};

export default LicensePlateNumberSelectionContainer;
