import React, {useCallback, useState} from 'react';
import axios from 'axios';

import {LicensePlateNumberSelectionScreen} from '../Screens';
import {baseURL, createInspectionAPI} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

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
      .post(`${baseURL}/api/v1/searchnumberplate`, {
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
      .post(createInspectionAPI, data, {headers: headers})
      .then(response => {
        console.log('response: ', response.data);
        debugger;
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
