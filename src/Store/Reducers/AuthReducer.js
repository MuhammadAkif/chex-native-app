import {Types} from '../Types';

const initialState = {
  user: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SIGN_IN:
      return (state.user = action.payload);
    case Types.SIGN_OUT:
      return (state = initialState);
    default:
      return state;
  }
};

export default authReducer;
