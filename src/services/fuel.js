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

export const updateFuelEvent = async (id, body) => {
  const endPoint = generateApiUrl(`fuelguard/events/${id}`);
  try {
    return await api.patch(endPoint, body);
  } catch (error) {
    console.error('Update fuel event error:', error);
    throw error;
  }
};
