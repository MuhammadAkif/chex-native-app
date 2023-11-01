import React, {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {LicensePlateNumberSelectionScreen} from '../Screens';
import {baseURL, createInspectionURL, fetchNPURL} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';

const LicensePlateNumberSelectionContainer = ({navigation}) => {
  const {
    token,
    data: {companyId},
  } = useSelector(state => state?.auth);
  const [selectedNP, setSelectedNP] = useState('');
  const [search, setSearch] = useState('');
  const [numberPlate, setNumberPlate] = useState([]);
  const filterNP = numberPlate.filter(NP =>
    NP.toLowerCase().includes(search.toLowerCase()),
  );

  useFocusEffect(
    useCallback(() => {
      fetchNP();
      return () => {
        setNumberPlate([]);
        setSearch('');
        setSelectedNP('');
      };
    }, []),
  );

  function fetchNP() {
    axios
      .post(fetchNPURL, {
        companyId: companyId,
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
    const data = {
      licensePlateNumber: selectedNP,
      companyId: companyId,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(createInspectionURL, data, {headers: headers})
      .then(response => {
        navigation.navigate(ROUTES.NEW_INSPECTION, {
          inspectionId: response.data.id,
        });
      })
      .catch(err => console.log('error: ', err?.response?.data?.errors));
  };

  return (
    <LicensePlateNumberSelectionScreen
      handleSelectedNP={handleSelectedNP}
      selectedNP={selectedNP}
      data={filterNP}
      search={search}
      handleSearchInput={handleSearchInput}
      handleSubmit={handleSubmit}
    />
  );
};

export default LicensePlateNumberSelectionContainer;
