import { generateApiUrl } from '../Constants';
import api from './api';

export const getFuelEvent = async body => {
  const endPoint = generateApiUrl('fuelguard/events');
  try {
    return await api.post(endPoint, body);
  } catch (error) {
    console.error('Get fuel event error:', error);
    throw error;
  }
};

export const getRecentFuelEvents = async () => {
  const endPoint = generateApiUrl('fuelguard/events');
  try {
    console.log('endPoint /////', endPoint);
    return await api.get(endPoint);
  } catch (error) {
    console.error('Get recent fuel events error:', error);
    throw error;
  }
};

export const updateFuelEvent = async (id, body) => {
  if (!id) {
    throw new Error('updateFuelEvent requires a valid id');
  }
  const endPoint = generateApiUrl(`fuelguard/events/${id}`);
  try {
    return await api.patch(endPoint, body, { timeout: 30000 });
  } catch (error) {
    console.error('Update fuel event error:', error);
    throw error;
  }
};
