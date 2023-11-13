import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

import {InspectionInProgressScreen} from '../Screens';
import {baseURL} from '../Constants';
import {
  FETCH_INSPECTION_IN_PROGRESS,
  REMOVE_INSPECTION_IN_PROGRESS,
  UpdateCarVerificationItemURI,
  UpdateExteriorItemURI,
  UpdateTiresItemURI,
} from '../Store/Actions';
import {ROUTES} from '../Navigation/ROUTES';

const InspectionInProgressContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.auth);
  const inspectionInProgress = useSelector(
    state => state?.inspectionInProgress,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [inspectionID, setInspectionID] = useState(null);

  useFocusEffect(
    useCallback(() => {
      dispatch(FETCH_INSPECTION_IN_PROGRESS(token));
      return () => {
        setIsLoading(false);
        setInspectionID(null);
      };
    }, []),
  );

  const handleContinuePress = inspectionId => {
    setIsLoading(true);
    setInspectionID(inspectionId);
    axios
      .get(`${baseURL}/api/v1/files/details/${inspectionId}`)
      .then(res => {
        uploadInProgressMediaToStore(res?.data?.files);
        setIsLoading(false);
        navigation.navigate(ROUTES.NEW_INSPECTION, {
          inspectionId: inspectionId,
        });
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error of inspection in progress => ', error);
      });
  };
  function uploadInProgressMediaToStore(files) {
    for (let file = 0; file < files.length; file++) {
      const imageURL = `https://chex-ai-uploads.s3.amazonaws.com/${files[file].url}`;
      const {groupType, id, category} = files[file];
      if (groupType === 'carVerificiationItems') {
        category === 'license_plate_number'
          ? dispatch(UpdateCarVerificationItemURI('licensePlate', imageURL, id))
          : category === 'odometer'
          ? dispatch(UpdateCarVerificationItemURI('odometer', imageURL, id))
          : null;
      } else if (groupType === 'exteriorItems') {
        category === 'exterior_left'
          ? dispatch(UpdateExteriorItemURI('exteriorLeft', imageURL, id))
          : category === 'exterior_right'
          ? dispatch(UpdateExteriorItemURI('exteriorRight', imageURL, id))
          : category === 'exterior_front'
          ? dispatch(UpdateExteriorItemURI('exteriorFront', imageURL, id))
          : category === 'exterior_rear'
          ? dispatch(UpdateExteriorItemURI('exteriorRear', imageURL, id))
          : null;
      } else if (groupType === 'tires') {
        category === 'left_front_tire'
          ? dispatch(UpdateTiresItemURI('leftFrontTire', imageURL, id))
          : category === 'left_rear_tire'
          ? dispatch(UpdateTiresItemURI('leftRearTire', imageURL, id))
          : category === 'right_front_tire'
          ? dispatch(UpdateTiresItemURI('rightFrontTire', imageURL, id))
          : category === 'right_rear_tire'
          ? dispatch(UpdateTiresItemURI('rightRearTire', imageURL, id))
          : null;
      }
    }
  }
  const onCrossPress = id => {
    setIsLoading(true);
    dispatch(
      REMOVE_INSPECTION_IN_PROGRESS(
        token,
        id,
        inspectionInProgress,
        setIsLoading,
      ),
    );
  };

  return (
    <InspectionInProgressScreen
      data={inspectionInProgress}
      navigation={navigation}
      handleContinuePress={handleContinuePress}
      onCrossPress={onCrossPress}
      isLoading={isLoading}
      inspectionID={inspectionID}
    />
  );
};

export default InspectionInProgressContainer;
