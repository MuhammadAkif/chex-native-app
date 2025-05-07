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
      },
    },
    tripStatus: 'Not Started',
    distance: null,
    averageSpeed: null,
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
      },
    },
  },
};

const {DEVICE_CONNECTED, DEVICE_DISCONNECTED, TRIP} = Types;

const deviceReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case DEVICE_CONNECTED:
      return payload;

    case TRIP:
      return {
        ...state,
        trip: payload,
      };

    case DEVICE_DISCONNECTED:
      return initialState;

    default:
      return state;
  }
};

export default deviceReducer;
