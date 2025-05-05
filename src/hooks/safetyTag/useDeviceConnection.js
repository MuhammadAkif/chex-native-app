import {useEffect, useState} from 'react';
import {Platform} from 'react-native';

import useSafetyTag from '../useSafetyTag';
import useSafetyTagIOS from '../useSafetyTagIOS';
import {Platforms} from '../../Constants';
import {devicesListOptimized} from '../../Utils/helpers';

const {OS} = Platform;
const {ANDROID, IOS} = Platforms;

const useDeviceConnection = (onEvents = {}) => {
  const {
    startScanning,
    getConnectedDevice,
    startDiscovery,
    readBatteryLevel,
    isDeviceConnected,
    clearDevice,
  } = useSafetyTag({
    onDeviceFound: onDeviceDiscovered,
    onConnecting: onDeviceConnecting, //for android only
    onConnectionError: onDeviceConnectionFailed,
    onConnected: onDeviceConnected,
    onDeviceDisconnected: onDeviceDisconnected,
    onTripStart: onTripStart,
    onTripEnd: onTripEnd,
  });
  const {startScan, getDeviceInformation, checkConnection} = useSafetyTagIOS({
    onDeviceDiscovered: onDeviceDiscovered,
    onDeviceConnectionFailed: onDeviceConnectionFailed,
    onDeviceConnected: onDeviceConnected,
    onDeviceDisconnected: onDeviceDisconnected,
    onGetConnectedDevice: onGetConnectedDevice,
    onCheckConnection: onCheckConnection,
  });

  const [deviceDetails, setDeviceDetails] = useState({
    discoveredDevices: [],
    isConnecting: false,
    isConnected: false,
    isConnectionFailed: false,
    isScanning: false,
    connectedDevice: {},
    isLoading: false,
    trip: {
      tripStart: {
        timestampElapsedRealtimeMs: null,
        timestampUnixMs: null,
        coords: {latitude: null, longitude: null},
      },
      tripStatus: 'Not Started',
      tripEnd: {
        timestampElapsedRealtimeMs: null,
        timestampUnixMs: null,
        coords: {latitude: null, longitude: null},
      },
    },
  });

  useEffect(() => {
    (async () => {
      const isConnected =
        OS === ANDROID ? await isDeviceConnected() : await checkConnection();
      if (isConnected) {
        setDeviceDetails(prevState => ({...prevState, isConnected}));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (deviceDetails?.isConnected) {
        await getConnectedDeviceInfo();
      } else {
        await startDeviceScanning();
      }
    })();
  }, [deviceDetails?.isConnected]);

  function onDeviceDiscovered(devicesList) {
    console.log('Devices Discovered:', devicesList);
    const newDevice = devicesList.device;
    setDeviceDetails(prevState => ({
      ...prevState,
      discoveredDevices: devicesListOptimized(
        prevState?.discoveredDevices,
        newDevice,
      ),
      isScanning: true,
      isConnecting: false,
      isConnected: false,
      isConnectionFailed: false,
      connectedDevice: {},
      isLoading: false,
    }));
  }

  function onDeviceConnecting(event) {
    console.log('Device connecting:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: true,
      isLoading: true,
    }));
  }

  function onDeviceConnectionFailed(event) {
    console.log('Device connection failed:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: false,
      isConnectionFailed: true,
      isLoading: false,
    }));
  }

  async function onDeviceConnected(event) {
    console.log('Device connected:', event);
    const batteryHealth = await readBatteryHealth();
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: false,
      isConnected: true,
      isConnectionFailed: false,
      connectedDevice: {...event, batteryHealth: batteryHealth},
      isLoading: false,
    }));
    await getConnectedDeviceInfo();
  }

  function onDeviceDisconnected(event) {
    console.log('Device disconnected:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: false,
      isConnected: false,
      isConnectionFailed: false,
      connectedDevice: {},
      discoveredDevices: [],
      isScanning: true,
      isLoading: false,
    }));
  }

  function onTripStart(event) {
    const tripStart = JSON.parse(event?.tripEventJson);
    if (
      deviceDetails?.trip?.tripStart?.timestampUnixMs ===
      tripStart?.timestampUnixMs
    ) {
      return;
    }
    setDeviceDetails(prevState => ({
      ...prevState,
      trip: {
        ...prevState.tripEnd,
        tripStart: {
          ...tripStart,
          coords: {latitude: null, longitude: null},
        },
        tripStatus: 'In Progress',
      },
    }));
  }

  function onTripEnd(event) {
    const tripEnd = JSON.parse(event?.tripEventJson);
    if (
      deviceDetails?.trip?.tripStart?.timestampUnixMs ===
      tripEnd?.timestampUnixMs
    ) {
      return;
    }
    setDeviceDetails(prevState => ({
      ...prevState,
      trip: {
        ...prevState.tripStart,
        tripStatus: 'Completed',
        tripEnd: {
          ...tripEnd,
          coords: {latitude: null, longitude: null},
        },
      },
    }));
  }

  function onGetConnectedDevice(event) {
    console.log('Connected device info:', event);
    setDeviceDetails(prevState => ({...prevState, connectedDevice: event}));
  }

  function onCheckConnection({isConnected = false}) {
    console.log('Device Connection:', isConnected);
    if (isConnected) {
      setDeviceDetails(prevState => ({...prevState, isConnected}));
    }
  }

  async function startDeviceScanning() {
    setDeviceDetails(prevState => ({...prevState, isScanning: true}));
    if (OS === ANDROID) {
      await startDiscovery();
      await startScanning();
    }
    if (OS === IOS) {
      await startScan();
    }
  }

  async function disconnectDevice() {
    setDeviceDetails(prevState => ({...prevState, isScanning: true}));
    if (OS === ANDROID) {
      await clearDevice();
      // await startScanning();
    }
    if (OS === IOS) {
      await startScan();
    }
  }

  async function getConnectedDeviceInfo() {
    if (OS === ANDROID) {
      const device = await getConnectedDevice();
      const batteryHealth = await readBatteryLevel();
      console.log('Connected device info:', device);
      setDeviceDetails({
        ...deviceDetails,
        discoveredDevices: [],
        isScanning: false,
        isConnecting: false,
        isConnected: true,
        connectedDevice: {...device, batteryHealth: batteryHealth},
      });
    }
    if (OS === IOS) {
      await getDeviceInformation();
    }
  }

  async function readBatteryHealth() {
    if (OS === ANDROID) {
      return await readBatteryLevel();
    }
    if (OS === IOS) {
      await getDeviceInformation();
    }
  }

  return {
    getConnectedDeviceInfo,
    startDeviceScanning,
    deviceDetails,
    disconnectDevice,
  };
};

export default useDeviceConnection;
