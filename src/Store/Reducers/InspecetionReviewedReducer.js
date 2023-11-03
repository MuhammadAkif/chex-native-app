import {Types} from '../Types';

const initialState = {
  inspectionReviewed: [],
};

const inspectionReviewedReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_INSPECTION_REVIEWED:
      return (state.inspectionReviewed = action.payload.inspectionReviewData);
    case Types.CLEAR_INSPECTION_REVIEWED:
      return (state = initialState);
    default:
      return state;
  }
};

export default inspectionReviewedReducer;
