import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {HARDWARE_BACK_PRESS} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {InspectionReviewedScreen} from '../Screens';
import {fetchInspectionReviewed} from '../Store/Actions';
import {FILTER_IMAGES, handle_Session_Expired, handleNewInspectionPress, sortInspectionReviewedItems, updateFiles} from '../Utils';
import {inspectionDetails} from '../services/inspection';

const {INSPECTION_DETAIL} = ROUTES;

const InspectionReviewedContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {canGoBack, goBack, navigate} = navigation;
  const {
    user: {data},
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
      fetchInspection().then();
      return () => resetAllStates();
    }, [])
  );
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, handle_Hardware_Back_Press);
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
  async function fetchInspection() {
    dispatch(fetchInspectionReviewed()).finally(() => setIsLoading(false));
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
  const inspectionDetailsPress = async inspectionID => {
    setIsLoading(true);
    setSelectedInspectionID(inspectionID);

    await inspectionDetails(inspectionID).then(onInspectionDetailsPressSuccess).catch(onInspectionDetailsPressFail);
  };
  function onInspectionDetailsPressSuccess(res) {
    const {inspectionData = null, files = {}} = res?.data || {};
    setIsLoading(false);
    const {finalStatus, remarks} = inspectionData;
    const beforeImages = FILTER_IMAGES(files, 'before');
    const updatedBeforeImages = updateFiles(beforeImages);
    let files_ = sortInspectionReviewedItems(updatedBeforeImages);
    resetAllStates();

    navigate(INSPECTION_DETAIL, {
      files: files_,
      finalStatus: finalStatus,
      remarks: remarks,
    });
  }
  function onInspectionDetailsPressFail(error) {
    const {statusCode = null} = error?.response?.data || {};
    setIsLoading(false);
    if (statusCode === 401) {
      handle_Session_Expired(statusCode, dispatch);
    }
    console.log('error of inspection in progress => ', error.response.data);
  }
  const onNewInspectionPress = async () => {
    await handleNewInspectionPress(dispatch, setIsNewInspectionLoading, data?.companyId, navigation, resetAllStates);
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
      fetchInspectionInProgress={fetchInspection}
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
