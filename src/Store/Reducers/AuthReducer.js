import {Types} from '../Types';

const initialState = {
  user: {},
  sessionExpired: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SIGN_IN:
      return {
        ...state,
        user: action.payload,
        sessionExpired: false,
      };
    case Types.SIGN_OUT:
      return (state = initialState);
    case Types.SESSION_EXPIRED:
      return {...state, sessionExpired: true};
    default:
      return state;
  }
};

export default authReducer;
