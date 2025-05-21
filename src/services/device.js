import api from './api';
import {API_ENDPOINTS, generateApiUrl} from '../Constants';

const {
  DEVICE_ASSIGN_URL,
  UPDATE_TRIP_LIST_URL,
  VEHICLE_LIST_URL,
  ADD_COMMENT_URL,
  DISCONNECT_DEVICE_URL,
  TRIP_START_URL,
  UPDATE_TRIP_URL,
} = API_ENDPOINTS;

export const connectDevice = async (vehicleId = null, deviceAddress = '') => {
  const body = {
    vehicleId,
    deviceAddress,
  };
  try {
    return await api.post(DEVICE_ASSIGN_URL, body);
  } catch (error) {
    console.error('Device Assign error:', error);
    throw error;
  }
};

export const setCommentAPI = async (tripId = null, comment = '') => {
  const body = {
    tripId,
    comment,
  };
  try {
    return await api.post(ADD_COMMENT_URL, body);
  } catch (error) {
    console.error('Device Assign error:', error);
    throw error;
  }
};

export const setStartTrip = async (
  duration = null,
  distance = null,
  deviceId = null,
  speed = null,
  startTime = null,
  startPoint = null,
) => {
  const body = {
    duration,
    distance,
    deviceId,
    speed,
    startTime,
    startPoint,
  };
  try {
    return await api.post(TRIP_START_URL, body);
  } catch (error) {
    console.error('Setting trips in database error:', error);
    throw error;
  }
};

export const updateTrip = async (
  tripId = null,
  duration = null,
  distance = null,
  speed = null,
  completeStatus = null,
  endTime = null,
  endPoint = null,
) => {
  const body = {
    tripId,
    duration,
    distance,
    speed,
    completeStatus,
    endTime,
    endPoint,
  };
  try {
    return await api.put(UPDATE_TRIP_URL, body);
  } catch (error) {
    console.error('Setting trips in database error:', error);
    throw error;
  }
};

export const setTripsListInDB = async (deviceId, userId, tripList) => {
  const body = {userId, deviceId, tripList};
  try {
    return await api.put(UPDATE_TRIP_LIST_URL, body);
  } catch (error) {
    console.error('Setting trips in database error:', error);
    throw error;
  }
};

export const getTripsList = async deviceId => {
  // const getTripListApi = generateApiUrl(`device/${deviceId}/tripList`);
  const getTripListApi = generateApiUrl(`trips?deviceId=${deviceId}`);
  try {
    return await api.get(getTripListApi);
  } catch (error) {
    console.error('Getting trips error:', error);
    throw error;
  }
};

export const disconnectDeviceAPI = async deviceId => {
  try {
    return await api.get(`${DISCONNECT_DEVICE_URL}?deviceId=${deviceId}`);
  } catch (error) {
    console.error('Device disconnection error:', error);
    throw error;
  }
};

export const getUserVehiclesList = async () => {
  try {
    return await api.get(VEHICLE_LIST_URL);
  } catch (error) {
    console.error('Getting trips error:', error);
    throw error;
  }
};
