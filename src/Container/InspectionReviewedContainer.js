import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import InspectionReviewedScreen from '../Screens/InspectionReviewedScreen';
import {FETCH_INSPECTION_REVIEWED} from '../Store/Actions';
import {ROUTES} from '../Navigation/ROUTES';
import {DEV_URL} from '../Constants';

const InspectionReviewedContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);
  const inspectionReviewed = useSelector(state => state?.inspectionReviewed);
  const [isExpanded, setIsExpanded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      dispatch(FETCH_INSPECTION_REVIEWED(token, setIsLoading));
      return () => {
        setIsLoading(false);
        setIsExpanded([]);
      };
    }, []),
  );

  const handleIsExpanded = id => {
    let latestData = [];
    if (isExpanded.includes(id)) {
      latestData = isExpanded.filter(item => item !== id);
      setIsExpanded(latestData);
    } else {
      setIsExpanded([...isExpanded, id]);
    }
  };
  const inspectionDetailsPress = inspectionID => {
    setIsLoading(true);
    axios
      .get(`${DEV_URL}/api/v1/files/details/${inspectionID}`)
      .then(res => {
        setIsLoading(false);
        navigation.navigate(ROUTES.INSPECTION_DETAIL, {
          files: res?.data?.files,
        });
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error of inspection in progress => ', error);
      });
  };
  return (
    <InspectionReviewedScreen
      handleIsExpanded={handleIsExpanded}
      isExpanded={isExpanded}
      navigation={navigation}
      data={inspectionReviewed}
      inspectionDetailsPress={inspectionDetailsPress}
      isLoading={isLoading}
    />
  );
};

export default InspectionReviewedContainer;
