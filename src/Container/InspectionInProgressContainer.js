import React, {useCallback, useState} from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [inspectionID, setInspectionID] = useState(null);
  const [deleteInspectionID, setDeleteInspectionID] = useState(null);
  const [isDiscardInspectionModalVisible, setIsDiscardInspectionModalVisible] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      // dispatch(FETCH_INSPECTION_IN_PROGRESS(token, setIsLoading));
      fetchInspectionInProgress().then();
      return () => resetAllStates();
    }, []),
  );
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
  // function uploadInProgressMediaToStore(files) {
  //   for (let file = 0; file < files.length; file++) {
  //     const imageURL =
  //       files[file].url.split(':')[0] === 'https'
  //         ? files[file].url
  //         : `${S3_BUCKET_BASEURL}${files[file].url}`;
  //     const {groupType, id, category} = files[file];
  //     if (groupType === 'carVerificiationItems') {
  //       category === 'license_plate_number'
  //         ? dispatch(UpdateCarVerificationItemURI('licensePlate', imageURL, id))
  //         : category === 'odometer'
  //         ? dispatch(UpdateCarVerificationItemURI('odometer', imageURL, id))
  //         : null;
  //     } else if (groupType === 'exteriorItems') {
  //       category === 'exterior_left'
  //         ? dispatch(UpdateExteriorItemURI('exteriorLeft', imageURL, id))
  //         : category === 'exterior_right'
  //         ? dispatch(UpdateExteriorItemURI('exteriorRight', imageURL, id))
  //         : category === 'exterior_front'
  //         ? dispatch(UpdateExteriorItemURI('exteriorFront', imageURL, id))
  //         : category === 'exterior_rear'
  //         ? dispatch(UpdateExteriorItemURI('exteriorRear', imageURL, id))
  //         : null;
  //     } else if (groupType === 'tires') {
  //       category === 'left_front_tire'
  //         ? dispatch(UpdateTiresItemURI('leftFrontTire', imageURL, id))
  //         : category === 'left_rear_tire'
  //         ? dispatch(UpdateTiresItemURI('leftRearTire', imageURL, id))
  //         : category === 'right_front_tire'
  //         ? dispatch(UpdateTiresItemURI('rightFrontTire', imageURL, id))
  //         : category === 'right_rear_tire'
  //         ? dispatch(UpdateTiresItemURI('rightRearTire', imageURL, id))
  //         : null;
  //     }
  //   }
  // }
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
      ),
    );
  };
  const handleNoPress = () => setIsDiscardInspectionModalVisible(false);

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
    />
  );
};

export default InspectionInProgressContainer;
