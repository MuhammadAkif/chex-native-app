import {calculateDistance} from '../../Utils/helpers';
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
} = Types;

const initialState = {
  isActive: false,
  tripId: null,
  startTime: null,
  endTime: null,
  locations: [],
  totalDistance: 0,
  isTracking: false,
  pausedTime: 0,
  isPaused: false,
  startLocation: null,
  endLocation: null,
  comments: [],
  trips: [], // <-- Add this
};

const tripReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_TRIP:
      return {
        ...state,
        isActive: true,
        tripId: action.payload.tripId,
        startTime: action.payload.startTime,
        endTime: null,
        locations: [],
        totalDistance: 0,
        isTracking: true,
        pausedTime: 0,
        isPaused: false,
        startLocation: null,
        endLocation: null,
        comments: [],
      };

    case END_TRIP:
      return {
        ...state,
        isActive: false,
        endTime: action.payload.endTime,
        isTracking: false,
        isPaused: false,
        endLocation: state.locations.length > 0 ? state.locations[state.locations.length - 1] : null,
      };

    case PAUSE_TRIP:
      return {
        ...state,
        isPaused: true,
        isTracking: false,
        pausedTime: action.payload.pausedTime,
      };

    case RESUME_TRIP:
      return {
        ...state,
        isPaused: false,
        isTracking: true,
      };

    case ADD_LOCATION:
      const newLocations = [...state.locations, action.payload];
      let newDistance = state.totalDistance;
      let startLocation = state.startLocation;
      // Set startLocation if this is the first location
      if (!startLocation && newLocations.length > 0) {
        startLocation = newLocations[0];
      }
      // Calculate distance if we have previous location and trip is not paused
      if (newLocations.length > 1 && !state.isPaused) {
        const prevLocation = newLocations[newLocations.length - 2];
        const distance = calculateDistance(
          prevLocation.latitude,
          prevLocation.longitude,
          action.payload.latitude,
          action.payload.longitude,
        );
        newDistance += distance;
      }
      return {
        ...state,
        locations: newLocations,
        totalDistance: newDistance,
        startLocation,
      };

    case SET_TRACKING_STATUS:
      return {
        ...state,
        isTracking: action.payload,
      };

    case RESTORE_TRIP:
      return {
        ...action.payload,
      };

    case CLEAR_TRIP:
      return initialState;

    case ADD_COMMENT:
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    case 'ADD_TRIP_HISTORY':
      return {
        ...state,
        trips: [...state.trips, action.payload],
      };
    default:
      return state;
  }
};

export default tripReducer;
