import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {InspectionInProgressScreen} from '../Screens';
import {baseURL} from '../Constants';
import {
  FETCH_INSPECTION_IN_PROGRESS,
  REMOVE_INSPECTION_IN_PROGRESS,
} from '../Store/Actions';

const InspectionInProgressContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);
  const inspectionInProgress = useSelector(
    state => state?.inspectionInProgress,
  );
  const [imageUrl, setImageUrl] = useState('');
  console.log('imageUrl: ', imageUrl);

  useFocusEffect(
    useCallback(() => {
      dispatch(FETCH_INSPECTION_IN_PROGRESS(token));
      return () => {
        setImageUrl('');
      };
    }, []),
  );

  const handleContinuePress = inspectionId => {
    debugger
    axios
      .get(`${baseURL}/api/v1/files/details/${inspectionId}`)
      .then(res => {
        debugger
        setImageUrl(
          `https://chex-ai-uploads.s3.amazonaws.com/${res.data.files[0].url}`,
        );
      })
      .catch(error => {
        console.log('error of inspection in progress => ', error);
      });
  };
  const onCrossPress = id => {
    dispatch(REMOVE_INSPECTION_IN_PROGRESS(token, id, inspectionInProgress));
  };

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
