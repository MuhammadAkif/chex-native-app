import {Types} from '../Types';

const {
  ADD_CRASH_EVENT,
  ADD_THRESHOLD_EVENT,
  UPDATE_CRASH_CONFIG,
  CLEAR_CRASH_EVENTS,
} = Types;

export const addCrashEvent = crashData => ({
  type: ADD_CRASH_EVENT,
  payload: {
    ...crashData,
    timestamp: Date.now(), // Add current timestamp if not present
  },
});

export const addThresholdEvent = thresholdEvent => ({
  type: ADD_THRESHOLD_EVENT,
  payload: {
    ...thresholdEvent,
    timestampUnixMs: thresholdEvent.timestampUnixMs || Date.now(),
  },
});

export const updateCrashConfig = config => ({
  type: UPDATE_CRASH_CONFIG,
  payload: config,
});

export const clearCrashEvents = () => ({
  type: CLEAR_CRASH_EVENTS,
}); 