import {useEffect, useState} from 'react';
import {Platform} from 'react-native';

import useSafetyTag from '../useSafetyTag';
import useSafetyTagIOS from '../useSafetyTagIOS';
import {Platforms} from '../../Constants';
import {devicesListOptimized} from '../../Utils/helpers';

const {OS} = Platform;
const {ANDROID, IOS} = Platforms;

const useDeviceConnection = () => {
  const {startScanning, getConnectedDevice, startDiscovery} = useSafetyTag({
    onDeviceFound: onDeviceDiscovered,
    onConnecting: onDeviceConnecting, //for android only
    onConnectionError: onDeviceConnectionFailed,
    onConnected: onDeviceConnected,
    onDeviceDisconnected: onDeviceDisconnected,
  });
  const {startScan, getDeviceInformation} = useSafetyTagIOS({
    onDeviceDiscovered: onDeviceDiscovered,
    onDeviceConnectionFailed: onDeviceConnectionFailed,
    onDeviceConnected: onDeviceConnected,
    onDeviceDisconnected: onDeviceDisconnected,
    onGetConnectedDevice: onGetConnectedDevice,
  });

  const [deviceDetails, setDeviceDetails] = useState({
    discoveredDevices: [],
    isConnecting: false,
    isConnected: false,
    isConnectionFailed: false,
    isScanning: false,
    connectedDevice: {},
  });

  useEffect(() => {
    (async () => {
      await startDeviceScanning();
    })();
  }, []);

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
    }));
  }

  function onDeviceConnecting(event) {
    console.log('Device connecting:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: true,
    }));
  }

  function onDeviceConnectionFailed(event) {
    console.log('Device connection failed:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: false,
      isConnectionFailed: true,
    }));
  }

  function onDeviceConnected(event) {
    console.log('Device connected:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: false,
      isConnected: true,
      isConnectionFailed: false,
      connectedDevice: event,
    }));
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
    }));
  }

  function onGetConnectedDevice(event) {
    console.log('Connected device info:', event);
    setDeviceDetails(prevState => ({...prevState, connectedDevice: event}));
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

  async function getConnectedDeviceInfo() {
    if (OS === ANDROID) {
      const device = await getConnectedDevice();
      console.log('Connected device info:', device);
      setDeviceDetails({
        ...deviceDetails,
        discoveredDevices: [],
        isScanning: false,
        isConnecting: false,
        isConnected: true,
        connectedDevice: device,
      });
    }
    if (OS === IOS) {
      await getDeviceInformation();
    }
  }

  return {getConnectedDeviceInfo, startDeviceScanning};
};

export default useDeviceConnection;
