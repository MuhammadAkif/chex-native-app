import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {InspectionReviewedScreen} from '../Screens';
import {FETCH_INSPECTION_REVIEWED} from '../Store/Actions';
import {ROUTES} from '../Navigation/ROUTES';
import {
  generateApiUrl,
  HARDWARE_BACK_PRESS,
  INSPECTION_STATUSES,
} from '../Constants';
import {
  fetchInProgressInspections,
  FILTER_IMAGES,
  handle_Session_Expired,
  handleNewInspectionPress,
  sortImagesByOrder,
  sortInspection_Reviewed_Items,
  sortInspectionReviewedItems,
} from '../Utils';

const {INSPECTION_DETAIL} = ROUTES;

const InspectionReviewedContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {canGoBack, goBack, navigate} = navigation;
  const {
    user: {token, data},
  } = useSelector(state => state.auth);
  const {inspectionReviewed} = useSelector(state => state?.inspectionReviewed);
  const [isExpanded, setIsExpanded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewInspectionLoading, setIsNewInspectionLoading] = useState(false);
  const [selectedInspectionID, setSelectedInspectionID] = useState(null);
  const [filter, setFilter] = useState(false);
  const [inspections, setInspections] = useState(inspectionReviewed || []);

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
    return () => {
      backHandler.remove();
      resetAllStates();
    };
  }, []);
  useEffect(() => {
    setInspections(inspectionReviewed || []);
  }, [inspectionReviewed]);

  //Logic starts here
  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      goBack();
      return true;
    }
    return false;
  }
  function resetAllStates() {
    setIsLoading(false);
    setIsExpanded([]);
    setSelectedInspectionID(null);
    setIsNewInspectionLoading(false);
    setInspections(inspectionReviewed);
    setFilter(false);
  }
  async function fetchInspectionInProgress() {
    let inspectionReviewData = [];
    inspectionReviewData = await fetchInProgressInspections(
      token,
      INSPECTION_STATUSES,
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
    const endPoint = generateApiUrl(`files/app/${inspectionID}`);

    axios
      .get(endPoint)
      .then(res => {
        setIsLoading(false);
        const {finalStatus, remarks} = res?.data?.inspectionData;
        const beforeImages = FILTER_IMAGES(res?.data?.files, 'before');
        // let files = sortImagesByOrder(beforeImages);
        let files = sortInspection_Reviewed_Items(beforeImages);
        // let files = sortInspectionReviewedItems(beforeImages);
        resetAllStates();
        navigate(INSPECTION_DETAIL, {
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
  function onFilterPress() {
    setFilter(!filter);
  }
  //Logic ends here

  return (
    <InspectionReviewedScreen
      handleIsExpanded={handleIsExpanded}
      isExpanded={isExpanded}
      navigation={navigation}
      data={inspections}
      inspectionDetailsPress={inspectionDetailsPress}
      isLoading={isLoading}
      isNewInspectionLoading={isNewInspectionLoading}
      fetchInspectionInProgress={fetchInspectionInProgress}
      selectedInspectionID={selectedInspectionID}
      onNewInspectionPress={onNewInspectionPress}
      onFilterPress={onFilterPress}
      filter={filter}
      setInspections={setInspections}
      setFilter={setFilter}
      inspections={inspections}
    />
  );
};

export default InspectionReviewedContainer;
