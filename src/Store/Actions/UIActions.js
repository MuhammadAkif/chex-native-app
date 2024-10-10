// action creators
import {Types} from '../Types';

export const setLoading = (isLoading = false) => ({
  type: Types.SET_LOADING,
  payload: isLoading,
});

export const showToast = (message = '', type = '') => ({
  type: Types.SHOW_TOAST,
  payload: {message, type},
});

export const hideToast = () => ({
  type: Types.HIDE_TOAST,
});
