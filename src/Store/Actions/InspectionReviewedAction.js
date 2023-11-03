import {fetchInProgressInspections} from '../../Utils';
import {Types} from '../Types';

export const FETCH_INSPECTION_REVIEWED = token => {
  return async dispatch => {
    let inspectionReviewData = [];
    inspectionReviewData = await fetchInProgressInspections(token, [
      'IN_REVIEW',
      'REVIEWED',
    ]);
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
