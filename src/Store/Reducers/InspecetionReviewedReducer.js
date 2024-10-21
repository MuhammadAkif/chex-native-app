import {Types} from '../Types';

const {GET_INSPECTION_REVIEWED, CLEAR_INSPECTION_REVIEWED} = Types;

const initialState = {
  inspectionReviewed: [],
};

const inspectionReviewedReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INSPECTION_REVIEWED:
      return {
        ...state,
        inspectionReviewed: action.payload,
      };
    case CLEAR_INSPECTION_REVIEWED:
      return initialState;
    default:
      return state;
  }
};

export default inspectionReviewedReducer;
