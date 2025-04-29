import {Types} from '../Types';

const {DEVICE_CONNECTED, DEVICE_DISCONNECTED} = Types;

export const set_Device = device => dispatch =>
  dispatch({type: DEVICE_CONNECTED, payload: device});

export const clear_Device = () => dispatch =>
  dispatch({type: DEVICE_DISCONNECTED});
