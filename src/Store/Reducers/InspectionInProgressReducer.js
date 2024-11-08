import {Types} from '../Types';

const {
  GET_INSPECTION_IN_PROGRESS,
  REMOVE_INSPECTION,
  CLEAR_INSPECTION_IN_PROGRESS,
} = Types;

const initialState = {
  inspectionInProgress: [],
};

/**
 *
 * @param state
 * @param action
 * @returns {{inspectionInProgress: *[]}|{inspectionInProgress}}
 */
const inspectionInProgressReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case GET_INSPECTION_IN_PROGRESS:
      return {
        ...state,
        inspectionInProgress: payload,
      };
    case REMOVE_INSPECTION:
      return {
        ...state,
        inspectionInProgress: payload,
      };
    case CLEAR_INSPECTION_IN_PROGRESS:
      return initialState;
    default:
      return state;
  }
};

export default inspectionInProgressReducer;
