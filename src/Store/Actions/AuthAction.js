import {Types} from '../Types';

const {
  SIGN_IN,
  CLEAR_INSPECTION_REVIEWED,
  CLEAR_INSPECTION_IN_PROGRESS,
  CLEAR_NEW_INSPECTION,
  SIGN_OUT,
} = Types;

export const signIn = user => {
  return dispatch => {
    dispatch({type: SIGN_IN, payload: user});
  };
};
export const signOut = () => {
  return dispatch => {
    dispatch({type: CLEAR_INSPECTION_REVIEWED});
    dispatch({type: CLEAR_INSPECTION_IN_PROGRESS});
    dispatch({type: CLEAR_NEW_INSPECTION});
    dispatch({type: SIGN_OUT});
  };
};
