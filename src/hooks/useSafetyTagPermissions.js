import {DeviceEventEmitter, NativeModules} from 'react-native';

import {requestPermissions} from '../Utils/helpers';

const {SafetyTagModule} = NativeModules;

const startScanning = async () => {
  try {
    console.log('Requesting permissions for scanning...');
    await requestPermissions();
    console.log(
      'Permissions granted, connecting to the first discovered tag...',
    );
    await SafetyTagModule.connectToFirstDiscoveredTag();
    console.log('Successfully connected to the first discovered tag.');
  } catch (error) {
    console.error('Error starting scan:', error);
  }
};

const startBondScanning = async () => {
  try {
    console.log('Requesting permissions for bond scanning...');
    await requestPermissions();
    console.log(
      'Permissions granted, attempting to auto-connect to bonded tag...',
    );
    await SafetyTagModule.autoConnectToBondedTag();
    console.log('Successfully auto-connected to bonded tag.');
  } catch (error) {
    console.error('Error starting bond scan:', error);
  }
};

const disconnectDevice = async () => {
  try {
    console.log('Requesting permissions for disconnecting device...');
    await requestPermissions();
    console.log('Permissions granted, disconnecting from device...');
    await SafetyTagModule.disconnectFromDevice();
    console.log('Successfully disconnected from device.');
  } catch (error) {
    console.error('Error disconnecting device:', error);
  }
};

// Subscribe to connection events
const subscribeToConnectionEvents = () => {
  console.log('Subscribing to connection events...');
  DeviceEventEmitter.addListener('onConnecting', event => {
    console.log('Device is connecting...');
    // Handle the connecting event here (e.g., show loading spinner)
  });

  DeviceEventEmitter.addListener('onConnectionError', event => {
    console.error('Connection error occurred:', event);
    // Handle the error event here (e.g., show error message)
  });

  DeviceEventEmitter.addListener('onAuthenticationRequired', event => {
    console.log('Authentication required for connection:', event);
    // Handle the authentication required event here (e.g., prompt for key)
  });

  DeviceEventEmitter.addListener('onConnected', event => {
    console.log('Successfully connected to the device:', event);
    // Handle successful connection here (e.g., update UI, enable functions)
  });

  // Call the native method to start listening for connection events
  console.log('Starting to listen for connection events...');
  SafetyTagModule.notifyOnDeviceReady();
};

// Unsubscribe from connection events
const unsubscribeFromConnectionEvents = () => {
  console.log('Unsubscribing from connection events...');
  DeviceEventEmitter.removeAllListeners('onConnecting');
  DeviceEventEmitter.removeAllListeners('onConnectionError');
  DeviceEventEmitter.removeAllListeners('onAuthenticationRequired');
  DeviceEventEmitter.removeAllListeners('onConnected');

  // Call the native method to stop listening for connection events
  console.log('Stopping listening for connection events...');
  SafetyTagModule.notifyOnDeviceReady(); // Optionally call this to stop the listener
};

const queryTripData = async () => {
  try {
    const tripData = await SafetyTagModule.queryTripData();
    console.log('Trip Data:', tripData);
    return tripData;
  } catch (error) {
    console.error('Error querying trip data:', error);
    throw error;
  }
};

const configTripStartRecognitionForce = async value => {
  try {
    const response = await SafetyTagModule.configTripStartRecognitionForce(
      value,
    );
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error configuring trip start recognition force:', error);
    throw error;
  }
};

const configTripStartRecognitionDuration = async value => {
  try {
    const response = await SafetyTagModule.configTripStartRecognitionDuration(
      value,
    );
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error configuring trip start recognition duration:', error);
    throw error;
  }
};

const configTripEndTimeout = async value => {
  try {
    const response = await SafetyTagModule.configTripEndTimeout(value);
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error configuring trip end timeout:', error);
    throw error;
  }
};

const configTripMinimalDuration = async value => {
  try {
    const response = await SafetyTagModule.configTripMinimalDuration(value);
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error configuring minimal trip duration:', error);
    throw error;
  }
};

export {
  startScanning,
  startBondScanning,
  disconnectDevice,
  queryTripData,
  configTripStartRecognitionDuration,
  configTripStartRecognitionForce,
  configTripEndTimeout,
  configTripMinimalDuration,
  subscribeToConnectionEvents,
  unsubscribeFromConnectionEvents,
};
