import {Types} from '../Types';

const {SIGN_IN, SIGN_OUT, SESSION_EXPIRED} = Types;
const initialState = {
  user: {token: null},
  sessionExpired: false,
};

/**
 *
 * @param state
 * @param action
 * @returns {{sessionExpired: boolean, user: {token: null}}|{sessionExpired: boolean, user: {token: null}}|{sessionExpired: boolean, user}}
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
    case SESSION_EXPIRED:
      return {...state, sessionExpired: true};
    default:
      return state;
  }
};

export default authReducer;
