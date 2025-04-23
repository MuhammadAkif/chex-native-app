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
 * Reducer function to manage the state of inspections in progress.
 *
 * This reducer is responsible for:
 * - Storing the list of inspections that are currently in progress.
 * - Handling actions that modify the list of inspections (get or remove).
 * - Resetting the state when necessary (e.g., clearing the list of inspections).
 *
 * Business Rules:
 * - `GET_INSPECTION_IN_PROGRESS`: Updates the state with the provided list of inspections in progress.
 * - `REMOVE_INSPECTION`: Removes an inspection from the list (replaces with a new list).
 * - `CLEAR_INSPECTION_IN_PROGRESS`: Resets the state to its initial state, clearing all inspections in progress.
 *
 * @param {Object} state - The current state of the reducer (default: `initialState`).
 * @param {Object} action - The action dispatched containing the type and optional payload.
 * @returns {Object} The new state based on the action type.
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
