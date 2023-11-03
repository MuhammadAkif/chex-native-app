import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import InspectionReviewedScreen from '../Screens/InspectionReviewedScreen';
import {FETCH_INSPECTION_REVIEWED} from '../Store/Actions';

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
  // const handleIsExpanded = () => setIsExpanded(!isExpanded);
  return (
    <InspectionReviewedScreen
      handleIsExpanded={handleIsExpanded}
      isExpanded={isExpanded}
      navigation={navigation}
      data={inspectionReviewed}
    />
  );
};

export default InspectionReviewedContainer;
