import api from './api';
import {API_ENDPOINTS, generateApiUrl} from '../Constants';

const {DEVICE_ASSIGN_URL, UPDATE_TRIP_LIST} = API_ENDPOINTS;

export const deviceAssign = async (deviceId, userId) => {
  const body = {
    deviceId,
    userId,
  };
  try {
    return await api.post(DEVICE_ASSIGN_URL, body);
  } catch (error) {
    console.error('Device Assign error:', error);
    throw error;
  }
};

export const setTripsListInDB = async (deviceId, userId, tripList) => {
  const body = {userId, deviceId, tripList};
  try {
    return await api.put(UPDATE_TRIP_LIST, body);
  } catch (error) {
    console.error('Device Assign error:', error);
    throw error;
  }
};

export const getTripsListInDB = async deviceId => {
  const getTripListApi = generateApiUrl(`device/${deviceId}/tripList`);

  try {
    return await api.put(getTripListApi);
  } catch (error) {
    console.error('Device Assign error:', error);
    throw error;
  }
};
