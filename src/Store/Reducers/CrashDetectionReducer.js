import {Types} from '../Types';

const {
  ADD_CRASH_EVENT,
  ADD_THRESHOLD_EVENT,
  UPDATE_CRASH_CONFIG,
  CLEAR_CRASH_EVENTS,
} = Types;

const initialState = {
  crashEvents: [], // List of crash data events
  thresholdEvents: [], // List of threshold events
  config: {
    averagingWindowSize: 5,
    thresholdXy: 500,
    thresholdXyz: 1300,
    surpassingThresholds: 2,
  },
};

const crashDetectionReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_CRASH_EVENT:
      return {
        ...state,
        crashEvents: [...state.crashEvents, payload].sort(
          (a, b) => b.timestamp - a.timestamp,
        ),
      };

    case ADD_THRESHOLD_EVENT:
      return {
        ...state,
        thresholdEvents: [...state.thresholdEvents, payload].sort(
          (a, b) => b.timestampUnixMs - a.timestampUnixMs,
        ),
      };

    case UPDATE_CRASH_CONFIG:
      return {
        ...state,
        config: {
          ...state.config,
          ...payload,
        },
      };

    case CLEAR_CRASH_EVENTS:
      return {
        ...state,
        crashEvents: [],
        thresholdEvents: [],
      };

    default:
      return state;
  }
};

export default crashDetectionReducer; 