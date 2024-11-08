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

/**
 *
 * @param state
 * @param action
 * @returns {{toast: {visible: boolean, message: string, type: string}, loading: boolean}|{toast: {visible: boolean, message: string, type: string}, loading: boolean}|{toast: {visible: boolean, message: string, type: string}, loading}|{toast: {visible: boolean, message, type}, loading: boolean}}
 * @constructor
 */
const UIReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case SHOW_TOAST:
      return {
        ...state,
        toast: {
          visible: true,
          message: payload.message,
          type: payload.type,
        },
      };
    case HIDE_TOAST:
      return {
        ...state,
        toast: initialState.toast,
      };
    default:
      return state;
  }
};

export default UIReducer;
