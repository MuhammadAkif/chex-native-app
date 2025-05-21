import {Types} from '../Types';

const {
  DEVICE_CONNECTED,
  DEVICE_DISCONNECTED,
  TRIP,
  COMMENT,
  TRIPS_LIST,
  INSERT_TRIP,
  CLEAR_TRIP,
  VEHICLE_ID,
  USER_DEVICE_DETAILS,
  USER_START_TRIP_DETAILS,
} = Types;

export const setDevice = device => dispatch =>
  dispatch({type: DEVICE_CONNECTED, payload: device});

export const setDeviceTrip = trip => dispatch =>
  dispatch({type: TRIP, payload: trip});

export const setComment = comment => dispatch =>
  dispatch({type: COMMENT, payload: comment});

export const setTripsList = tripsList => dispatch =>
  dispatch({type: TRIPS_LIST, payload: tripsList});

export const setNewTrip = newTrip => dispatch =>
  dispatch({type: INSERT_TRIP, payload: newTrip});

export const setVehicleID = vehicle_id => dispatch =>
  dispatch({type: VEHICLE_ID, payload: vehicle_id});

export const clearTrip = () => dispatch => dispatch({type: CLEAR_TRIP});

export const setUserDeviceDetails = device => dispatch =>
  dispatch({type: USER_DEVICE_DETAILS, payload: device});

export const setUserStartTripDetails = device => dispatch =>
  dispatch({type: USER_START_TRIP_DETAILS, payload: device});

export const clearDevice = () => dispatch =>
  dispatch({type: DEVICE_DISCONNECTED});
