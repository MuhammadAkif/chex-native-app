import {Types} from '../Types';

const initialState = {
  name: 'Unknown',
  advertisementMode: null,
  isBonded: false,
  rssi: null,
  batteryHealth: null,
  deviceAddress: null,
  isConnected: false,
  trip: {
    tripStart: {
      timestampElapsedRealtimeMs: null,
      timestampUnixMs: null,
      duration: null,
      startTime: null,
      position: {
        coords: {
          speed: null,
          heading: null,
          altitude: null,
          accuracy: null,
          longitude: null,
          latitude: null,
        },
        extras: {
          meanCn0: null,
          maxCn0: null,
          satellites: null,
        },
        mocked: false,
        timestamp: null,
        locality: null,
        state: null,
        country: null,
      },
    },
    tripStatus: 'Not Started',
    distance: null,
    averageSpeed: null,
    commentInfo: {
      comment: '',
      time: null,
    },
    tripEnd: {
      timestampElapsedRealtimeMs: null,
      timestampUnixMs: null,
      duration: null,
      endTime: null,
      position: {
        coords: {
          speed: null,
          heading: null,
          altitude: null,
          accuracy: null,
          longitude: null,
          latitude: null,
        },
        extras: {
          meanCn0: null,
          maxCn0: null,
          satellites: null,
        },
        mocked: false,
        timestamp: null,
        locality: null,
        state: null,
        country: null,
      },
    },
  },
  tripsList: [],
  vehicleId: null,
  userDeviceDetails: {},
  userStartTripDetails: {},
};

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

const deviceReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case DEVICE_CONNECTED:
      return {
        ...initialState,
        ...payload,
        userDeviceDetails: state?.userDeviceDetails,
      };

    case USER_DEVICE_DETAILS:
      return {
        ...state,
        userDeviceDetails: payload,
      };

    case USER_START_TRIP_DETAILS:
      return {
        ...state,
        userStartTripDetails: payload,
      };

    case TRIP:
      return {
        ...state,
        trip: payload,
      };

    case COMMENT:
      return {
        ...state,
        trip: {
          ...state.trip,
          commentInfo: payload,
        },
      };

    case CLEAR_TRIP:
      return {
        ...state,
        trip: initialState.trip,
      };

    case INSERT_TRIP:
      return {
        ...state,
        tripsList: [...state.tripsList, state.trip],
      };

    case TRIPS_LIST:
      return {
        ...state,
        tripsList: payload,
      };

    case VEHICLE_ID:
      return {
        ...state,
        vehicleId: payload,
      };

    case DEVICE_DISCONNECTED:
      return initialState;

    default:
      return state;
  }
};

export default deviceReducer;
