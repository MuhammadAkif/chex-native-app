import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {DeviceScreen} from '../Screens';
import {useDeviceState} from '../hooks/device';
import {useSafetyTagInitializer} from '../hooks';
import {
  convertSpeedToKmh,
  format12HourTime,
  getElapsedTime,
  withDefault,
} from '../Utils/helpers';

const DeviceContainer = () => {
  const {
    deviceAddress = '-',
    isConnected,
    batteryHealth = '-',
    trip,
  } = useDeviceState();
  const {disconnectDevice, startDeviceScanning} = useSafetyTagInitializer();
  const [deviceState, setDeviceState] = useState({});
  const deviceBatteryHealth = batteryHealth ? `${batteryHealth}%` : '-';

  useEffect(() => {
    if (!isConnected) {
      setDeviceState({});
    }
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      if (!trip?.tripStart?.timestampUnixMs) {
        return;
      }
      const tripParams = setTripParams();
      setDeviceState(prevState => ({
        ...prevState,
        trip: {
          ...prevState.trip,
          ...tripParams,
        },
      }));
    }, [trip?.tripStart?.timestampUnixMs]),
  );

  function setTripParams() {
    const {
      tripStart: {
        timestampUnixMs = '-',
        position: {
          coords: {speed = '-'},
        },
      },
    } = trip || {};

    let avgSpeed = withDefault(convertSpeedToKmh(speed), '-');
    const duration = withDefault(getElapsedTime(timestampUnixMs), '-');
    const startTime = withDefault(format12HourTime(timestampUnixMs), '-');

    return {
      duration,
      startTime,
      avgSpeed: `${avgSpeed} km/h`,
    };
  }

  const handleViewHistoryPress = () => {};
  const handleAddCommentsPress = () => {};

  return (
    <DeviceScreen
      isConnected={true}
      deviceTag={withDefault(deviceAddress, '-')}
      batteryHealth={deviceBatteryHealth}
      handleDisconnect={disconnectDevice}
      handleStartScan={startDeviceScanning}
      duration={deviceState?.trip?.duration}
      startTime={deviceState?.trip?.startTime}
      avgSpeed={deviceState?.trip?.avgSpeed}
      tripStatus={trip?.tripStatus}
      handleViewHistoryPress={handleViewHistoryPress}
      handleAddCommentsPress={handleAddCommentsPress}
    />
  );
};
export default DeviceContainer;
