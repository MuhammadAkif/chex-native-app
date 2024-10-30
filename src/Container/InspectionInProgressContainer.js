import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {InspectionInProgressScreen} from '../Screens';
import {
  clearNewInspection,
  fetch_InspectionInProgress,
  numberPlateSelected,
  removeInspectionInProgress,
  setVehicleType,
  showToast,
} from '../Store/Actions';
import {ROUTES} from '../Navigation/ROUTES';
import {generateApiUrl, HARDWARE_BACK_PRESS} from '../Constants';
import {
  fetchInProgressInspections,
  get_Inspection_Details,
  handle_Session_Expired,
  handleNewInspectionPress,
  uploadInProgressMediaToStore,
} from '../Utils';
import {deleteRequest} from '../Services/api';

const {NEW_INSPECTION, INSPECTION_IN_PROGRESS} = ROUTES;

const InspectionInProgressContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {canGoBack, goBack, navigate} = navigation;
  const {
    user: {token, data},
  } = useSelector(state => state?.auth);
  const {inspectionInProgress} = useSelector(
    state => state?.inspectionInProgress,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isNewInspectionLoading, setIsNewInspectionLoading] = useState(false);
  const [inspectionID, setInspectionID] = useState(null);
  const [deleteInspectionID, setDeleteInspectionID] = useState(null);
  const [isDiscardInspectionModalVisible, setIsDiscardInspectionModalVisible] =
    useState(false);

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
    if (canGoBack()) {
      goBack();
      return true;
    }
    return false;
  }
  function resetAllStates() {
    setIsLoading(false);
    setInspectionID(null);
    setIsDiscardInspectionModalVisible(false);
    setDeleteInspectionID(null);
  }
  async function fetchInspectionInProgress() {
    let inProgressInspection = [];
    inProgressInspection = await fetchInProgressInspections(
      token,
      'IN_PROGRESS',
      setIsLoading,
      dispatch,
    );
    dispatch(fetch_InspectionInProgress(inProgressInspection));

    return null;
  }
  const handleContinuePress = async inspectionId => {
    setIsLoading(true);
    setInspectionID(inspectionId);
    const endPoint = generateApiUrl(`files/details/${inspectionId}`);
    await axios
      .get(endPoint)
      .then(res => onContinuePressSuccess(res, inspectionId))
      .catch(onContinuePressFail)
      .finally(() => {
        setInspectionID(null);
        setIsLoading(false);
      });
  };
  function onContinuePressSuccess(res, inspectionId) {
    const {hasAdded = 'existing', files = {}} = res?.data || {};
    const vehicleType = hasAdded || 'existing';
    dispatch(setVehicleType(vehicleType));
    get_Inspection_Details(dispatch, inspectionId).then();
    uploadInProgressMediaToStore(files, dispatch);
    dispatch(numberPlateSelected(inspectionId));
    resetAllStates();
    navigate(NEW_INSPECTION, {
      routeName: INSPECTION_IN_PROGRESS,
    });
  }
  function onContinuePressFail(error) {
    const {statusCode = null} = error?.response?.data || {};
    dispatch(clearNewInspection());
    if (statusCode === 401) {
      handle_Session_Expired(statusCode, dispatch);
    }
    console.log('error of inspection in progress => ', error);
  }
  const onCrossPress = id => {
    setDeleteInspectionID(id);
    setIsDiscardInspectionModalVisible(true);
  };
  const handleYesPress = () => {
    setIsDiscardInspectionModalVisible(false);
    setIsLoading(true);
    removeInspection().then();
  };
  async function removeInspection() {
    let inspectionsInProgress = [];
    inspectionsInProgress = inspectionInProgress.filter(
      item => item.id !== deleteInspectionID,
    );
    const endPoint = generateApiUrl(
      `delete/inspection/${deleteInspectionID}?type=app`,
    );

    await deleteRequest(endPoint)
      .then(res => {
        dispatch(removeInspectionInProgress(inspectionsInProgress));
        dispatch(showToast('Inspection has been deleted!', 'success'));
      })
      .catch(error => {
        let errorMessage =
          error?.response?.data?.message[0] ||
          'Something went wrong, Please try again.';
        const statusCode = error?.response?.data?.statusCode;
        if (statusCode === 401) {
          handle_Session_Expired(statusCode, dispatch);
        }
        dispatch(showToast(errorMessage, 'error'));
      })
      .finally(() => setIsLoading(false));
  }
  const handleNoPress = () => setIsDiscardInspectionModalVisible(false);
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
    <InspectionInProgressScreen
      data={inspectionInProgress || []}
      navigation={navigation}
      handleContinuePress={handleContinuePress}
      onCrossPress={onCrossPress}
      isLoading={isLoading}
      isNewInspectionLoading={isNewInspectionLoading}
      inspectionID={inspectionID}
      onYesPress={handleYesPress}
      onNoPress={handleNoPress}
      isDiscardInspectionModalVisible={isDiscardInspectionModalVisible}
      fetchInspectionInProgress={fetchInspectionInProgress}
      onNewInspectionPress={onNewInspectionPress}
    />
  );
};

export default InspectionInProgressContainer;
