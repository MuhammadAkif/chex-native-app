import {Types} from '../Types';
const {SET_LOADING, SHOW_TOAST, HIDE_TOAST} = Types;

const initialState = {
  loading: false,
  toast: {
    visible: false,
    message: '',
    type: '', // Category of toast (e.g., 'success', 'error', 'info')
  },
};

/**
 * UIReducer
 * @param {Object} state - Current UI state
 * @param {Object} action - Redux action with `type` and optional `payload`
 * @returns {Object} Updated UI state based on action
 *
 * Handles toggling the loading indicator and showing/hiding toast notifications.
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
