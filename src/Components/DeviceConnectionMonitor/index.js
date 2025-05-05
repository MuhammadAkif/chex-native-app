import {useEffect} from 'react';

import {useSafetyTagInitializer} from '../../hooks';
import {useUIActions} from '../../hooks/UI';
import {useDeviceActions, useDeviceState} from '../../hooks/device';

const DeviceConnectionMonitor = () => {
  const {toggleLoading} = useUIActions();
  const {setDevice, clearDevice, setDeviceTrip} = useDeviceActions();
  const {deviceAddress: storeDeviceAddress} = useDeviceState();
  const {deviceDetails} = useSafetyTagInitializer();

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
