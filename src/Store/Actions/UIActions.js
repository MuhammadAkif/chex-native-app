// action creators
import {Types} from '../Types';

const {SET_LOADING, SHOW_TOAST, HIDE_TOAST} = Types;

export const setLoading = (isLoading = false) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const showToast = (message = '', type = '') => ({
  type: SHOW_TOAST,
  payload: {message, type},
});

export const hideToast = () => ({
  type: HIDE_TOAST,
});
