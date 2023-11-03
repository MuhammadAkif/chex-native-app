import {Types} from '../Types';

export const SIGN_IN_ACTION = user => {
  return dispatch => {
    dispatch({type: Types.SIGN_IN, payload: user});
  };
};
export const SIGN_OUT_ACTION = () => {
  return dispatch => {
    dispatch({type: Types.CLEAR_INSPECTION_REVIEWED});
    dispatch({type: Types.CLEAR_INSPECTION_IN_PROGRESS});
    dispatch({type: Types.CLEAR_NEW_INSPECTION});
    dispatch({type: Types.SIGN_OUT});
  };
};
