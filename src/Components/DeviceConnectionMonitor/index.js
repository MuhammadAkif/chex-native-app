import {useEffect} from 'react';

import {useSafetyTagInitializer} from '../../hooks';
import {useUIActions} from '../../hooks/UI';
import {useDeviceActions, useDeviceState} from '../../hooks/device';
import useTrips from '../../hooks/safetyTag/useTrips';

const DeviceConnectionMonitor = () => {
  const {toggleLoading} = useUIActions();
  const {setDevice, clearDevice, setDeviceTrip, setTripsList} =
    useDeviceActions();
  const {deviceAddress: storeDeviceAddress, isConnected: isDeviceConnected} =
    useDeviceState();
  const {deviceDetails, getDeviceTripsWithFraudData} =
    useSafetyTagInitializer();
  const {deviceTrips} = useTrips();
  const {
    isLoading: isDeviceLoading = false,
    isConnected = false,
    connectedDevice = {},
    trip,
  } = deviceDetails;

  useEffect(() => {
    toggleLoading(isDeviceLoading);
  }, [isDeviceLoading, toggleLoading]);
  useEffect(() => {
    if (isDeviceConnected) {
      getDeviceTripsWithFraudData();
    }
  }, [isDeviceConnected]);

  useEffect(() => {
    if (!isConnected || connectedDevice?.deviceAddress === storeDeviceAddress) {
      return;
    }

    const deviceInfo = setDeviceParams();
    setDevice(deviceInfo);
  }, [connectedDevice, setDevice]);

  useEffect(() => {
    if (!isConnected) {
      clearDevice();
    }
  }, [isConnected, clearDevice]);

  useEffect(() => {
    if (deviceTrips?.message) {
      try {
        const trips = deviceTrips?.message
          ?.trim()
          .split('\n')
          .map(line => {
            const match = line.match(
              /Trip\(receiveNumber=(\d+), startUnixTimeMs=(\d+), startElapsedRealtimeMs=(-?\d+), endUnixTimeMs=(\d+), endElapsedRealtimeMs=(-?\d+), connectedDuringTrip=(true|false)\)/,
            );
            if (match) {
              return {
                receiveNumber: parseInt(match[1]),
                startUnixTimeMs: parseInt(match[2]),
                startElapsedRealtimeMs: parseInt(match[3]),
                endUnixTimeMs: parseInt(match[4]),
                endElapsedRealtimeMs: parseInt(match[5]),
                connectedDuringTrip: match[6] === 'true',
                commentInfo: {
                  comment: '',
                  time: null,
                },
                position: {
                  coords: {
                    speed: null,
                    heading: null,
                    longitude: null,
                    latitude: null,
                  },
                },
              };
            }
            return null;
          })
          .filter(Boolean);

        setTripsList(trips);
      } catch (error) {}
    }
  }, [deviceTrips]);

  useEffect(() => {
    setTripParams();
  }, [trip]);

  function setDeviceParams() {
    const {
      connectedDevice: {
        deviceAddress = null,
        address = null,
        batteryHealth = null,
      },
    } = deviceDetails;
    return {
      ...connectedDevice,
      deviceAddress: deviceAddress || address,
      isConnected: isConnected,
      batteryHealth: batteryHealth,
    };
  }

  function setTripParams() {
    if (trip?.tripStatus === 'In Progress') {
      setDeviceTrip(trip);
    }
  }

  return null;
};

export default DeviceConnectionMonitor;
