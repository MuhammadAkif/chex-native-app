import api from './api';
import { API_ENDPOINTS } from '../Constants';

/**
 * Creates a new trip on the server.
 * @param {Object} params
 * @param {number|string} params.userId - The user ID (from authReducer.user?._id)
 * @param {number} params.lat - Starting latitude
 * @param {number} params.lng - Starting longitude
 * @param {string} params.startTime - Start time in ISO or server format (e.g., '2025-07-08 12:11:04.263+00')
 * @returns {Promise<Object>} The created trip object from the server
 */
export const createTrip = async (tripData) => {
 console.log("START TRIP BODY:", tripData )
  try {
    return await api.post(API_ENDPOINTS.CREATE_TRIP, tripData);
  } catch (error) {
    console.error('Create trip error:', error.response.data);
    throw error;
  }
};

/**
 * Ends a trip on the server.
 * @param {Object} params
 * @param {number|string} params.id - Trip ID
 * @param {number} params.lat - Ending latitude
 * @param {number} params.lng - Ending longitude
 * @param {string} params.endTime - End time in ISO or server format
 * @param {number} params.avgSpeed - Average speed
 * @param {number} params.duration - Duration in seconds or ms (as required by backend)
 * @param {number} params.distance - Total distance
 * @returns {Promise<Object>} The server response
 */
export const endTrip = async (tripData) => {
  try {
    return await api.put(API_ENDPOINTS.END_TRIP, tripData);
  } catch (error) {
    console.error('End trip error:', error.response.data);
    throw error;
  }
};

/**
 * Fetches all trips for a user from the server.
 * @param {number|string} userId - The user ID (from authReducer.user?._id)
 * @returns {Promise<Array>} Array of trip objects
 */
export const getUserTrips = async (userId) => {
  try {
    // If userId is required as a query param, append it; otherwise, just call the endpoint
    // Example: `${API_ENDPOINTS.USER_TRIPS}?userId=${userId}`
    return await api.get(API_ENDPOINTS.TRIP_HISTORY);
  } catch (error) {
    console.error('Get user trips error:', error?.response?.data);
    throw error;
  }
};

export const addTripComment = (id, comment) => {
  try {
    return api.put(API_ENDPOINTS.ADD_TRIP_COMMENT, { id, comment });
  } catch (error) {
    throw error;
  }
}; 