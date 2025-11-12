import {Types} from '../Types';

const {SIGN_IN, SIGN_OUT, SESSION_EXPIRED, UPDATE_USER} = Types;
const initialState = {
  user: {token: null},
  sessionExpired: false,
};

const authReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SIGN_IN:
      return {
        ...state,
        user: payload,
        sessionExpired: false,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: payload,
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
