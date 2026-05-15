import { getRegisteredVehicles } from '../../services/inspection';
import {
  getFuelEvent,
  getRecentFuelEvents,
  updateFuelEvent as updateFuelEventService,
} from '../../services/fuel';
import { Types } from '../Types';

const {
  FETCH_FUEL_EVENT,
  FETCH_FUEL_VEHICLES,
  FETCH_RECENT_FUEL_EVENTS,
  FETCH_FUEL_EVENT_METRICS,
} = Types;

export const fetchFuelEvent = body => async dispatch => {
  try {
    const response = await getFuelEvent(body);
    dispatch({ type: FETCH_FUEL_EVENT, payload: response?.data });
    return response;
  } catch (error) {
    console.error('Fetch fuel event error:', error);
    throw error;
  }
};

export const fetchFuelVehicles = () => async dispatch => {
  try {
    const response = await getRegisteredVehicles();
    const vehicles = response?.data?.vehicles || [];
    dispatch({ type: FETCH_FUEL_VEHICLES, payload: vehicles });
    return vehicles;
  } catch (error) {
    console.error('Fetch fuel vehicles error:', error);
    throw error;
  }
};

export const updateFuelEvent = (id, body) => async dispatch => {
  try {
    const response = await updateFuelEventService(id, body);
    dispatch({ type: FETCH_FUEL_EVENT, payload: response?.data });
    console.log('response', response);
    return response;
  } catch (error) {
    console.error('Update fuel event action error:', error);
    return error;
  }
};

export const recentFuelEvents = () => async dispatch => {
  try {
    const response = await getRecentFuelEvents();
    const recentEvents = response?.data;
    console.log('recentEvents /////', recentEvents);
    dispatch({ type: FETCH_RECENT_FUEL_EVENTS, payload: response?.data?.events || [] });
    dispatch({ type: FETCH_FUEL_EVENT_METRICS, payload: response?.data?.fuelEventMetrics || null });
    return recentEvents;
  } catch (error) {
    console.error('Recent fuel events action error:', error);
    throw error;
  }
};

export const clearFuelEvent = () => ({ type: Types.CLEAR_FUEL_EVENT });
