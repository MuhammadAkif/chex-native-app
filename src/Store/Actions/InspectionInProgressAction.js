import {Types} from '../Types';

export const FETCH_INSPECTION_IN_PROGRESS = inspectionInProgress => {
  return async dispatch => {
    dispatch({
      type: Types.GET_INSPECTION_IN_PROGRESS,
      payload: {inspectionInProgress},
    });
  };
};
export const REMOVE_INSPECTION_IN_PROGRESS = inspectionsInProgress => {
  return async dispatch => {
    dispatch({
      type: Types.REMOVE_INSPECTION_IN_PROGRESS,
      payload: {inspectionsInProgress: inspectionsInProgress},
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
