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
} from '../Store/Actions';
import {ROUTES} from '../Navigation/ROUTES';
import {DEV_URL, HARDWARE_BACK_PRESS} from '../Constants';
import {
  fetchInProgressInspections,
  get_Inspection_Details,
  handle_Session_Expired,
  handleNewInspectionPress,
  uploadInProgressMediaToStore,
} from '../Utils';
import {Types} from '../Store/Types';

const {VEHICLE_TYPE} = Types;

const InspectionInProgressContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    user: {token, data},
  } = useSelector(state => state?.auth);
  const inspectionInProgress = useSelector(
    state => state?.inspectionInProgress,
  );
  const modalMessageDetailsInitialState = {
    isVisible: false,
    title: '',
    message: '',
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isNewInspectionLoading, setIsNewInspectionLoading] = useState(false);
  const [inspectionID, setInspectionID] = useState(null);
  const [deleteInspectionID, setDeleteInspectionID] = useState(null);
  const [isDiscardInspectionModalVisible, setIsDiscardInspectionModalVisible] =
    useState(false);
  const [modalMessageDetails, setModalMessageDetails] = useState(
    modalMessageDetailsInitialState,
  );
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchInspectionInProgress().then();
      return () => resetAllStates();
    }, []),
  );
  useEffect(() => {
    let timeoutID = setTimeout(
      () => setModalMessageDetails(modalMessageDetailsInitialState),
      5000,
    );
    return () => {
      clearTimeout(timeoutID);
    };
  }, [modalMessageDetails]);
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
    setInspectionID(null);
    setIsDiscardInspectionModalVisible(false);
    setDeleteInspectionID(null);
    setModalMessageDetails(modalMessageDetailsInitialState);
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
    await axios
      .get(`${DEV_URL}/api/v1/files/details/${inspectionId}`)
      .then(res => {
        const vehicleType = res?.data?.hasAdded;
        dispatch({type: VEHICLE_TYPE, payload: vehicleType});
        get_Inspection_Details(dispatch, inspectionId).then();
        uploadInProgressMediaToStore(res?.data?.files, dispatch);
        setIsLoading(false);
        dispatch(NumberPlateSelectedAction(inspectionId));
        resetAllStates();
        navigation.navigate(ROUTES.NEW_INSPECTION, {
          routeName: ROUTES.INSPECTION_IN_PROGRESS,
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
    dispatch(
      REMOVE_INSPECTION_IN_PROGRESS(
        token,
        deleteInspectionID,
        inspectionInProgress,
        setIsLoading,
        setModalMessageDetails,
      ),
    );
  };
  const handleNoPress = () => setIsDiscardInspectionModalVisible(false);
  const handleOkPress = () =>
    setModalMessageDetails(modalMessageDetailsInitialState);
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
      modalMessageDetails={modalMessageDetails}
      handleOkPress={handleOkPress}
      onNewInspectionPress={onNewInspectionPress}
    />
  );
};

export default InspectionInProgressContainer;
