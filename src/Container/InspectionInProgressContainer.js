import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

import {InspectionInProgressScreen} from '../Screens';
import {baseURL} from '../Constants';
import {FETCH_INSPECTION_IN_PROGRESS} from '../Store/Actions';

const InspectionInProgressContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);
  const inspectionInProgress = useSelector(
    state => state?.inspectionInProgress,
  );
  const [imageUrl, setImageUrl] = useState('');

  useFocusEffect(
    useCallback(() => {
      dispatch(FETCH_INSPECTION_IN_PROGRESS(token));
      return () => {
        setImageUrl('');
      };
    }, []),
  );

  const handleContinuePress = inspectionId => {
    axios.get(`${baseURL}/api/v1/files/details/${inspectionId}`).then(res => {
      setImageUrl(
        `https://chex-ai-uploads.s3.amazonaws.com/${res.data.files[0].url}`,
      );
    });
  };
  // https://chex-ai-uploads.s3.amazonaws.com/uploads/1/tKrzJ-ck72o9IzA6nP_2P.jpeg
  const onCrossPress = id => console.log('cross-pressed');
  return (
    <InspectionInProgressScreen
      data={inspectionInProgress}
      navigation={navigation}
      handleContinuePress={handleContinuePress}
      onCrossPress={onCrossPress}
    />
  );
};

export default InspectionInProgressContainer;
