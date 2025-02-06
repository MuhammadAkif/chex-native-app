import {useEffect, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';

const SPEED_STATES = {
  TOO_SLOW: 'tooSlow',
  TOO_FAST: 'tooFast',
  OK: 'ok',
};

const useVehicleStateDetector = () => {
  const [vehicleState, setVehicleState] = useState({
    validVehicleState: false,
    validVehicleStateIntervals: [],
    speed: null,
    lastSpeedChange: 0,
    speedValue: null,
  });

  const [speedStatus, setSpeedStatus] = useState({
    message: 'Vehicle speed not in valid range',
    isValid: false,
  });

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'vehicleState',
      (event) => {
        console.log('Vehicle State Update:', event);
        setVehicleState(event);
        
        // Update speed status message
        let message = '';
        let isValid = false;
        
        if (!event.speed) {
          message = 'Waiting for speed data...';
        } else {
          switch (event.speed) {
            case SPEED_STATES.TOO_SLOW:
              message = 'Vehicle speed too low. Please accelerate.';
              break;
            case SPEED_STATES.TOO_FAST:
              message = 'Vehicle speed too high. Please slow down.';
              break;
            case SPEED_STATES.OK:
              message = 'Vehicle speed in valid range';
              isValid = true;
              break;
            default:
              message = 'Invalid speed state';
          }
        }

        setSpeedStatus({message, isValid});
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const getSpeedInKmh = (speedInMs) => {
    if (speedInMs === null || speedInMs === undefined) return null;
    return (speedInMs * 3.6).toFixed(1); // Convert m/s to km/h
  };

  const getSpeedRangeText = () => {
    return 'Valid speed range: 10-80 km/h';
  };

  const getVehicleStateText = () => {
    if (!vehicleState.validVehicleState) {
      return 'Vehicle not in valid state for alignment';
    }

    const speed = getSpeedInKmh(vehicleState.speedValue);
    return `Vehicle in valid state - Speed: ${speed} km/h`;
  };

  return {
    vehicleState,
    speedStatus,
    getSpeedInKmh,
    getSpeedRangeText,
    getVehicleStateText,
  };
};

export default useVehicleStateDetector; 