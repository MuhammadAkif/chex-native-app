import {DeviceEventEmitter, NativeModules} from 'react-native';

import {requestPermissions} from '../Utils/helpers';

const {SafetyTagModule} = NativeModules;

const startScanning = async () => {
  try {
    await requestPermissions();
    await SafetyTagModule.connectToFirstDiscoveredTag();
  } catch (error) {
    console.error('Error starting scan:', error);
  }
};

const startBondScanning = async () => {
  try {
    await requestPermissions();
    await SafetyTagModule.autoConnectToBondedTag();
  } catch (error) {
    console.error('Error starting bond scan:', error);
  }
};

const disconnectDevice = async () => {
  try {
    await requestPermissions();
    await SafetyTagModule.disconnectFromDevice();
  } catch (error) {
    console.error('Error disconnecting device:', error);
  }
};

// Subscribe to connection events
const subscribeToConnectionEvents = () => {
  DeviceEventEmitter.addListener('onConnecting', event => {
    // Handle the connecting event here (e.g., show loading spinner)
  });

  DeviceEventEmitter.addListener('onConnectionError', event => {
    // Handle the error event here (e.g., show error message)
  });

  DeviceEventEmitter.addListener('onAuthenticationRequired', event => {
    // Handle the authentication required event here (e.g., prompt for key)
  });

  DeviceEventEmitter.addListener('onConnected', event => {
    // Handle successful connection here (e.g., update UI, enable functions)
  });

  // Call the native method to start listening for connection events
  SafetyTagModule.notifyOnDeviceReady();
};

// Unsubscribe from connection events
const unsubscribeFromConnectionEvents = () => {
  DeviceEventEmitter.removeAllListeners('onConnecting');
  DeviceEventEmitter.removeAllListeners('onConnectionError');
  DeviceEventEmitter.removeAllListeners('onAuthenticationRequired');
  DeviceEventEmitter.removeAllListeners('onConnected');

  // Call the native method to stop listening for connection events
  SafetyTagModule.notifyOnDeviceReady(); // Optionally call this to stop the listener
};
export {
  startScanning,
  startBondScanning,
  disconnectDevice,
  subscribeToConnectionEvents,
  unsubscribeFromConnectionEvents,
};
