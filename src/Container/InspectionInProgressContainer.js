import React, {useCallback, useEffect, useState} from 'react';
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
import {DEV_URL} from '../Constants';
// import {DEV_URL} from '@env'
import {
  fetchInProgressInspections,
  uploadInProgressMediaToStore,
} from '../Utils';


const InspectionInProgressContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);
  const inspectionInProgress = useSelector(
    state => state?.inspectionInProgress,
  );
  const modalMessageDetailsInitialState = {
    isVisible: false,
    title: '',
    message: '',
  };
  const [isLoading, setIsLoading] = useState(false);
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
      // dispatch(FETCH_INSPECTION_IN_PROGRESS(token, setIsLoading));
      fetchInspectionInProgress().then();
      return () => resetAllStates();
    }, []),
  );
  useEffect(() => {
    setTimeout(
      () => setModalMessageDetails(modalMessageDetailsInitialState),
      5000,
    );
  }, [modalMessageDetails]);
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
    );
    dispatch(FETCH_INSPECTION_IN_PROGRESS(inProgressInspection));

    return null;
  }
  const handleContinuePress = inspectionId => {
    setIsLoading(true);
    setInspectionID(inspectionId);
    axios
      .get(`${DEV_URL}/api/v1/files/details/${inspectionId}`)
      .then(res => {
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

  return (
    <InspectionInProgressScreen
      data={inspectionInProgress}
      navigation={navigation}
      handleContinuePress={handleContinuePress}
      onCrossPress={onCrossPress}
      isLoading={isLoading}
      inspectionID={inspectionID}
      onYesPress={handleYesPress}
      onNoPress={handleNoPress}
      isDiscardInspectionModalVisible={isDiscardInspectionModalVisible}
      fetchInspectionInProgress={fetchInspectionInProgress}
      modalMessageDetails={modalMessageDetails}
      handleOkPress={handleOkPress}
    />
  );
};

export default InspectionInProgressContainer;
