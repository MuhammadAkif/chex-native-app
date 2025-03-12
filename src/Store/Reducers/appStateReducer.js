import {Types} from '../Types';

const initialState = {
  isFirstTimeOpen: true,
  showInstructions: false,
};
const {SET_FIRST_TIME_OPEN, SET_SHOW_INSTRUCTIONS} = Types;

const appStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FIRST_TIME_OPEN:
      return {
        ...state,
        isFirstTimeOpen: action.payload,
      };
    case SET_SHOW_INSTRUCTIONS:
      return {
        ...state,
        showInstructions: action.payload,
      };
    default:
      return state;
  }
};

export default appStateReducer;
