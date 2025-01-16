import {Types} from '../Types';

const {SIGN_IN, SIGN_OUT, SESSION_EXPIRED} = Types;

/**
 * @typedef {Object} User
 * @property {string|null} token - Session token from backend
 * @property {string|null} userId - Unique identifier for the user
 * @property {string|null} email - User's email address
 * @property {string[]} roles - User's roles/permissions
 */

/**
 * @typedef {Object} AuthState
 * @property {User} user - User information
 * @property {boolean} sessionExpired - Whether the session has expired
 * @property {boolean} isAuthenticated - Whether the user is authenticated
 */

/** @type {AuthState} */
const initialState = {
  user: {
    token: null,
    userId: null,
    email: null,
    roles: [],
  },
  sessionExpired: false,
  isAuthenticated: false,
};

/**
 * Authentication reducer
 * @param {AuthState} state - Current auth state
 * @param {{type: string, payload: any}} action - Redux action
 * @returns {AuthState} New auth state
 */
const authReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SIGN_IN:
      return {
        user: {
          ...initialState.user,
          ...payload,
        },
        sessionExpired: false,
        isAuthenticated: true,
      };
    case SIGN_OUT:
      return initialState;
    case SESSION_EXPIRED:
      return {
        ...state,
        sessionExpired: true,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authReducer;
