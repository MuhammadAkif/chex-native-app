import {useEffect, useState, useRef, useCallback} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import {Platforms} from '../../Constants';
import {err} from 'react-native-svg/lib/typescript/xml';

const {OS} = Platform;
const {ANDROID} = Platforms;

/**
 * Custom hook to get and watch the user's geolocation.
 * Handles permissions, loading, error states, and continuous updates.
 *
 * @returns {{
 *   location: object|null,
 *   error: string|null,
 *   loading: boolean,
 *   permissionGranted: boolean
 * }}
 */
const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const watchId = useRef(null);

  /**
   * Requests location permission based on the platform.
   * Android requires runtime permissions while iOS handles it internally.
   *
   * @returns {Promise<boolean>} - Returns true if permission is granted.
   * @throws {Error} - Throws if Android permission request fails.
   */
  const requestLocationPermission = useCallback(async () => {
    if (OS === ANDROID) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        // TODO: Handle specific Android error codes if needed
        throw new Error('Permission request failed');
      }
    } else {
      // iOS: uses Info.plist and system UI for permission
      Geolocation.requestAuthorization();
      return true;
    }
  }, []);

  /**
   * Fetches the current device location once.
   *
   * @param {Function} setLocation - Setter for updating location state.
   * @param {Function} setError - Setter for capturing error messages.
   * @param {Function} setLoading - Setter to indicate loading state.
   */
  const getCurrentLocation = useCallback((onSuccess, onError) => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        setLoading(false);
        onSuccess(position);
      },
      error => {
        // TODO: Consider mapping error codes to user-friendly messages
        setError(error.message || 'Error getting location');
        setLoading(false);
        onError(error);
      },
      {
        enableHighAccuracy: true, // Prioritize GPS over network for better precision
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  /**
   * Starts watching the user's position continuously.
   *
   * @param {Function} setLocation - Setter for location updates.
   * @param {Function} setError - Setter for capturing errors during watch.
   * @returns {number} - Watch ID for use in cleanup.
   */
  const startWatchingPosition = useCallback(() => {
    const id = Geolocation.watchPosition(
      position => {
        setLocation(position);
      },
      error => {
        setError(error.message || 'Error watching location');
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0, // Notify on any location change
      },
    );

    return id;
  }, []);

  /**
   * Clears an active location watch using the given watch ID.
   *
   * @param {number|null} watchId - The ID of the active watch.
   */
  const clearWatch = useCallback(watchId => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
    }
  }, []);

  /**
   * Initializes geolocation logic:
   * - Requests permission
   * - Fetches initial location
   * - Starts watching for changes
   */
  const checkPermissionOnly = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      setPermissionGranted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPermissionOnly().then();

    return () => {
      clearWatch(watchId.current);
    };
  }, [checkPermissionOnly, clearWatch]);

  return {
    location,
    error,
    loading,
    permissionGranted,
    requestLocationPermission,
    getCurrentLocation,
    startWatchingPosition,
  };
};

export default useGeolocation;

/*
import {useCallback, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';

const config = {
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
};

const useLocation = () => {
  const locationConfig = useCallback(() => {
    Geolocation.setRNConfiguration(config);
  }, []);

  useEffect(() => {
    locationConfig();
  }, [locationConfig]);

  /!*position: {
    coords: {
      latitude,
        longitude,
        altitude,
        accuracy,
        altitudeAccuracy,
        heading,
        speed,
    },
    timestamp,
  }*!/

  const getCurrentPosition = useCallback(() => {
    Geolocation.getCurrentPosition(position => {
      const {
        coords: {
          latitude,
          longitude,
          altitude,
          accuracy,
          altitudeAccuracy,
          heading,
          speed,
        },
        timestamp,
      } = position;
      console.log(position);
    });
  }, []);

  const requestLocationPermission = useCallback(() => {
    Geolocation.requestAuthorization(
      () => {},
      ({code, message, PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT}) =>
        console.log(code, message),
    );
  }, []);

  return {requestLocationPermission, getCurrentPosition};
};

export default useLocation;
*/
