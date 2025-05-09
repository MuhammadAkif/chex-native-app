import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {DeviceScreen} from '../Screens';
import {useDeviceState} from '../hooks/device';
import {useSafetyTagInitializer} from '../hooks';
import {
  convertSpeedToKmh,
  format12HourTime,
  getDistanceFromLatLonInKm,
  getElapsedTime,
  withDefault,
} from '../Utils/helpers';
import useGeoLocation from '../hooks/location/useGeoLocation';
import {ROUTES} from '../Navigation/ROUTES';

const DeviceContainer = ({navigation}) => {
  const {
    deviceAddress = '-',
    isConnected,
    batteryHealth = '-',
    trip,
  } = useDeviceState();
  const {getCurrentLocation} = useGeoLocation();
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
      handleLocationDistance();
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
          coords: {
            speed = '-',
            latitude: oldLat = null,
            longitude: oldLong = null,
          } = {},
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

  function handleLocationDistance() {
    const {
      tripStart: {
        position: {
          coords: {latitude: oldLat = null, longitude: oldLong = null} = {},
        },
      },
    } = trip || {};
    getCurrentLocation(position => {
      const {
        coords: {latitude: newLat, longitude: newLon},
      } = position || {};
      let distance = getDistanceFromLatLonInKm(oldLat, oldLong, newLat, newLon);
      distance = distance.toFixed(2);

      setDeviceState(prevState => ({...prevState, distance: `${distance} km`}));
    });
  }

  const handleViewHistoryPress = async () => {
    navigation.navigate(ROUTES.TRIP_HISTORY);
  };
  const handleAddCommentsPress = () => {};

  return (
    <DeviceScreen
      isConnected={isConnected}
      deviceTag={withDefault(deviceAddress, '-')}
      batteryHealth={deviceBatteryHealth}
      handleDisconnect={disconnectDevice}
      handleStartScan={startDeviceScanning}
      duration={deviceState?.trip?.duration}
      distance={deviceState?.distance}
      startTime={deviceState?.trip?.startTime}
      avgSpeed={deviceState?.trip?.avgSpeed}
      tripStatus={trip?.tripStatus}
      handleViewHistoryPress={handleViewHistoryPress}
      handleAddCommentsPress={handleAddCommentsPress}
      commentInfo={trip?.commentInfo}
    />
  );
};
export default DeviceContainer;
