import {Types} from '../Types';

const {DEVICE_CONNECTED, DEVICE_DISCONNECTED, TRIP} = Types;

export const setDevice = device => dispatch =>
  dispatch({type: DEVICE_CONNECTED, payload: device});

export const setDeviceTrip = trip => dispatch =>
  dispatch({type: TRIP, payload: trip});

export const clearDevice = () => dispatch =>
  dispatch({type: DEVICE_DISCONNECTED});
