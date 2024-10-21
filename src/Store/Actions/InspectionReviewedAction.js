import {Types} from '../Types';

const {GET_INSPECTION_REVIEWED, CLEAR_INSPECTION_REVIEWED} = Types;

export const fetchInspectionReviewed = inspectionReviewData => ({
  type: GET_INSPECTION_REVIEWED,
  payload: inspectionReviewData,
});

export const clearInspectionReviewed = () => ({
  type: CLEAR_INSPECTION_REVIEWED,
});
