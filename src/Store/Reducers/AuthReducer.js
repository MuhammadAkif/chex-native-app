import {Types} from '../Types';

const {SIGN_IN, SIGN_OUT, SESSION_EXPIRED, USER_VEHICLES} = Types;

const initialState = {
  user: {token: null, vehicles: []}, // User information (null token when not authenticated)
  sessionExpired: false, // Flag indicating whether the user's session has expired
};

/**
 * Reducer function to handle authentication-related actions and manage auth state.
 *
 * This reducer updates the authentication state based on the dispatched action type.
 * It manages:
 * - The `user` object that contains authentication-related data (e.g., token)
 * - The `sessionExpired` flag, which tracks if the user's session is still valid.
 *
 * Business Rules:
 * - `SIGN_IN`: Updates the state with the user data and resets `sessionExpired` to `false`.
 * - `SIGN_OUT`: Resets the state to its initial state, effectively logging the user out.
 * - `SESSION_EXPIRED`: Marks the session as expired, setting `sessionExpired` to `true` to indicate that user needs to re-authenticate.
 *
 * @param {Object} state - The current state of the authentication reducer.
 * @param {Object} action - The action dispatched containing the type and optional payload.
 * @returns {Object} The new state based on the action type.
 */
const authReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SIGN_IN:
      return {
        user: payload,
        sessionExpired: false,
      };

    case SIGN_OUT:
      return initialState;

    case USER_VEHICLES:
      return {...state, user: {...state.user, vehicles: payload}};

    case SESSION_EXPIRED:
      return {...state, sessionExpired: true};

    default:
      return state;
  }
};

export default authReducer;
