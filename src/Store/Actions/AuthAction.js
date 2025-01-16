import {Types} from '../Types';
import {login} from '../../services/authServices';

const {
  SIGN_IN,
  CLEAR_INSPECTION_REVIEWED,
  CLEAR_INSPECTION_IN_PROGRESS,
  CLEAR_NEW_INSPECTION,
  SIGN_OUT,
  SESSION_EXPIRED,
} = Types;

/**
 * Sign in action creator
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {(function(*): Promise<void>)} Redux thunk action
 * @throws {Error} If login fails
 */
export const signIn = (username, password) => async dispatch => {
  try {
    const response = await login(username, password);
    if (!response) {
      throw new Error('Invalid login response');
    }
    console.log('Logging in');
    dispatch({type: SIGN_IN, payload: response});
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out action creator - Clears all related states
 * @returns {(function(*): void)} Redux thunk action
 */
export const signOut = () => dispatch => {
  dispatch({type: CLEAR_INSPECTION_REVIEWED});
  dispatch({type: CLEAR_INSPECTION_IN_PROGRESS});
  dispatch({type: CLEAR_NEW_INSPECTION});
  dispatch({type: SIGN_OUT});
};

/**
 * Session expired action creator
 * @returns {{type: string}} Redux action
 */
export const sessionExpired = () => ({
  type: SESSION_EXPIRED,
});
