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

/*export const signIn = (username, password) => async dispatch => {
  await login(username, password)
    .then(res => dispatch({type: SIGN_IN, payload: res}))
    .catch(error => {
      throw error;
    });
};*/
export const signIn = user => ({type: SIGN_IN, payload: user});

export const signOut = () => {
  return dispatch => {
    dispatch({type: CLEAR_INSPECTION_REVIEWED});
    dispatch({type: CLEAR_INSPECTION_IN_PROGRESS});
    dispatch({type: CLEAR_NEW_INSPECTION});
    dispatch({type: SIGN_OUT});
  };
};
export const sessionExpired = () => ({
  type: SESSION_EXPIRED,
});
