import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {HARDWARE_BACK_PRESS, VEHICLE_TYPES} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {InspectionInProgressScreen} from '../Screens';
import {
  clearNewInspection,
  deleteInspection,
  fetchInspectionInProgress,
  file_Details,
  setSelectedVehicleKind,
  setVehicleType,
  showToast,
} from '../Store/Actions';
import {handle_Session_Expired, handleNewInspectionPress} from '../Utils';

const {NEW_INSPECTION, INSPECTION_IN_PROGRESS} = ROUTES;

const InspectionInProgressContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {canGoBack, goBack, navigate} = navigation;
  const {
    user: {data},
  } = useSelector(state => state?.auth);
  const {inspectionInProgress} = useSelector(state => state?.inspectionInProgress);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewInspectionLoading, setIsNewInspectionLoading] = useState(false);
  const [inspectionID, setInspectionID] = useState(null);
  const [deleteInspectionID, setDeleteInspectionID] = useState(null);
  const [isDiscardInspectionModalVisible, setIsDiscardInspectionModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchInProgressInspections().then();
      return () => resetAllStates();
    }, []),
  );
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, handle_Hardware_Back_Press);
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
  async function fetchInProgressInspections() {
    dispatch(fetchInspectionInProgress()).finally(() => setIsLoading(false));

    return null;
  }
  const handleContinuePress = async inspectionId => {
    setIsLoading(true);
    setInspectionID(inspectionId);
    dispatch(file_Details(inspectionId))
      .then(res => onContinuePressSuccess(res, inspectionId))
      .catch(onContinuePressFail)
      .finally(() => {
        setInspectionID(null);
        setIsLoading(false);
      });
  };
  function onContinuePressSuccess(res, inspectionId) {
    const {hasAdded = 'existing', vehicleType: vehicleKind} = res?.data || {};
    const vehicleType = hasAdded || 'existing';
    dispatch(setVehicleType(vehicleType));
    resetAllStates();

    if (vehicleKind == VEHICLE_TYPES.TRUCK) return navigate(ROUTES.DVIR_INSPECTION_CHECKLIST);
    else
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
    console.log('error of inspection in progress => ', error.response.data);
  }
  const onCrossPress = id => {
    setDeleteInspectionID(id);
    setIsDiscardInspectionModalVisible(true);
  };
  const handleYesPress = () => {
    setIsDiscardInspectionModalVisible(false);
    setIsLoading(true);
    remove_Inspection().then();
  };
  async function remove_Inspection() {
    dispatch(deleteInspection(deleteInspectionID))
      .catch(error => {
        let errorMessage = error?.response?.data?.message[0] || 'Something went wrong, Please try again.';
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
    await handleNewInspectionPress(dispatch, setIsNewInspectionLoading, data?.companyId, navigation, resetAllStates);
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
      fetchInspectionInProgress={fetchInProgressInspections}
      onNewInspectionPress={onNewInspectionPress}
    />
  );
};

export default InspectionInProgressContainer;
