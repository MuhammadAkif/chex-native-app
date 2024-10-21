import {Types} from '../Types';

const {
  GET_INSPECTION_REVIEWED,
  SET_INSPECTIONS_COUNTS,
  CLEAR_INSPECTION_REVIEWED,
} = Types;

const initialState = {
  inspectionReviewed: [],
  filter: {
    inspections: [],
    reviewed: {
      id: 1,
      name: 'Reviewed',
      count: 0,
      selected: true,
      key: 'reviewed',
    },
    in_review: {
      id: 2,
      name: 'In Review',
      count: 0,
      selected: true,
      key: 'in_review',
    },
    ready_for_review: {
      id: 3,
      name: 'Ready For Review',
      count: 0,
      selected: true,
      key: 'ready_for_review',
    },
  },
};

const inspectionReviewedReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INSPECTION_REVIEWED:
      return {
        ...state,
        inspectionReviewed: action.payload,
      };
    case SET_INSPECTIONS_COUNTS:
      return {
        ...state,
        filter: {inspection: state.inspections, ...action.payload},
      };
    case CLEAR_INSPECTION_REVIEWED:
      return initialState;
    default:
      return state;
  }
};

export default inspectionReviewedReducer;
