import {Types} from '../Types';
import {login} from '../../services/authServices';

const {
  SIGN_IN,
  CLEAR_INSPECTION_REVIEWED,
  CLEAR_INSPECTION_IN_PROGRESS,
  CLEAR_NEW_INSPECTION,
  SIGN_OUT,
  SESSION_EXPIRED,
  USER_VEHICLES,
} = Types;

/**
 * Signs in the user using the provided credentials.
 *
 * This action dispatches a `SIGN_IN` event to update the auth state in the store.
 * It also returns a promise so components can handle async login flows (e.g., spinners, form validation).
 *
 * Business Rule:
 * - Backend should return user info and token in response.
 * - Error handling is delegated to the UI (rethrows error).
 *
 * @param {string} username - The username or email of the user.
 * @param {string} password - The password associated with the account.
 * @returns {Function} Redux Thunk function that returns a Promise.
 */
export const signIn = (username, password) => async dispatch => {
  try {
    const userInfo = await login(username, password); // API call
    dispatch({type: SIGN_IN, payload: userInfo});
  } catch (error) {
    throw error; // Let the component handle login error (e.g., show message)
  }
};

/**
 * Logs the user out and resets related parts of the Redux store.
 *
 * This includes clearing:
 * - Inspection data that may be sensitive or user-specific
 * - Auth state
 *
 * Business Rule:
 * - This should be called when a user explicitly logs out OR on session expiration.
 *
 * @returns {Function} Redux Thunk function.
 */
export const signOut = () => {
  return dispatch => {
    // Clear all inspection-related state before signing out
    dispatch({type: CLEAR_INSPECTION_REVIEWED});
    dispatch({type: CLEAR_INSPECTION_IN_PROGRESS});
    dispatch({type: CLEAR_NEW_INSPECTION});

    dispatch({type: SIGN_OUT});
  };
};

/**
 * Dispatches a session-expired action.
 *
 * Use Case:
 * - Typically triggered by middleware when API returns 401 or token is invalid.
 * - Can be used to redirect to login or show a modal.
 *
 * @returns {{ type: string }} Action object to signal session expiration.
 */
export const sessionExpired = () => ({
  type: SESSION_EXPIRED,
});

export const setVehiclesList = (vehicles = []) => ({
  type: USER_VEHICLES,
  payload: vehicles,
});
