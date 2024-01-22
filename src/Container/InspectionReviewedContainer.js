import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {InspectionReviewedScreen} from '../Screens';
import {FETCH_INSPECTION_REVIEWED} from '../Store/Actions';
import {ROUTES} from '../Navigation/ROUTES';
import {DEV_URL} from '@env';
// import {DEV_URL} from '../Constants';
import {
  fetchInProgressInspections,
  sortInspectionReviewedItems,
} from '../Utils';

const InspectionReviewedContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);
  const inspectionReviewed = useSelector(state => state?.inspectionReviewed);
  const [isExpanded, setIsExpanded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInspectionID, setSelectedInspectionID] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchInspectionInProgress().then();
      return () => resetAllStates();
    }, []),
  );
  function resetAllStates() {
    setIsLoading(false);
    setIsExpanded([]);
    setSelectedInspectionID(null);
  }
  async function fetchInspectionInProgress() {
    let inspectionReviewData = [];
    inspectionReviewData = await fetchInProgressInspections(
      token,
      ['IN_REVIEW', 'REVIEWED', 'READY_FOR_REVIEW'],
      setIsLoading,
    );
    dispatch(FETCH_INSPECTION_REVIEWED(inspectionReviewData));

    return null;
  }
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
    setSelectedInspectionID(inspectionID);
    axios
      .get(`${DEV_URL}/api/v1/files/details/${inspectionID}`)
      .then(res => {
        setIsLoading(false);
        const {finalStatus, remarks} = res?.data?.inspection;
        let files = sortInspectionReviewedItems(res?.data?.files);
        resetAllStates();
        navigation.navigate(ROUTES.INSPECTION_DETAIL, {
          files: files,
          finalStatus: finalStatus,
          remarks: remarks,
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
      fetchInspectionInProgress={fetchInspectionInProgress}
      selectedInspectionID={selectedInspectionID}
    />
  );
};

export default InspectionReviewedContainer;
