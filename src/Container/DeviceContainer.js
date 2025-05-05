import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {DeviceScreen} from '../Screens';
import {useDeviceState} from '../hooks/device';
import {useSafetyTagInitializer} from '../hooks';
import {format12HourTime, getElapsedTime} from '../Utils/helpers';

const DeviceContainer = () => {
  const {
    deviceAddress = 'N/A',
    isConnected,
    batteryHealth = 'N/A',
    trip,
  } = useDeviceState();
  const {disconnectDevice} = useSafetyTagInitializer();
  const [deviceState, setDeviceState] = useState({});

  useFocusEffect(
    useCallback(() => {
      if (!trip?.tripStart?.timestampUnixMs) {
        return;
      }
      setDeviceState(prevState => ({
        ...prevState,
        trip: {
          ...prevState.trip,
          duration: getElapsedTime(trip?.tripStart?.timestampUnixMs) || 'N/A',
          startTime:
            format12HourTime(trip?.tripStart?.timestampUnixMs) || 'N/A',
        },
      }));
    }, [trip?.tripStart?.timestampUnixMs]),
  );

  return (
    <DeviceScreen
      isConnected={isConnected}
      deviceTag={deviceAddress}
      batteryHealth={batteryHealth}
      handleDisconnect={disconnectDevice}
      duration={deviceState?.trip?.duration}
      startTime={deviceState?.trip?.startTime}
    />
  );
};
export default DeviceContainer;
