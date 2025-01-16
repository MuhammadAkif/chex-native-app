import {
  Alert,
  DeviceEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {requestPermissions} from '../Utils/helpers';
import {useEffect} from 'react';

const {SafetyTagModule} = NativeModules;

const useSafetyTag = () => {
  useEffect(() => {
    const crashDataSubscription = DeviceEventEmitter.addListener(
      'onCrashDataReceived',
      event => {
        const crashData = JSON.parse(event.crashData);
      },
    );

    const crashThresholdSubscription = DeviceEventEmitter.addListener(
      'onCrashThresholdEvent',
      event => {
        const thresholdEvent = JSON.parse(event.crashThresholdEvent);
      },
    );

    return () => {
      crashDataSubscription.remove();
      crashThresholdSubscription.remove();
    };
  }, []);

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

  const getDeviceConfiguration = async () => {
    try {
      console.log('Requesting permissions for bond scanning...');
      await requestPermissions();
      console.log(
        'Permissions granted, attempting to auto-connect to bonded tag...',
      );
      const result = await SafetyTagModule.readDeviceConfiguration();
      console.log('Successfully got device configuration.', {result});
    } catch (error) {
      console.error('Error while getting device configuration:', error);
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

  const subscribeToConnectionEvents = async () => {
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

    DeviceEventEmitter.addListener('onTripStartError', event => {
      console.log('On trip start error: ', event.message);
    });

    DeviceEventEmitter.addListener('onTripStart', event => {
      const tripEvent = JSON.parse(event.tripEventJson);
      console.log('Received trip start event:', tripEvent);
    });

    DeviceEventEmitter.addListener('onTripEnd', event => {
      const tripEvent = JSON.parse(event.tripEventJson);
      console.log('Received trip end event:', tripEvent);
    });

    DeviceEventEmitter.addListener('onTripDataWithFraudSuccess', tripData => {
      console.log('Trip Data with Fraud Success:', tripData);
    });

    DeviceEventEmitter.addListener('onTripDataWithFraudError', error => {
      console.log('Trip Data with Fraud Error:', error);
    });

    DeviceEventEmitter.addListener('onCrashDataError', error => {
      console.log('On Crash data error', error);
    });

    DeviceEventEmitter.addListener('onCrashDataReceived', event => {
      const crashData = JSON.parse(event.crashData);
      console.log('On Crash Data Received', crashData);
    });

    DeviceEventEmitter.addListener('onCrashThresholdEvent', event => {
      const thresholdEvent = JSON.parse(event.crashThresholdEvent);
      console.log('On Crash Threshold Event', thresholdEvent);
    });

    // Call the native method to start listening for connection events
    console.log('Starting to listen for connection events...');
    await SafetyTagModule.notifyOnDeviceReady();
    await SafetyTagModule.subscribeToTripStartAndEndEvents();
    await SafetyTagModule.subscribeToCrashData();
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

  const queryTripWithFraudData = async () => {
    try {
      const tripData =
        await SafetyTagModule.queryFullTripDataWithFraudDetection();
      console.log('Trip Data With Fraud:', tripData);
      return tripData;
    } catch (error) {
      console.error('Error querying trip data with fraud:', error);
      throw error;
    }
  };

  const configTripStartRecognitionForce = async (value = 50) => {
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

  const configTripStartRecognitionDuration = async (value = 400) => {
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

  const configTripEndTimeout = async (value = 60) => {
    try {
      const response = await SafetyTagModule.configTripEndTimeout(value);
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error configuring trip end timeout:', error);
      throw error;
    }
  };

  const configTripMinimalDuration = async (value = 180) => {
    try {
      const response = await SafetyTagModule.configTripMinimalDuration(value);
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error configuring minimal trip duration:', error);
      throw error;
    }
  };

  const configTrip = async () => {
    try {
      await configTripStartRecognitionForce();
      await configTripStartRecognitionDuration();
      await configTripEndTimeout();
      await configTripMinimalDuration();
    } catch (error) {
      console.error('Error configuring minimal trip duration:', error);
      throw error;
    }
  };

  const getDeviceInformation = async () => {
    try {
      const result = await SafetyTagModule.getDeviceInformation();
      console.log('Device information: ', result);
    } catch (error) {
      console.error('Error while getting device information:', error);
      throw error;
    }
  };

  const readBatteryLevel = async () => {
    try {
      const batteryLevel = await SafetyTagModule.readBatteryLevel();
      console.log('Battery Level:', batteryLevel);
      return batteryLevel;
    } catch (error) {
      console.error('Error reading battery level:', error);
      throw error;
    }
  };

  const configureCrash = async ({
    averagingWindowSize = 5,
    thresholdXy = 500,
    thresholdXyz = 1300,
    surpassingThresholds = 2,
  }) => {
    try {
      await SafetyTagModule.setCrashAveragingWindowSize(averagingWindowSize);
      await SafetyTagModule.setCrashThresholdXyNormalized(thresholdXy);
      await SafetyTagModule.setCrashThresholdXyzNormalized(thresholdXyz);
      await SafetyTagModule.setCrashNumberOfSurpassingThresholds(
        surpassingThresholds,
      );
      console.log('Crash configuration updated successfully.');
    } catch (error) {
      console.error('Failed to configure crash settings:', error);
    }
  };

  const subscribeToAccelerometerData = () => {
    try {
      SafetyTagModule.subscribeToAccelerometerData();
      console.log('Successfully subscribed to accelerometer data');
    } catch (error) {
      console.error('Error subscribing to accelerometer data:', error);
    }
  };

  const enableAccelerometerDataStream = async () => {
    try {
      await SafetyTagModule.enableAccelerometerDataStream();
      console.log('Successfully enabled accelerometer data stream');
    } catch (error) {
      console.error('Error enabling accelerometer data stream:', error);
    }
  };

  const disableAccelerometerDataStream = async () => {
    try {
      await SafetyTagModule.disableAccelerometerDataStream();
      console.log('Successfully disabled accelerometer data stream');
      Alert.alert(
        'Accelerometer stream',
        'Successfully disabled accelerometer data stream',
      );
    } catch (error) {
      console.error('Error disabling accelerometer data stream:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Axis alignment needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestBackgroundPermission = async () => {
    if (Platform.Version >= 29) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Permission',
            message: 'Axis alignment needs background location access',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startAxisAlignment = async () => {
    try {
      const hasLocationPermission = await requestLocationPermission();
      const hasBackgroundPermission = await requestBackgroundPermission();

      if (!hasLocationPermission || !hasBackgroundPermission) {
        throw new Error('Required permissions not granted');
      }

      await SafetyTagModule.startAxisAlignment();
      Alert.alert('Axis Alignment', 'Successfully started axis alignment');
      console.log('Successfully started axis alignment');
    } catch (error) {
      console.error('Error starting axis alignment:', error);
      throw error;
    }
  };

  const stopAxisAlignment = async () => {
    try {
      await SafetyTagModule.stopAxisAlignment();
      Alert.alert('Axis Alignment', 'Successfully stopped axis alignment');
      console.log('Successfully stopped axis alignment');
    } catch (error) {
      console.error('Error stopping axis alignment:', error);
    }
  };

  const isAlignmentRunning = async () => {
    try {
      return await SafetyTagModule.isAlignmentServiceRunning();
    } catch (error) {
      console.error('Error checking alignment service:', error);
      return false;
    }
  };

  const startDiscovery = async () => {
    try {
      await requestPermissions();
      await SafetyTagModule.startDiscovery();
    } catch (error) {
      console.error('Error starting discovery:', error);
    }
  };

  const stopDiscovery = async () => {
    try {
      await SafetyTagModule.stopDiscoveringTags();
    } catch (error) {
      console.error('Error stopping discovery:', error);
    }
  };

  const connectToDevice = async address => {
    try {
      await SafetyTagModule.connectToDevice(address);
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw error;
    }
  };

  return {
    startScanning,
    startBondScanning,
    getDeviceConfiguration,
    disconnectDevice,
    startBackgroundScanning,
    stopBackgroundScanning,
    queryTripData,
    queryTripWithFraudData,
    configTrip,
    configureCrash,
    subscribeToConnectionEvents,
    unsubscribeFromConnectionEvents,
    getDeviceInformation,
    readBatteryLevel,
    subscribeToAccelerometerData,
    enableAccelerometerDataStream,
    disableAccelerometerDataStream,
    startAxisAlignment,
    stopAxisAlignment,
    isAlignmentRunning,
    startDiscovery,
    stopDiscovery,
    connectToDevice,
  };
};

export default useSafetyTag;
