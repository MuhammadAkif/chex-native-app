import React, {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

import {InspectionInProgressScreen} from '../Screens';
import {fetchInProgressInspections} from '../Utils';
import {baseURL} from '../Constants';

const InspectionInProgressContainer = ({navigation}) => {
  const {token} = useSelector(state => state.auth);
  const [imageUrl, setImageUrl] = useState('');
  const [data, setData] = useState([]);
  console.log(imageUrl);
  useFocusEffect(
    useCallback(() => {
      fetchInProgressInspections(token, setData).then();
    }, []),
  );
  const handleContinuePress = inspectionId => {
    axios.get(`${baseURL}/api/v1/files/details/${inspectionId}`).then(res => {
      console.log('res => ', res.data);
      setImageUrl(
        `https://chex-ai-uploads.s3.amazonaws.com/${res.data.files[0].url}`,
      );
    });
  };
  // https://chex-ai-uploads.s3.amazonaws.com/uploads/1/tKrzJ-ck72o9IzA6nP_2P.jpeg
  const onCrossPress = id => console.log('cross-pressed');
  return (
    <InspectionInProgressScreen
      data={data}
      navigation={navigation}
      handleContinuePress={handleContinuePress}
      onCrossPress={onCrossPress}
    />
  );
};

export default InspectionInProgressContainer;
