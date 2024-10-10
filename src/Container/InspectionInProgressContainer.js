import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {InspectionInProgressScreen} from '../Screens';
import {
  FETCH_INSPECTION_IN_PROGRESS,
  NumberPlateSelectedAction,
  REMOVE_INSPECTION_IN_PROGRESS,
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
import {Types} from '../Store/Types';
import {deleteRequest} from '../Services/api';

const {VEHICLE_TYPE} = Types;
const {NEW_INSPECTION, INSPECTION_IN_PROGRESS} = ROUTES;

const InspectionInProgressContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {canGoBack, goBack, navigate} = navigation;
  const {
    user: {token, data},
  } = useSelector(state => state?.auth);
  const inspectionInProgress = useSelector(
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
    dispatch(FETCH_INSPECTION_IN_PROGRESS(inProgressInspection));

    return null;
  }
  const handleContinuePress = async inspectionId => {
    setIsLoading(true);
    setInspectionID(inspectionId);
    const endPoint = generateApiUrl(`files/details/${inspectionId}`);
    await axios
      .get(endPoint)
      .then(res => {
        const vehicleType = res?.data?.hasAdded || 'existing';
        dispatch({type: VEHICLE_TYPE, payload: vehicleType});
        get_Inspection_Details(dispatch, inspectionId).then();
        uploadInProgressMediaToStore(res?.data?.files, dispatch);
        setIsLoading(false);
        dispatch(NumberPlateSelectedAction(inspectionId));
        resetAllStates();
        navigate(NEW_INSPECTION, {
          routeName: INSPECTION_IN_PROGRESS,
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
        dispatch(REMOVE_INSPECTION_IN_PROGRESS(inspectionsInProgress));
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
      data={inspectionInProgress}
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
