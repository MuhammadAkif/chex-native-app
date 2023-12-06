import axios from 'axios';

import {Types} from '../Types';
import {DEV_URL} from '../../Constants';

export const FETCH_INSPECTION_IN_PROGRESS = inspectionInProgress => {
  // export const FETCH_INSPECTION_IN_PROGRESS = (token, setIsLoading) => {
  return async dispatch => {
    // let inspectionInProgress = [];
    // inspectionInProgress = await fetchInProgressInspections(
    //   token,
    //   'IN_PROGRESS',
    //   setIsLoading,
    // );
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
  setIsLoading,
  setModalMessageDetails,
) => {
  return async dispatch => {
    let inspectionsInProgress = [];
    inspectionsInProgress = inspections.filter(
      item => item.id !== inspectionId,
    );
    await axios
      .delete(`${DEV_URL}/api/v1/delete/inspection/${inspectionId}?type=app`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setIsLoading(false);
        dispatch({
          type: Types.REMOVE_INSPECTION_IN_PROGRESS,
          payload: {inspectionsInProgress: inspectionsInProgress},
        });
        setModalMessageDetails({
          isVisible: true,
          title: 'Deleted',
          message: res?.data,
        });
      })
      .catch(error => {
        setIsLoading(false);
        let errorMessage = error?.response?.data?.message[0];
        setModalMessageDetails({
          isVisible: true,
          title: '',
          message: errorMessage,
        });
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
