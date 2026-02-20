import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { HARDWARE_BACK_PRESS } from '../Constants';
import { ROUTES } from '../Navigation/ROUTES';
import { InspectionReviewedScreen } from '../Screens';
import { fetchInspectionReviewed } from '../Store/Actions';
import { handleNewInspectionPress } from '../Utils';
import { useInspectionDetails } from '../hooks';

const { INSPECTION_DETAIL } = ROUTES;

const InspectionReviewedContainer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { canGoBack, goBack, navigate } = navigation;
  const {
    user: { data },
  } = useSelector(state => state.auth);
  const { inspectionReviewed } = useSelector(state => state?.inspectionReviewed);
  const [isExpanded, setIsExpanded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewInspectionLoading, setIsNewInspectionLoading] = useState(false);
  const { handleInspectionDetailsPress, isLoading: isDetailLoading, selectedInspectionId } = useInspectionDetails();
  const [filter, setFilter] = useState(false);
  const [inspections, setInspections] = useState(inspectionReviewed || []);
  const [filterResetKey, setFilterResetKey] = useState(0);

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
    setIsNewInspectionLoading(false);
    setInspections(inspectionReviewed);
    setFilter(false);
  }
  async function fetchInspection() {
    // Reset filter sheet selections on refresh
    setFilter(false);
    setInspections(inspectionReviewed || []);
    setFilterResetKey(prev => prev + 1);

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
  const inspectionDetailsPress = id => handleInspectionDetailsPress(id, resetAllStates);
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
      isLoading={isLoading || isDetailLoading}
      isNewInspectionLoading={isNewInspectionLoading}
      fetchInspectionInProgress={fetchInspection}
      selectedInspectionID={selectedInspectionId}
      onNewInspectionPress={onNewInspectionPress}
      onFilterPress={onFilterPress}
      filter={filter}
      filterResetKey={filterResetKey}
      setInspections={setInspections}
      setFilter={setFilter}
      inspections={inspections}
    />
  );
};

export default InspectionReviewedContainer;
