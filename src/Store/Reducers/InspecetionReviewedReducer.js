import {Types} from '../Types';

const {GET_INSPECTION_REVIEWED, CLEAR_INSPECTION_REVIEWED} = Types;

const initialState = {
  inspectionReviewed: [],
};

/**
 * Reducer to manage inspection review state.
 *
 * Handles two actions:
 * - GET_INSPECTION_REVIEWED: Populates the state with inspection review data.
 * - CLEAR_INSPECTION_REVIEWED: Resets state to initial value (used on logout or data refresh).
 *
 * @param {Object} state - Current state of the reducer.
 * @param {Object} action - Redux action containing type and optional payload.
 * @returns {Object} Updated state based on the action type.
 */
const inspectionReviewedReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case GET_INSPECTION_REVIEWED:
      return {
        ...state,
        inspectionReviewed: payload,
      };

    case CLEAR_INSPECTION_REVIEWED:
      return initialState;

    default:
      return state;
  }
};

export default inspectionReviewedReducer;
