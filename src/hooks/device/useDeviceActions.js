import {useDispatch} from 'react-redux';
import {useCallback} from 'react';

import {
  setDevice,
  clearDevice,
  setDeviceTrip,
  setComment,
  setTripsList,
  setNewTrip,
  clearTrip,
  setVehicleID,
  setUserDeviceDetails,
  setUserStartTripDetails,
} from '../../Store/Actions';

/**
 * Custom hook that provides dispatchable actions for managing the connected device state.
 *
 * @returns {object} Device action dispatchers.
 */
const useDeviceActions = () => {
  const dispatch = useDispatch();

  return {
    /**
     * Sets the current connected device.
     *
     * @param {object} device - The device object received from the scanner.
     */
    setDevice: useCallback(
      device => {
        dispatch(setDevice(device));
      },
      [dispatch],
    ),

    /**
     * Sets the current connected device.
     *
     * @param {object} trip - The device object received from the scanner.
     */
    setDeviceTrip: useCallback(
      trip => {
        dispatch(setDeviceTrip(trip));
      },
      [dispatch],
    ),

    /**
     * Sets the current trip comment.
     *
     * @param {object} comment - The comment of the current trip.
     */
    setComment: useCallback(
      comment => {
        dispatch(setComment(comment));
      },
      [dispatch],
    ),

    /**
     * Sets the current trip comment.
     *
     * @param {object} comment - The comment of the current trip.
     */
    setTripsList: useCallback(
      tripsList => {
        dispatch(setTripsList(tripsList || []));
      },
      [dispatch],
    ),

    /**
     * Add the new trip to the list.
     *
     * @param {object} newTrip - The Completed trip.
     */
    setNewTrip: useCallback(
      tripsList => {
        dispatch(setNewTrip(tripsList || []));
      },
      [dispatch],
    ),

    /**
     * Clears the ongoing trip.
     */
    clearTrip: useCallback(() => {
      dispatch(clearTrip());
    }, [dispatch]),

    /**
     * Sets the vehicle id.
     */
    setVehicleID: useCallback(id => dispatch(setVehicleID(id)), [dispatch]),

    /**
     * Sets the vehicle id.
     */
    setUserDeviceDetails: useCallback(
      device => {
        dispatch(setUserDeviceDetails(device));
      },
      [dispatch],
    ),

    /**
     * Sets the vehicle id.
     */
    setUserStartTripDetails: useCallback(
      trip => {
        dispatch(setUserStartTripDetails(trip));
      },
      [dispatch],
    ),

    /**
     * Clears the current connected device (used on disconnect or cleanup).
     */
    clearDevice: useCallback(() => {
      dispatch(clearDevice());
    }, [dispatch]),
  };
};

export default useDeviceActions;
