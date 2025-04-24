import {Types} from '../Types';
const {SET_LOADING, SHOW_TOAST, HIDE_TOAST} = Types;

/**
 * Creates an action to toggle the global loading indicator
 * @param {boolean} isLoading - true to show, false to hide
 */
export const setLoading = (isLoading = false) => ({
  type: SET_LOADING,
  payload: isLoading,
});

/**
 * Creates an action to display a toast notification
 * @param {string} message - Text to show in the toast
 * @param {string} type - Category of toast ('success' | 'error' | 'info')
 */
export const showToast = (message = '', type = '') => ({
  type: SHOW_TOAST,
  payload: {message, type},
});

/**
 * Creates an action to hide the current toast notification
 */
export const hideToast = () => ({
  type: HIDE_TOAST,
});
