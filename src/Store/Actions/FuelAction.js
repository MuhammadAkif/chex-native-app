import { getRegisteredVehicles } from '../../services/inspection';
import { getFuelEvent, updateFuelEvent as updateFuelEventService } from '../../services/fuel';
import { Types } from '../Types';

const {
  FETCH_FUEL_EVENT,
  FETCH_FUEL_VEHICLES,
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
    return response;
  } catch (error) {
    console.error('Update fuel event action error:', error);
    throw error;
  }
};

export const clearFuelEvent = () => ({ type: Types.CLEAR_FUEL_EVENT });
