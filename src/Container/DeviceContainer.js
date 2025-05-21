import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {DeviceScreen} from '../Screens';
import {useDeviceActions, useDeviceState} from '../hooks/device';
import {useSafetyTagInitializer} from '../hooks';
import {
  convertSpeedToKmh,
  format12HourTime,
  formatUnixTimestampIntoDate,
  getDistanceFromLatLonInKm,
  getElapsedTime,
  withDefault,
} from '../Utils/helpers';
import useGeoLocation from '../hooks/location/useGeoLocation';
import {ROUTES} from '../Navigation/ROUTES';
import {
  disconnectDeviceAPI,
  setStartTrip,
  updateTrip,
} from '../services/device';
import {isNotEmpty} from '../Utils';

const defaultLocationPlaceholder = {
  title: '-',
  address: '',
};

const DeviceContainer = ({navigation}) => {
  const {
    deviceAddress = '-',
    isConnected,
    batteryHealth = '-',
    trip,
    userDeviceDetails,
    userStartTripDetails,
  } = useDeviceState();
  const {setUserStartTripDetails} = useDeviceActions();
  const {
    tripStart: {
      position: {locality, state, country},
      timestampUnixMs,
    },
    tripStatus,
    commentInfo,
  } = trip;
  const {getCurrentLocation} = useGeoLocation();
  const {deviceDetails, disconnectDevice, startDeviceScanning} =
    useSafetyTagInitializer();
  const [deviceState, setDeviceState] = useState({displayVehiclesList: false});
  const deviceBatteryHealth = batteryHealth ? `${batteryHealth}%` : '-';

  useEffect(() => {
    if (!isConnected) {
      setDeviceState({displayVehiclesList: false});
    }
  }, [isConnected]);

  useEffect(() => {
    if (tripStatus !== 'In Progress' && isConnected) {
      (async () => await handleStartTrip())();
      setDeviceState({displayVehiclesList: false});
    }
    if (tripStatus === 'Completed' && isConnected) {
      (async () => await handleEndTrip())();
    }
  }, [tripStatus]);

  useFocusEffect(
    useCallback(() => {
      if (!timestampUnixMs) {
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
    }, [timestampUnixMs]),
  );

  function setTripParams() {
    const {
      tripStart: {
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
    getCurrentLocation(async position => {
      const {
        coords: {latitude: newLat, longitude: newLon},
      } = position || {};

      let distance = getDistanceFromLatLonInKm(oldLat, oldLong, newLat, newLon);
      distance = distance.toFixed(2);

      setDeviceState(prevState => ({
        ...prevState,
        distance: `${distance} km`,
        locality: '-',
        state: '-',
        country: '-',
      }));
    });
  }

  const handleViewHistoryPress = async () => {
    navigation.navigate(ROUTES.TRIP_HISTORY);
  };
  const handleAddCommentsPress = () => {};

  const handleDisconnectDevice = async () => {
    try {
      await disconnectDeviceAPI(userDeviceDetails?.device?.id);
      await disconnectDevice();
    } catch (error) {
      throw error;
    } finally {
      if (isConnected) {
        await disconnectDevice();
      }
    }
  };

  async function handleStartTrip() {
    console.log('trip started');
    const {
      tripStart: {
        position: {
          coords: {latitude: oldLat = null, longitude: oldLong = null} = {},
        },
      },
    } = trip || {};
    if (!isNotEmpty(timestampUnixMs) && !isConnected) {
      return;
    }
    getCurrentLocation(async position => {
      const {
        coords: {latitude: newLat, longitude: newLon},
      } = position || {};

      let distance = getDistanceFromLatLonInKm(oldLat, oldLong, newLat, newLon);
      distance = distance.toFixed(2);
      let speed = withDefault(convertSpeedToKmh(speed), '-');
      const duration_ = withDefault(getElapsedTime(timestampUnixMs), '-');
      const startTime = withDefault(
        formatUnixTimestampIntoDate(timestampUnixMs),
        '-',
      );
      const format = duration_.split(' ');
      const duration = Number(format[0]);
      const startPoint = {lng: oldLat, lat: oldLong, title: '', address: ''};
      const {data} = await setStartTrip(
        duration,
        Number(distance),
        userDeviceDetails?.device?.id,
        speed,
        startTime,
        startPoint,
      );
      console.log('start trip data: ', data);
      setUserStartTripDetails(data);
    });
  }

  async function handleEndTrip() {
    console.log('trip ended');
    const {
      tripEnd: {
        position: {
          coords: {latitude: oldLat = null, longitude: oldLong = null} = {},
        },
        timestampUnixMs,
      },
    } = trip || {};
    if (!isNotEmpty(timestampUnixMs) && !isConnected) {
      return;
    }
    getCurrentLocation(async position => {
      const {
        coords: {latitude: newLat, longitude: newLon},
      } = position || {};

      let distance = getDistanceFromLatLonInKm(
        trip?.tripStart?.position?.coords?.latitude,
        trip?.tripStart?.position?.coords?.longitude,
        trip?.tripEnd?.position?.coords?.latitude,
        trip?.tripEnd?.position?.coords?.longitude,
      );
      distance = distance.toFixed(2);
      const duration_ = withDefault(getElapsedTime(timestampUnixMs), '-');

      const format = duration_.split(' ');
      const duration = Number(format[0]);
      const endTime = formatUnixTimestampIntoDate(timestampUnixMs);
      const endPoint = {
        lat: trip?.tripEnd?.position?.coords?.latitude,
        lng: trip?.tripEnd?.position?.coords?.longitude,
        title: '',
        address: '',
      };
      const body = {
        tripId: userStartTripDetails?.id,
        duration,
        distance,
        speed: null,
        completeStatus: true,
        endTime: formatUnixTimestampIntoDate(timestampUnixMs),
        endPoint: {
          lat: trip?.tripEnd?.position?.coords?.latitude,
          lng: trip?.tripEnd?.position?.coords?.longitude,
          title: '',
          address: '',
        },
      };
      const {data} = await updateTrip(
        userStartTripDetails?.id,
        duration,
        Number(distance),
        null,
        true,
        endTime,
        endPoint,
      );
    });
  }

  return (
    <DeviceScreen
      isConnected={isConnected}
      deviceTag={withDefault(deviceAddress, '-')}
      batteryHealth={deviceBatteryHealth}
      handleDisconnect={handleDisconnectDevice}
      handleStartScan={startDeviceScanning}
      duration={deviceState?.trip?.duration}
      distance={deviceState?.distance}
      startTime={deviceState?.trip?.startTime}
      avgSpeed={deviceState?.trip?.avgSpeed}
      tripStatus={tripStatus}
      handleViewHistoryPress={handleViewHistoryPress}
      handleAddCommentsPress={handleAddCommentsPress}
      commentInfo={commentInfo}
      primaryLocation={
        locality
          ? {
              title: locality || '-',
              address: `${state}, ${country}`,
            }
          : defaultLocationPlaceholder
      }
      secondaryLocation={
        deviceState?.locality
          ? {
              title: deviceState?.locality,
              address: '',
              // address: `${deviceState?.state}, ${deviceState?.country}`,
            }
          : defaultLocationPlaceholder
      }
      displayVehiclesList={deviceState?.displayVehiclesList}
    />
  );
};
export default DeviceContainer;
