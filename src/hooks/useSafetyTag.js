import {useEffect} from 'react';
import {
  DeviceEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';

import {requestPermissions} from '../Utils/helpers';
import {
  addCrashData,
  updateCrashStatus,
  addThresholdEvent,
  setCrashError,
} from '../Store/Actions';

const {SafetyTagModule} = NativeModules;

/**
 * @typedef {Object} SafetyTagEvents
 * @property {Function} onCrashDataReceived
 * @property {Function} onCrashThresholdEvent
 * @property {Function} onConnecting
 * @property {Function} onDeviceDisconnected
 * @property {Function} onConnectionError
 * @property {Function} onConnected
 * @property {Function} onDeviceFound
 * @property {Function} onBackgroundDeviceFound
 * @property {Function} onTripStart
 * @property {Function} onTripEnd
 * @property {Function} onAccelerometerData
 * @property {Function} onAccelerometerError
 * @property {Function} onAxisAlignmentState
 * @property {Function} onVehicleState
 * @property {Function} onAxisAlignmentError
 * @property {Function} onAxisAlignmentFinished
 */

const useSafetyTag = (onEvents = {}) => {
  const dispatch = useDispatch();

  // ==========================================
  // Main Hook and Initial Setup
  // ==========================================
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    requestPermissions().then();
    SafetyTagModule.requestNotificationPermission();
    SafetyTagModule.setLogLevel('DEBUG');
    const events = stratObservingEvents(DeviceEventEmitter);
    console.log('Starting to listen for connection events...');
    SafetyTagModule.notifyOnDeviceReady();
    SafetyTagModule.subscribeToTripStartAndEndEvents();
    SafetyTagModule.subscribeToCrashData();

    return () => {
      events.forEach(subscription => subscription.remove());
    };
  }, []);

  // ==========================================
  // Discovery & Connection
  // ==========================================
  async function startDiscovery() {
    try {
      console.log('Starting device discovery...');
      await requestPermissions();
      await SafetyTagModule.startDiscovery();
      onEvents?.onDiscoveryStarted?.();
    } catch (error) {
      console.error('Error starting discovery:', error);
      onEvents?.onDiscoveryError?.(error);
    }
  }

  async function stopDiscovery() {
    try {
      console.log('Stopping device discovery...');
      await SafetyTagModule.stopDiscoveringTags();
      onEvents?.onDiscoveryStopped?.();
    } catch (error) {
      console.error('Error stopping discovery:', error);
      onEvents?.onDiscoveryError?.(error);
    }
  }

  async function startScanning() {
    try {
      console.log('Starting device scanning...');
      await requestPermissions();
      await SafetyTagModule.connectToFirstDiscoveredTag();
    } catch (error) {
      console.error('Error starting scan:', error);
    }
  }

  async function startBondScanning() {
    try {
      console.log('Starting bond scanning...');
      await requestPermissions();
      await SafetyTagModule.autoConnectToBondedTag();
    } catch (error) {
      console.error('Error starting bond scan:', error);
    }
  }

  async function connectToDevice(address) {
    try {
      return await SafetyTagModule.connectToDevice(address);
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw error;
    }
  }

  async function connectToBondedDevice(address) {
    try {
      return await SafetyTagModule.connectToBondedDevice(address);
    } catch (error) {
      console.error('Error connecting to bonded device:', error);
      throw error;
    }
  }

  async function disconnectDevice() {
    try {
      console.log('Requesting permissions for disconnecting device...');
      await requestPermissions();
      console.log('Permissions granted, disconnecting from device...');
      await SafetyTagModule.disconnectFromDevice();
      console.log('Successfully disconnected from device.');
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  }

  // ==========================================
  // Trip Detection
  // ==========================================
  async function subscribeToConnectionEvents() {
    console.log('Starting to listen for connection events...');
    await SafetyTagModule.notifyOnDeviceReady();
    await SafetyTagModule.subscribeToTripStartAndEndEvents();
    await SafetyTagModule.subscribeToCrashData();
  }

  function unsubscribeFromConnectionEvents() {}

  function onTripStart(event) {
    onEvents?.onTripStart?.(event);
  }

  function onTripStartError(event) {
    onEvents?.onTripStartError?.(event);
  }

  function onTripEnd(event) {
    onEvents?.onTripEnd?.(event);
  }

  function onTripDataSuccess(event) {
    onEvents?.onTripDataSuccess?.(event);
  }

  function onTripDataError(event) {
    onEvents?.onTripDataError?.(event);
  }

  function onTripDataWithFraudSuccess(event) {
    onEvents?.onTripDataWithFraudSuccess?.(event);
  }

  function onTripDataWithFraudError(error) {
    onEvents?.onTripDataWithFraudError?.(error);
  }

  async function queryTripData() {
    try {
      const tripData = await SafetyTagModule.queryTripData();
      console.log('Trip Data:', tripData);
      return tripData;
    } catch (error) {
      console.error('Error querying trip data:', error);
      throw error;
    }
  }

  async function queryTripWithFraudData() {
    try {
      const tripData =
        await SafetyTagModule.queryFullTripDataWithFraudDetection();
      console.log('Trip Data With Fraud:', tripData);
      return tripData;
    } catch (error) {
      console.error('Error querying trip data with fraud:', error);
      throw error;
    }
  }

  async function configTripStartRecognitionForce(value = 50) {
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
  }

  async function configTripStartRecognitionDuration(value = 400) {
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
  }

  async function configTripEndTimeout(value = 60) {
    try {
      const response = await SafetyTagModule.configTripEndTimeout(value);
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error configuring trip end timeout:', error);
      throw error;
    }
  }

  async function configTripMinimalDuration(value = 180) {
    try {
      const response = await SafetyTagModule.configTripMinimalDuration(value);
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error configuring minimal trip duration:', error);
      throw error;
    }
  }

  async function configTrip() {
    try {
      await configTripStartRecognitionForce();
      await configTripStartRecognitionDuration();
      await configTripEndTimeout();
      await configTripMinimalDuration();
    } catch (error) {
      console.error('Error configuring minimal trip duration:', error);
      throw error;
    }
  }

  // ==========================================
  // Crash Detection
  // ==========================================
  async function configureCrash({
    averagingWindowSize = 5,
    thresholdXy = 500,
    thresholdXyz = 1300,
    surpassingThresholds = 2,
  }) {
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
      dispatch(setCrashError('Failed to configure crash settings'));
    }
  }

  function onCrashDataReceived(event) {
    console.log('crash-data', event);
    try {
      const crashData = JSON.parse(event.crashData);
      dispatch(addCrashData(crashData));
      dispatch(
        updateCrashStatus(
          crashData.hasCompleteData ? 'COMPLETE_DATA' : 'PARTIAL_DATA',
        ),
      );
      onEvents?.onCrashDataReceived?.(event);
    } catch (error) {
      console.error('Error parsing crash data:', error);
      dispatch(setCrashError('Error parsing crash data'));
    }
  }

  function onCrashThresholdEvent(event) {
    console.log('crash-event', event);
    try {
      const thresholdEvent = JSON.parse(event.crashThresholdEvent);
      dispatch(addThresholdEvent(thresholdEvent));
      onEvents?.onCrashThresholdEvent?.(event);
    } catch (error) {
      console.error('Error parsing threshold event:', error);
      dispatch(setCrashError('Error parsing threshold event'));
    }
  }

  function onCrashDataError(error) {
    onEvents?.onCrashDataError?.(error);
  }

  // ==========================================
  // Axis Alignment (AVAA)
  // ==========================================
  async function startAxisAlignment(startFromScratch = false) {
    try {
      const hasLocationPermission = await requestLocationPermission();
      if (!hasLocationPermission) {
        throw new Error('Location permission not granted');
      }
      const result =
        await SafetyTagModule.startAccelerometerAxisAlignmentWithForegroundService();
      console.log(
        'startAccelerometerAxisAlignmentWithForegroundService status: ',
        result,
      );
      console.log('Successfully started axis alignment');
    } catch (error) {
      console.error('Error starting axis alignment:', error);
      throw error;
    }
  }

  async function stopAxisAlignment() {
    try {
      await SafetyTagModule.stopAxisAlignment();
      console.log('Successfully stopped axis alignment');
    } catch (error) {
      console.error('Error stopping axis alignment:', error);
    }
  }

  function onAxisAlignmentState(event) {
    onEvents?.onAxisAlignmentState?.(event);
  }

  function onAxisAlignmentStateChange(event) {
    onEvents?.onAxisAlignmentStateChange?.(event);
  }

  function onAxisAlignmentSuccess(event) {
    onEvents?.onAxisAlignmentSuccess?.(event);
  }

  function onAxisAlignmentError(event) {
    onEvents?.onAxisAlignmentError?.(event);
  }

  function onAxisAlignmentFinished(event) {
    onEvents?.onAxisAlignmentFinished?.(event);
  }

  function onAxisAlignmentStopped(event) {
    onEvents?.onAxisAlignmentStopped?.(event);
  }

  async function readAccAxisAlignmentValues() {
    try {
      //return await SafetyTagModule.readAccAxisAlignmentValues();
    } catch (error) {
      console.error('Error reading alignment values:', error);
      throw error;
    }
  }

  async function hasOngoingAxisAlignment() {
    try {
      return await SafetyTagModule.hasOngoingAxisAlignment();
    } catch (error) {
      console.error('Error checking ongoing alignment:', error);
      return false;
    }
  }

  async function isAlignmentRunning() {
    try {
      return await SafetyTagModule.isAlignmentServiceRunning();
    } catch (error) {
      console.error('Error checking alignment service:', error);
      return false;
    }
  }

  // ==========================================
  // Accelerometer Data Stream
  // ==========================================
  async function subscribeToAccelerometerData() {
    try {
      SafetyTagModule.subscribeToAccelerometerData();
      console.log('Successfully subscribed to accelerometer data');
    } catch (error) {
      console.error('Error subscribing to accelerometer data:', error);
    }
  }

  async function enableAccelerometerDataStream() {
    try {
      await SafetyTagModule.enableAccelerometerDataStream();
      console.log('Successfully enabled accelerometer data stream');
    } catch (error) {
      console.error('Error enabling accelerometer data stream:', error);
    }
  }

  async function disableAccelerometerDataStream() {
    try {
      await SafetyTagModule.disableAccelerometerDataStream();
      console.log('Successfully disabled accelerometer data stream');
    } catch (error) {
      console.error('Error disabling accelerometer data stream:', error);
    }
  }

  function onAccelerometerData(event) {
    onEvents?.onAccelerometerData?.(event);
  }

  function onAccelerometerError(event) {
    onEvents?.onAccelerometerError?.(event);
  }

  // ==========================================
  // Background Scanning & Auto Connect
  // ==========================================
  async function startBackgroundScanning(intervalMinutes) {
    try {
      console.log('Starting background scanning...');
      await requestPermissions();
      /*const hasBackgroundPermission = await requestBackgroundPermission();
      if (!hasBackgroundPermission) {
        throw new Error('Background location permission not granted');
      }*/
      if (intervalMinutes) {
        await SafetyTagModule.startBackgroundScanWithInterval(intervalMinutes);
        console.log(
          `Background scanning started with ${intervalMinutes} minute interval`,
        );
      } else {
        await SafetyTagModule.startBackgroundScan();
        console.log('Background scanning started with default interval');
      }
      DeviceEventEmitter.addListener('onBackgroundDeviceFound', event => {
        console.log('🔍 Background Device Found:', {
          name: event.deviceName,
          address: event.deviceAddress,
          timestamp: new Date().toISOString(),
        });
      });
      DeviceEventEmitter.addListener('onBackgroundDeviceConnected', event => {
        console.log('onBackgroundDeviceConnected: ', event);
      });
      DeviceEventEmitter.addListener('onFoundSafetyTagInfo', event => {
        console.log('onFoundSafetyTagInfo: ', event);
      });
      DeviceEventEmitter.addListener('onBackgroundScanError', event => {
        console.warn('⚠️ Background Scan Error:', {
          status: event.status,
          timestamp: new Date().toISOString(),
        });
      });
      DeviceEventEmitter.addListener('onBackgroundScanStatusChange', event => {
        console.log('📡 Background Scan Status:', {
          status: event.status,
          timestamp: new Date().toISOString(),
        });
      });
    } catch (error) {
      console.error('❌ Background Scan Error:', error);
      throw error;
    }
  }

  async function stopBackgroundScanning() {
    try {
      console.log('Stopping background scanning...');
      await SafetyTagModule.stopBackgroundScan();
      console.log('Background scanning stopped successfully.');
      DeviceEventEmitter.removeAllListeners('onBackgroundDeviceFound');
      DeviceEventEmitter.removeAllListeners('onBackgroundScanError');
    } catch (error) {
      console.error('Error stopping background scanning:', error);
      throw error;
    }
  }

  async function isBackgroundScanningActive() {
    try {
      const isActive = await SafetyTagModule.isBackgroundScanActive();
      const status = await SafetyTagModule.getBackgroundScanStatus();
      console.log('Background Scan Check:', {
        isActive,
        status,
        timestamp: new Date().toISOString(),
      });
      return isActive;
    } catch (error) {
      console.error('Error checking background scan status:', error);
      return false;
    }
  }

  async function getBackgroundScanStatus() {
    try {
      return await SafetyTagModule.getBackgroundScanStatus();
    } catch (error) {
      console.error('Error getting background scan status:', error);
      return null;
    }
  }

  async function checkAndEnableAutoConnect() {
    try {
      const isEnabled = await SafetyTagModule.isAutoConnectEnabled();
      console.log('Auto-connect status:', isEnabled);
      return isEnabled;
    } catch (error) {
      console.error('Error checking auto-connect status:', error);
      return false;
    }
  }

  async function addDeviceToAutoConnect(deviceAddress) {
    try {
      await SafetyTagModule.addTagToAutoConnect(deviceAddress);
      return true;
    } catch (error) {
      console.error('Error adding device to auto-connect:', error);
      return false;
    }
  }

  async function removeDeviceFromAutoConnect(deviceAddress) {
    try {
      await SafetyTagModule.removeTagFromAutoConnect(deviceAddress);
      console.log(
        'Successfully removed device from auto-connect list:',
        deviceAddress,
      );
      return true;
    } catch (error) {
      console.error('Error removing device from auto-connect:', error);
      throw error;
    }
  }

  async function clearAutoConnectList() {
    try {
      await SafetyTagModule.clearAutoConnectList();
      console.log('Successfully cleared auto-connect list');
      return true;
    } catch (error) {
      console.error('Error clearing auto-connect list:', error);
      throw error;
    }
  }

  async function getAutoConnectAddresses() {
    try {
      const addresses = await SafetyTagModule.getAutoConnectAddresses();
      console.log('Auto-connect addresses:', addresses);
      return addresses;
    } catch (error) {
      console.error('Error getting auto-connect addresses:', error);
      throw error;
    }
  }

  // ==========================================
  // Device Info / Config
  // ==========================================
  async function getDeviceInformation() {
    try {
      const result = await SafetyTagModule.getDeviceInformation();
      console.log('Device information: ', result);
    } catch (error) {
      console.error('Error while getting device information:', error);
      throw error;
    }
  }

  async function getDeviceConfiguration() {
    try {
      await requestPermissions();
      const result = await SafetyTagModule.readDeviceConfiguration();
    } catch (error) {
      console.error('Error while getting device configuration:', error);
    }
  }

  async function readBatteryLevel() {
    try {
      const batteryLevel = await SafetyTagModule.readBatteryLevel();
      console.log('Battery Level:', batteryLevel);
      return batteryLevel;
    } catch (error) {
      console.error('Error reading battery level:', error);
      throw error;
    }
  }

  async function isDeviceConnected() {
    try {
      return await SafetyTagModule.isDeviceConnected();
    } catch (error) {
      console.error('Error checking device connection:', error);
      return false;
    }
  }

  async function getConnectedDevice() {
    try {
      const device = await SafetyTagModule.getConnectedDevice();
      return device;
    } catch (error) {
      console.error('Error getting connected device:', error);
      throw error;
    }
  }

  // ==========================================
  // Helpers and Internals
  // ==========================================
  async function requestLocationPermission() {
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
  }

  function stratObservingEvents(eventEmitter) {
    return [
      eventEmitter.addListener('onConnecting', onConnecting),
      eventEmitter.addListener('onDeviceDisconnected', onDeviceDisconnected),
      eventEmitter.addListener('onConnectionError', onConnectionError),
      eventEmitter.addListener(
        'onAuthenticationRequired',
        onAuthenticationRequired,
      ),
      eventEmitter.addListener('onConnected', onConnected),
      eventEmitter.addListener('onTripDataSuccess', onTripDataSuccess),
      eventEmitter.addListener('onTripDataError', onTripDataError),
      eventEmitter.addListener('onTripStart', onTripStart),
      eventEmitter.addListener('onTripStartError', onTripStartError),
      eventEmitter.addListener('onTripEnd', onTripEnd),
      eventEmitter.addListener(
        'onTripDataWithFraudSuccess',
        onTripDataWithFraudSuccess,
      ),
      eventEmitter.addListener(
        'onTripDataWithFraudError',
        onTripDataWithFraudError,
      ),
      eventEmitter.addListener('onAccelerometerData', onAccelerometerData),
      eventEmitter.addListener('onAccelerometerError', onAccelerometerError),
      eventEmitter.addListener('onAxisAlignmentState', onAxisAlignmentState),
      eventEmitter.addListener(
        'onAxisAlignmentStateChange',
        onAxisAlignmentStateChange,
      ),
      eventEmitter.addListener('onVehicleState', onVehicleState),
      eventEmitter.addListener('onAxisAlignmentError', onAxisAlignmentError),
      eventEmitter.addListener(
        'onAxisAlignmentFinished',
        onAxisAlignmentFinished,
      ),
      eventEmitter.addListener(
        'onAxisAlignmentSuccess',
        onAxisAlignmentSuccess,
      ),
      eventEmitter.addListener('onCrashDataError', onCrashDataError),
      eventEmitter.addListener(
        'onAxisAlignmentStopped',
        onAxisAlignmentStopped,
      ),
      eventEmitter.addListener('onCrashDataReceived', onCrashDataReceived),
      eventEmitter.addListener('onCrashThresholdEvent', onCrashThresholdEvent),
      eventEmitter.addListener('onDeviceFound', onDeviceFound),
      eventEmitter.addListener(
        'onBackgroundDeviceFound',
        onBackgroundDeviceFound,
      ),
    ];
  }

  function onConnecting(event) {
    console.log('onConnecting: ', event);
    onEvents?.onConnecting?.(event);
  }

  async function onDeviceDisconnected(event) {
    console.log('onDeviceDisconnected: ', event);
    await startDiscovery();
    onEvents?.onDeviceDisconnected?.(event);
  }

  function onConnectionError(event) {
    console.log('onConnectionError: ', event);
    onEvents?.onConnectionError?.(event);
  }

  function onAuthenticationRequired(event) {
    onEvents?.onAuthenticationRequired?.(event);
  }

  async function onConnected(event) {
    console.log('onConnected: ', event);
    await stopDiscovery();
    onEvents?.onConnected?.(event);
  }

  function onDeviceFound(event) {
    console.log('Device found:', event);
    onEvents?.onDeviceFound?.(event);
  }

  function onBackgroundDeviceFound(event) {
    console.log('Background device found:', event);
    onEvents?.onBackgroundDeviceFound?.(event);
  }

  function onVehicleState(event) {
    onEvents?.onVehicleState?.(event);
  }

  // ==========================================
  // Return Statement
  // ==========================================
  return {
    startScanning,
    startBondScanning,
    getDeviceConfiguration,
    clearDevice: disconnectDevice,
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
    connectToBondedDevice,
    isBackgroundScanningActive,
    getBackgroundScanStatus,
    checkAndEnableAutoConnect,
    addDeviceToAutoConnect,
    removeDeviceFromAutoConnect,
    clearAutoConnectList,
    isDeviceConnected,
    getConnectedDevice,
    getAutoConnectAddresses,
    hasOngoingAxisAlignment,
    readAccAxisAlignmentValues,
  };
};

export default useSafetyTag;
