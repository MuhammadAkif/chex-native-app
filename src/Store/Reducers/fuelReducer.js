import { Types } from '../Types';

const {
  FETCH_FUEL_EVENT,
  SET_FUEL_LOADING,
  SET_FUEL_ERROR,
  CLEAR_FUEL_EVENT,
  FETCH_FUEL_VEHICLES,
  SET_FUEL_VEHICLES_LOADING,
  FETCH_RECENT_FUEL_EVENTS,
  FETCH_FUEL_EVENT_METRICS,
} = Types;

const initialState = {
  fuelEvent: null,
  loading: false,
  error: null,
  vehicles: [],
  vehiclesLoading: false,
  recentFuelEvents: [],
  fuelEventMetrics: null,
};

const fuelReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_FUEL_LOADING:
      return { ...state, loading: payload, error: null };

    case FETCH_FUEL_EVENT:
      return { ...state, fuelEvent: payload };

    case SET_FUEL_ERROR:
      return { ...state, error: payload };

    case FETCH_FUEL_VEHICLES:
      return { ...state, vehicles: payload };

    case SET_FUEL_VEHICLES_LOADING:
      return { ...state, vehiclesLoading: payload };

    case FETCH_RECENT_FUEL_EVENTS:
      return { ...state, recentFuelEvents: payload };

    case FETCH_FUEL_EVENT_METRICS:
      return { ...state, fuelEventMetrics: payload };

    case CLEAR_FUEL_EVENT:
      return initialState;

    default:
      return state;
  }
};

export default fuelReducer;
