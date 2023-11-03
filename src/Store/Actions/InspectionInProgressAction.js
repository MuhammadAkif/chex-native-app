import {Types} from '../Types';
import {fetchInProgressInspections} from '../../Utils';

export const FETCH_INSPECTION_IN_PROGRESS = token => {
  return async dispatch => {
    let inspectionInProgress = [];
    inspectionInProgress = await fetchInProgressInspections(
      token,
      'IN_PROGRESS',
    );
    console.log('inspectionInProgress', inspectionInProgress);
    dispatch({
      type: Types.GET_INSPECTION_IN_PROGRESS,
      payload: {inspectionInProgress},
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
