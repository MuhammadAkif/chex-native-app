import {Types} from '../Types';
import {fetchInProgressInspections} from '../../Utils';
import axios from 'axios';
import {baseURL} from '../../Constants';
import {Alert} from 'react-native';

export const FETCH_INSPECTION_IN_PROGRESS = token => {
  return async dispatch => {
    let inspectionInProgress = [];
    inspectionInProgress = await fetchInProgressInspections(
      token,
      'IN_PROGRESS',
    );
    dispatch({
      type: Types.GET_INSPECTION_IN_PROGRESS,
      payload: {inspectionInProgress},
    });
  };
};
export const REMOVE_INSPECTION_IN_PROGRESS = (
  token,
  inspectionId,
  inspections,
) => {
  return async dispatch => {
    let inspectionsInProgress = [];
    inspectionsInProgress = inspections.filter(
      item => item.id !== inspectionId,
    );
    await axios
      .delete(`${baseURL}/api/v1/delete/inspection/${inspectionId}?type=app`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        console.log('delete inspection response: ', res);
        dispatch({
          type: Types.REMOVE_INSPECTION_IN_PROGRESS,
          payload: {inspectionsInProgress: inspectionsInProgress},
        });
        Alert.alert('Deleted', res?.data);
      })
      .catch(error => {
        let errorMessage = error?.response?.data?.message[0];

        console.log('inspection delete error: ', errorMessage);
        Alert.alert('', errorMessage);
      });
  };
};

export const CLEAR_INSPECTION_IN_PROGRESS = () => {
  return dispatch => {
    dispatch({
      type: Types.CLEAR_INSPECTION_IN_PROGRESS,
    });
  };
};
