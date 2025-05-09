import {Types} from '../Types';

const {DEVICE_CONNECTED, DEVICE_DISCONNECTED, TRIP, COMMENT, TRIPS_LIST} =
  Types;

export const setDevice = device => dispatch =>
  dispatch({type: DEVICE_CONNECTED, payload: device});

export const setDeviceTrip = trip => dispatch =>
  dispatch({type: TRIP, payload: trip});

export const setComment = comment => dispatch =>
  dispatch({type: COMMENT, payload: comment});

export const setTripsList = tripsList => dispatch =>
  dispatch({type: TRIPS_LIST, payload: tripsList});

export const clearDevice = () => dispatch =>
  dispatch({type: DEVICE_DISCONNECTED});
