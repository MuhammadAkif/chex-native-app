// initial state
import {Types} from '../Types';

const {SET_LOADING, SHOW_TOAST, HIDE_TOAST} = Types;

const initialState = {
  loading: false,
  toast: {
    visible: false,
    message: '',
    type: '', // e.g., 'success', 'error', 'info'
  },
};

const UIReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SHOW_TOAST:
      return {
        ...state,
        toast: {
          visible: true,
          message: action.payload.message,
          type: action.payload.type,
        },
      };
    case HIDE_TOAST:
      return {
        ...state,
        toast: {
          visible: false,
          message: '',
          type: '',
        },
      };
    default:
      return state;
  }
};

export default UIReducer;
