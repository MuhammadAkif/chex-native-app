import {Types} from '../Types';

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
  ADD_TRIP_HISTORY,
  CLEAR_TRIP_HISTORY
} = Types;

// Async Action Creators using redux-thunk
export const startTripAsync = tripId => {
  return async (dispatch, getState) => {
    try {
      const startTime = Date.now();
      dispatch(startTrip({tripId, startTime}));

      // You can add API calls here to sync with backend
      // await API.startTrip({ tripId, startTime });

      return Promise.resolve();
    } catch (error) {
      console.error('Failed to start trip:', error);
      return Promise.reject(error);
    }
  };
};

export const endTripAsync = () => {
  return async (dispatch, getState) => {
    try {
      const endTime = Date.now();
      const tripState = getState().trip;

      dispatch(endTrip({endTime}));

      // You can add API calls here to sync with backend
      // await API.endTrip({
      //   tripId: tripState.tripId,
      //   endTime,
      //   locations: tripState.locations,
      //   totalDistance: tripState.totalDistance
      // });

      return Promise.resolve();
    } catch (error) {
      console.error('Failed to end trip:', error);
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

export const clearTripHistory = () => ({
  type: CLEAR_TRIP_HISTORY,
});

export const addComment = payload => ({
  type: ADD_COMMENT,
  payload, // { text, timestamp }
});

export const addTripHistory = payload => ({
  type: ADD_TRIP_HISTORY,
  payload, // trip object
});
