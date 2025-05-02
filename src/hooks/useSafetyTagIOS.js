import {useEffect, useState} from 'react';
import {NativeModules, NativeEventEmitter, Platform} from 'react-native';

import {useAxisAlignment} from './useAxisAlignment';
import {useSafetyTagBeacon} from './useSafetyTagBeacon';

const {SafetyTagModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(SafetyTagModule);

/**
 * Hook for managing SafetyTag iOS device functionality
 * @param {Object} onEvents - Callback functions for various events
 * @returns {Object} - Device state and utility functions
 */
const useSafetyTagIOS = onEvents => {
  // ==========================================
  // Alignment Integration
  // ==========================================
  const {
    error,
    startAlignment,
    stopAlignment,
    checkAlignmentStatus,
    checkStoredAlignment,
    removeStoredAlignment,
    getAlignmentConfiguration,
  } = useAxisAlignment(onEvents);

  // ==========================================
  // iBeacon Integration
  // ==========================================
  const {
    startMonitoring,
    stopMonitoring,
    isBeingMonitored,
    enableAutoConnect,
    disableAutoConnect,
    isAutoConnectEnabled,
    startSignificantLocationChanges,
    stopSignificantLocationChanges,
  } = useSafetyTagBeacon(onEvents);

  // ==========================================
  // State Management
  // ==========================================
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  // ==========================================
  // Setup & Cleanup
  // ==========================================
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    startObserving().then();
    const subscriptions = onDeviceReady();

    return () => {
      stopObserving().then();
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  // ==========================================
  // Event Listeners Setup
  // ==========================================
  function onDeviceReady() {
    return [
      // Device Discovery & Connection Events
      eventEmitter.addListener('onDeviceDiscovered', onDeviceDiscovered),
      eventEmitter.addListener('onDeviceConnected', onDeviceConnected),
      eventEmitter.addListener(
        'onDeviceConnectionFailed',
        onDeviceConnectionFailed,
      ),
      eventEmitter.addListener('onDeviceDisconnected', onDeviceDisconnected),
      eventEmitter.addListener('onGetConnectedDevice', onGetConnectedDevice),
      eventEmitter.addListener('onCheckConnection', onCheckConnection),
      eventEmitter.addListener(
        'onDeviceConnectionStateChange',
        onDeviceConnectionStateChange,
      ),

      // Trip Events
      eventEmitter.addListener('onTripStarted', onTripStarted),
      eventEmitter.addListener('onTripEnded', onTripEnded),
      eventEmitter.addListener('onTripsReceived', onTripsReceived),

      // Crash Events
      eventEmitter.addListener('onCrashThreshold', onCrashThreshold),
      eventEmitter.addListener('onCrashEvent', onCrashEvent),
    ];
  }

  // ==========================================
  // Event Handlers - Device Discovery & Connection
  // ==========================================
  function onDeviceDiscovered(device) {
    if (!device) {
      console.log('Device discovered not found:', device);
      return;
    }
    console.log('Device discovered:', device);

    // Check if device already exists in the list
    setDevices(prevDevices => {
      const exists = prevDevices.some(d => d.id === device.id);
      if (!exists) {
        console.log('Adding new device:', device.name);
        return [...prevDevices, device];
      }
      return prevDevices;
    });
    onEvents?.onDeviceDiscovered?.(device);
  }

  function onDeviceConnected(event) {
    console.log('Device connected:', event);
    setIsScanning(false);
    onEvents?.onDeviceConnected?.(event);
  }

  function onDeviceConnectionFailed(event) {
    console.error('Connection failed:', event);
    setIsScanning(false);
    onEvents.onDeviceConnectionFailed(event);
  }

  function onDeviceDisconnected(event) {
    console.log('Device disconnected:', event);
    onEvents.onDeviceDisconnected(event);
  }

  function onGetConnectedDevice(event) {
    console.log('Got connected device info:', event);
    onEvents.onGetConnectedDevice(event);
  }

  function onCheckConnection(event) {
    console.log('Connection status:', event);
    onEvents.onCheckConnection(event);
  }

  function onDeviceConnectionStateChange(event) {
    console.log('Connection state change:', event);
    if (onEvents && onEvents.onDeviceConnectionStateChange) {
      onEvents.onDeviceConnectionStateChange(event);
    }
  }

  // ==========================================
  // Event Handlers - Trip Events
  // ==========================================
  function onTripStarted(event) {
    // console.log('Trip Started:', event);
    onEvents.onTripStarted(event);
  }

  function onTripEnded(event) {
    // console.log('Trip Started:', event);
    onEvents.onTripEnded(event);
  }

  function onTripsReceived(event) {
    // console.log('Trip Started:', event);
    onEvents.onTripsReceived(event);
  }

  // ==========================================
  // Event Handlers - Crash Events
  // ==========================================
  function onCrashThreshold(event) {
    console.log('Crash threshold event:', event);
    onEvents.onCrashThreshold(event);
  }

  function onCrashEvent(event) {
    console.log('Crash event:', event);
    onEvents.onCrashEvent(event);
  }

  // ==========================================
  // Device Management Functions
  // ==========================================
  async function startObserving() {
    try {
      console.log('Starting observation...');
      await SafetyTagModule.startObserving();
    } catch (err) {
      console.error('Error starting observation:', err);
    }
  }

  async function stopObserving() {
    try {
      console.log('Stopping observation...');
      await SafetyTagModule.stopObserving();
    } catch (err) {
      console.error('Error stopping observation:', err);
    }
  }

  const startScan = async (autoConnect = true) => {
    try {
      console.log(
        'Starting scan for SafetyTag devices... autoConnect:',
        autoConnect,
      );
      setDevices([]); // Clear previous devices
      setIsScanning(true);
      await SafetyTagModule.startScan(autoConnect);
    } catch (err) {
      console.error('Error starting scan:', err);
      setIsScanning(false);
    }
  };

  const stopScan = async () => {
    try {
      console.log('Stopping scan...');
      setIsScanning(false);
      await SafetyTagModule.stopScan();
    } catch (err) {
      console.error('Error stopping scan:', err);
    }
  };

  // ==========================================
  // Connection Management Functions
  // ==========================================
  const checkConnection = async () => {
    try {
      console.log('Checking SafetyTag connection...');
      await SafetyTagModule.checkConnection();
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const connectToDevice = async device => {
    try {
      await SafetyTagModule.connectDevice(device.id);
    } catch (err) {
      console.error('Error connecting to device:', err);
    }
  };

  const disconnectDevice = async () => {
    try {
      console.log('Disconnecting SafetyTag Device...');
      await SafetyTagModule.disconnectDevice();
    } catch (err) {
      console.error('Error Disconnecting SafetyTag Device:', error);
    }
  };

  // ==========================================
  // Device Information & Trips Functions
  // ==========================================
  const getDeviceInformation = async () => {
    try {
      console.log('Fetching SafetyTag Device Information...');
      await SafetyTagModule.getConnectedDevice();
    } catch (err) {
      console.error('Error Fetching SafetyTag Device Information:', err);
    }
  };

  const getTrips = async () => {
    await SafetyTagModule.getTrips();
  };

  const getTripsWithFraudDetection = async () => {
    await SafetyTagModule.getTripsWithFraudDetection();
  };

  // ==========================================
  // Accelerometer Functions
  // ==========================================
  const enableAccelerometerDataStream = async () => {
    try {
      await SafetyTagModule.enableIOSAccelerometerDataStream();
      console.log('Successfully enabled accelerometer data stream');
    } catch (err) {
      console.error('Error enabling accelerometer data stream:', err);
    }
  };

  const disableAccelerometerDataStream = async () => {
    try {
      await SafetyTagModule.disableAccelerometerDataStream();
      console.log('Successfully disabled accelerometer data stream');
    } catch (err) {
      console.error('Error disabling accelerometer data stream:', err);
    }
  };

  const isAccelerometerDataStreamEnabled = () => {
    try {
      console.log('Checking accelerometer data stream status...');
      SafetyTagModule.isAccelerometerDataStreamEnabled();
    } catch (err) {
      console.error('Error checking accelerometer data stream enable:', err);
    }
  };

  // ==========================================
  // Permission & Utility Functions
  // ==========================================
  const requestAlwaysPermission = async () => {
    try {
      console.log('Request AlwaysPermission...');
      await SafetyTagModule.requestLocationAlwaysPermission();
    } catch (err) {
      console.error('Request always permission error: ', err);
    }
  };

  function readRSSIOfDevice() {
    try {
      console.log('Reading RSSI');
      SafetyTagModule.readRSSI();
    } catch (err) {
      console.error('Request always permission error: ', err);
    }
  }

  // ==========================================
  // Return Values
  // ==========================================
  return {
    // State
    devices,
    isScanning,

    // Device Management
    startScan,
    stopScan,
    startObserving,
    stopObserving,

    // Connection Management
    checkConnection,
    connectToDevice,
    disconnectDevice,

    // Device Information & Trips
    getDeviceInformation,
    getTrips,
    getTripsWithFraudDetection,

    // Accelerometer Functions
    enableAccelerometerDataStream,
    disableAccelerometerDataStream,
    isAccelerometerDataStreamEnabled,

    // Permission & Utility Functions
    requestAlwaysPermission,
    readRSSIOfDevice,

    // Alignment Functions (from useAxisAlignment)
    error,
    startAlignment,
    stopAlignment,
    checkAlignmentStatus,
    checkStoredAlignment,
    removeStoredAlignment,
    getAlignmentConfiguration,

    // iBeacon Functions (from useSafetyTagBeacon)
    startMonitoring,
    stopMonitoring,
    isBeingMonitored,
    enableAutoConnect,
    disableAutoConnect,
    isAutoConnectEnabled,
    startSignificantLocationChanges,
    stopSignificantLocationChanges,
  };
};

export default useSafetyTagIOS;
