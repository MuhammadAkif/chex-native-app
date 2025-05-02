import {Types} from '../Types';
const {
  ADD_CRASH_DATA,
  UPDATE_CRASH_STATUS,
  ADD_THRESHOLD_EVENT,
  UPDATE_CRASH_CONFIG,
  SET_CRASH_ERROR,
  CLEAR_CRASH_EVENTS,
} = Types;
export const addCrashData = crashData => ({
  type: ADD_CRASH_DATA,
  payload: {
    ...crashData,
    timestamp: Date.now(),
  },
});

export const updateCrashStatus = status => ({
  type: UPDATE_CRASH_STATUS,
  payload: status,
});

export const addThresholdEvent = event => ({
  type: ADD_THRESHOLD_EVENT,
  payload: {
    ...event,
    timestampUnixMs: event.timestampUnixMs || Date.now(),
  },
});

export const updateCrashConfig = config => ({
  type: UPDATE_CRASH_CONFIG,
  payload: config,
});

export const setCrashError = error => ({
  type: SET_CRASH_ERROR,
  payload: error,
});

export const clearCrashEvents = () => ({
  type: CLEAR_CRASH_EVENTS,
});
