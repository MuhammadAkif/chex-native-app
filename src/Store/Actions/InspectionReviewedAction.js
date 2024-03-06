import {Types} from '../Types';

export const FETCH_INSPECTION_REVIEWED = inspectionReviewData => {
  return async dispatch => {
    dispatch({
      type: Types.GET_INSPECTION_REVIEWED,
      payload: {inspectionReviewData},
    });
  };
};

export const CLEAR_INSPECTION_REVIEWED = () => {
  return dispatch => {
    dispatch({
      type: Types.CLEAR_INSPECTION_REVIEWED,
    });
  };
};
