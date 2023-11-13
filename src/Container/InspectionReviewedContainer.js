import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import InspectionReviewedScreen from '../Screens/InspectionReviewedScreen';
import {FETCH_INSPECTION_REVIEWED} from '../Store/Actions';
import axios from 'axios';
import {baseURL} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';

const InspectionReviewedContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);
  const inspectionReviewed = useSelector(state => state?.inspectionReviewed);
  const [isExpanded, setIsExpanded] = useState([]);

  useFocusEffect(
    useCallback(() => {
      dispatch(FETCH_INSPECTION_REVIEWED(token));
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
    axios
      .get(`${baseURL}/api/v1/files/details/${inspectionID}`)
      .then(res => {
        console.log('inspectionDetailsPress res => ', res.data);
        debugger;
        navigation.navigate(ROUTES.INSPECTION_DETAIL, {files: res?.data?.files});
      })
      .catch(error => {
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
    />
  );
};

export default InspectionReviewedContainer;
