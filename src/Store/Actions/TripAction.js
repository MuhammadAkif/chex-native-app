import {Types} from '../Types';
import { createTrip, endTrip as endTripApi, getUserTrips } from '../../services/tripApi';
import { getNearbyPopulatedPlace } from '../../services/geonames';

const {
  START_TRIP,
  END_TRIP,
  PAUSE_TRIP,
  RESUME_TRIP,
  ADD_LOCATION,
  SET_TRACKING_STATUS,
  RESTORE_TRIP,
  CLEAR_TRIP,
  ADD_COMMENT,
  SET_START_LOCATION,
} = Types;

// Async Action Creators using redux-thunk
export const startTripAsync = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const userId = state.auth.user?.data?.id;
      let lat = null;
      let lng = null;
      // Use startLocation if available, else fallback to locations[0]
      if (state.trip.startLocation && state.trip.startLocation.latitude && state.trip.startLocation.longitude) {
        lat = state.trip.startLocation.latitude;
        lng = state.trip.startLocation.longitude;
      } else if (state.trip.locations && state.trip.locations.length > 0) {
        lat = state.trip.locations[0].latitude;
        lng = state.trip.locations[0].longitude;
      }
      // If not available, fallback to 0 (or you can require it as an argument)
      if (lat == null || lng == null) {
        lat = 0;
        lng = 0;
      }
      const startTime = Date.now();

      // Start Location Name
      const res = await getNearbyPopulatedPlace(lat, lng);
      const locationName = res?.data?.geonames?.[0]?.name || 'Unknown';

      // Call the API
      const response = await createTrip({ userId, lat, lng, startTime, location: locationName});
      const tripId = response?.data?.id;
      dispatch(startTrip({ tripId, startTime }));
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to start trip:', error);
      return Promise.reject(error);
    }
  };
};

export const endTripAsync = (tripData) => {
  return async (dispatch, getState) => {
    try {      

      // Call the API
      if (tripData?.lat && tripData?.lng && tripData?.endTime) {
       console.log('END TRIP BODY: ', tripData)
      await endTripApi(tripData);
    }

      dispatch(endTrip({ endTime: tripData?.endTime }));
      dispatch(clearTrip());
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to end trip:', error);
      return Promise.reject(error);
    }
  };
};

export const fetchUserTripsAsync = (setTrips, setIsLoading) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const userId = state.auth.user?.data?.id;
      setIsLoading(true)
      const response = await getUserTrips(userId);
      setIsLoading(false)
      const trips = response?.data || [];
      setTrips(trips)
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to fetch user trips:', error);
      return Promise.reject(error);
    }
  };
};

export const startTrip = payload => ({
  type: START_TRIP,
  payload,
});

export const endTrip = payload => ({
  type: END_TRIP,
  payload,
});

export const pauseTrip = () => ({
  type: PAUSE_TRIP,
  payload: {pausedTime: Date.now()},
});

export const resumeTrip = () => ({
  type: RESUME_TRIP,
});

export const addLocation = payload => ({
  type: ADD_LOCATION,
  payload,
});

export const setTrackingStatus = payload => ({
  type: SET_TRACKING_STATUS,
  payload,
});

export const restoreTrip = payload => ({
  type: RESTORE_TRIP,
  payload,
});

export const clearTrip = () => ({
  type: CLEAR_TRIP,
});

export const addComment = payload => ({
  type: ADD_COMMENT,
  payload, // { text, timestamp }
});

export const setStartLocation = (location) => ({
  type: SET_START_LOCATION,
  payload: location,
});
