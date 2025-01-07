import {DeviceEventEmitter, NativeModules} from 'react-native';

import {requestPermissions} from '../Utils/helpers';

const {SafetyTagModule} = NativeModules;

const useSafetyTag = () => {
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
      /*SafetyTagModule.unsubscribeFromTripEvents();*/
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  };

  const startBackgroundScanning = async () => {
    try {
      console.log('Starting background scanning...');
      await SafetyTagModule.startScanInBackground();
      console.log('Background scanning started successfully.');

      // Listen for discovered tags
      DeviceEventEmitter.addListener('onSafetyTagFound', tagInfo => {
        console.log('Safety Tag found:', tagInfo);
        // Handle the discovered tag (e.g., connect automatically)
      });
    } catch (error) {
      console.error('Error starting background scanning:', error);
    }
  };

  const stopBackgroundScanning = async () => {
    try {
      console.log('Stopping background scanning...');
      await SafetyTagModule.stopScanInBackground();
      console.log('Background scanning stopped successfully.');

      // Remove listeners
      DeviceEventEmitter.removeAllListeners('onSafetyTagFound');
    } catch (error) {
      console.error('Error stopping background scanning:', error);
    }
  };

  const handleTripStart = event => {
    console.log(
      `Trip started! Trip Number: ${event.tripNumber}, Start Time: ${new Date(
        event.startUnixTime,
      )}`,
    );
  };

  const handleTripEnd = event => {
    console.log(
      `Trip ended! Trip Number: ${event.tripNumber}, End Time: ${new Date(
        event.endUnixTime,
      )}`,
    );
  };

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

    DeviceEventEmitter.addListener('onTripDataSuccess', event => {
      console.log('Trip data received:', event);
    });

    DeviceEventEmitter.addListener('onTripDataError', event => {
      console.error('Error while fetching trip data:', event.message);
    });

    DeviceEventEmitter.addListener('onTripStart', event => {
      console.log('On trip start success: ', event.message);
    });

    /*DeviceEventEmitter.addListener('onTripEnd', event => {
      console.log('On trip end success: ', event.message);
    });*/

    DeviceEventEmitter.addListener('onTripStartError', event => {
      console.log('On trip start error: ', event.message);
    });

    DeviceEventEmitter.addListener('onTripStart', event => {
      console.log('Received trip start event:', event);

      // Parse the JSON string back into an object
      const tripEvent = JSON.parse(event.tripEventJson);
      console.log('Trip Event:', tripEvent);
    });

    DeviceEventEmitter.addListener('onTripEnd', event => {
      console.log('Received trip end event:', event);

      // Parse the JSON string back into an object
      const tripEvent = JSON.parse(event.tripEventJson);
      console.log('Trip Event:', tripEvent);
    });

    /*DeviceEventEmitter.addListener('onTripEndError', event => {
      console.log('On trip end error: ', event.message);
    });*/

    // Call the native method to start listening for connection events
    console.log('Starting to listen for connection events...');
    SafetyTagModule.notifyOnDeviceReady();
  };

  const unsubscribeFromConnectionEvents = () => {
    console.log('Unsubscribing from connection events...');
    DeviceEventEmitter.removeAllListeners('onConnecting');

    DeviceEventEmitter.removeAllListeners('onConnectionError');

    DeviceEventEmitter.removeAllListeners('onAuthenticationRequired');

    DeviceEventEmitter.removeAllListeners('onConnected');

    DeviceEventEmitter.removeAllListeners('onTripStart', handleTripStart);

    DeviceEventEmitter.removeAllListeners('onTripEnd', handleTripEnd);

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
      console.error(
        'Error configuring trip start recognition duration:',
        error,
      );
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

  return {
    startScanning,
    startBondScanning,
    disconnectDevice,
    startBackgroundScanning,
    stopBackgroundScanning,
    queryTripData,
    configTripStartRecognitionDuration,
    configTripStartRecognitionForce,
    configTripEndTimeout,
    configTripMinimalDuration,
    subscribeToConnectionEvents,
    unsubscribeFromConnectionEvents,
  };
};

export default useSafetyTag;
