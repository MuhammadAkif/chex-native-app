import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {InspectionReviewedScreen} from '../Screens';
import {FETCH_INSPECTION_REVIEWED} from '../Store/Actions';
import {ROUTES} from '../Navigation/ROUTES';
import {API_BASE_URL, HARDWARE_BACK_PRESS} from '../Constants';
import {
  fetchInProgressInspections,
  FILTER_IMAGES,
  handle_Session_Expired,
  handleNewInspectionPress,
  sortInspection_Reviewed_Items,
  sortInspectionReviewedItems,
} from '../Utils';

const {INSPECTION_DETAIL} = ROUTES;

const InspectionReviewedContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    user: {token, data},
  } = useSelector(state => state.auth);
  const inspectionReviewed = useSelector(state => state?.inspectionReviewed);
  const [isExpanded, setIsExpanded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewInspectionLoading, setIsNewInspectionLoading] = useState(false);
  const [selectedInspectionID, setSelectedInspectionID] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchInspectionInProgress().then();
      return () => resetAllStates();
    }, []),
  );
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);
  function handle_Hardware_Back_Press() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  }
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
      dispatch,
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
      .get(`${API_BASE_URL}/api/v1/files/app/${inspectionID}`)
      .then(res => {
        setIsLoading(false);
        const {finalStatus, remarks} = res?.data?.inspectionData;
        const beforeImages = FILTER_IMAGES(res?.data?.files, 'before');
        // let files = sortInspection_Reviewed_Items(beforeImages);
        let files = sortInspectionReviewedItems(beforeImages);
        resetAllStates();
        navigation.navigate(INSPECTION_DETAIL, {
          files: files,
          finalStatus: finalStatus,
          remarks: remarks,
        });
      })
      .catch(error => {
        setIsLoading(false);
        const statusCode = error?.response?.data?.statusCode;
        if (statusCode === 401) {
          handle_Session_Expired(statusCode, dispatch);
        }
        console.log('error of inspection in progress => ', error);
      });
  };
  const onNewInspectionPress = async () => {
    await handleNewInspectionPress(
      dispatch,
      setIsNewInspectionLoading,
      data?.companyId,
      token,
      navigation,
      resetAllStates,
    );
  };
  return (
    <InspectionReviewedScreen
      handleIsExpanded={handleIsExpanded}
      isExpanded={isExpanded}
      navigation={navigation}
      data={inspectionReviewed}
      inspectionDetailsPress={inspectionDetailsPress}
      isLoading={isLoading}
      isNewInspectionLoading={isNewInspectionLoading}
      fetchInspectionInProgress={fetchInspectionInProgress}
      selectedInspectionID={selectedInspectionID}
      onNewInspectionPress={onNewInspectionPress}
    />
  );
};

export default InspectionReviewedContainer;
