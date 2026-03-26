import {Types} from '../Types';
import {login} from '../../services/authServices';
import {OneSignal} from 'react-native-onesignal';

const {
  SIGN_IN,
  CLEAR_INSPECTION_REVIEWED,
  CLEAR_INSPECTION_IN_PROGRESS,
  CLEAR_NEW_INSPECTION,
  SIGN_OUT,
  SESSION_EXPIRED,
  SET_ODOMETER_MODAL_VISIBLE,
} = Types;

export const signIn = (username, password) => async dispatch => {
  await login(username, password)
    .then(res => {
      try {
        OneSignal.login(String(res?.data?.id));
        dispatch({type: SIGN_IN, payload: res});
      } catch (oneSignalError) {
        console.log('❌ OneSignal login error:', oneSignalError);
      }
    })
    .catch(error => {
      throw error;
    });
};

export const signOut = () => {
  return dispatch => {
    OneSignal.logout();
    dispatch({type: CLEAR_INSPECTION_REVIEWED});
    dispatch({type: CLEAR_INSPECTION_IN_PROGRESS});
    dispatch({type: CLEAR_NEW_INSPECTION});
    dispatch({type: SIGN_OUT});
    dispatch({type: SET_ODOMETER_MODAL_VISIBLE, payload: false});
  };
};
export const sessionExpired = () => ({
  type: SESSION_EXPIRED,
});
