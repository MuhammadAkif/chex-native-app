import {CrashDataStatus, DEFAULT_CONFIG} from '../../Constants/CrashDetection';
import {Types} from '../Types';

const {COMPLETE_DATA} = CrashDataStatus;

const {
  ADD_CRASH_DATA,
  UPDATE_CRASH_STATUS,
  ADD_THRESHOLD_EVENT,
  UPDATE_CRASH_CONFIG,
  SET_CRASH_ERROR,
  CLEAR_CRASH_EVENTS,
} = Types;

const initialState = {
  crashEvents: {
    data: [],
    status: COMPLETE_DATA,
  },
  thresholdEvents: [],
  config: DEFAULT_CONFIG,
  error: null,
};

const crashDetectionReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_CRASH_DATA:
      return {
        ...state,
        crashEvents: {
          ...state.crashEvents,
          data: [...state.crashEvents.data, payload].sort(
            (a, b) => b.timestamp - a.timestamp,
          ),
        },
        error: null,
      };

    case UPDATE_CRASH_STATUS:
      return {
        ...state,
        crashEvents: {
          ...state.crashEvents,
          status: payload,
        },
      };

    case ADD_THRESHOLD_EVENT:
      return {
        ...state,
        thresholdEvents: [...state.thresholdEvents, payload].sort(
          (a, b) => b.timestampUnixMs - a.timestampUnixMs,
        ),
        error: null,
      };

    case UPDATE_CRASH_CONFIG:
      return {
        ...state,
        config: {
          ...state.config,
          ...payload,
        },
        error: null,
      };

    case SET_CRASH_ERROR:
      return {
        ...state,
        error: payload,
      };

    case CLEAR_CRASH_EVENTS:
      return {
        ...state,
        crashEvents: {
          data: [],
          status: COMPLETE_DATA,
        },
        thresholdEvents: [],
        error: null,
      };

    default:
      return state;
  }
};

export default crashDetectionReducer;
