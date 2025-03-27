import {useEffect, useState} from 'react';
import {NativeModules, NativeEventEmitter} from 'react-native';

const {SafetyTagModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(SafetyTagModule);

const useSafetyTagIOS = onEvents => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    startObserving().then();
    const subscriptions = onDeviceReady();

    return () => {
      stopObserving().then();
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  function onDeviceReady() {
    return [
      eventEmitter.addListener('onDeviceDiscovered', onDeviceDiscovered),
      eventEmitter.addListener('onDeviceConnected', onDeviceConnected),
      eventEmitter.addListener(
        'onDeviceConnectionFailed',
        onDeviceConnectionFailed,
      ),
      eventEmitter.addListener('onDeviceDisconnected', onDeviceDisconnected),
      eventEmitter.addListener('onGetConnectedDevice', onGetConnectedDevice),
      eventEmitter.addListener('onCheckConnection', onCheckConnection),
      eventEmitter.addListener('onTripStarted', onTripStarted),
      eventEmitter.addListener('onTripEnded', onTripEnded),
      eventEmitter.addListener('onTripsReceived', onTripsReceived),
      eventEmitter.addListener('onCrashThreshold', onCrashThreshold),
      eventEmitter.addListener('onCrashEvent', onCrashEvent),
    ];
  }

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
  }

  function onDeviceConnected(event) {
    console.log('Device connected:', event);
    setIsScanning(false);
    onEvents.onDeviceConnected(event);
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

  function onCrashThreshold(event) {
    console.log('Crash threshold event:', event);
    onEvents.onCrashThreshold(event);
  }

  function onCrashEvent(event) {
    console.log('Crash event:', event);
    onEvents.onCrashEvent(event);
  }

  async function startObserving() {
    try {
      console.log('Starting observation...');
      await SafetyTagModule.startObserving();
    } catch (error) {
      console.error('Error starting observation:', error);
    }
  }

  async function stopObserving() {
    try {
      console.log('Stopping observation...');
      await SafetyTagModule.stopObserving();
    } catch (error) {
      console.error('Error stopping observation:', error);
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
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
    }
  };

  const stopScan = async () => {
    try {
      console.log('Stopping scan...');
      setIsScanning(false);
      await SafetyTagModule.stopScan();
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  };

  const checkConnection = async () => {
    try {
      console.log('Checking SafetyTag connection...');
      await SafetyTagModule.checkConnection();
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connectToDevice = async device => {
    try {
      await SafetyTagModule.connectDevice(device.id);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const disconnectDevice = async () => {
    try {
      console.log('Disconnecting SafetyTag Device...');
      await SafetyTagModule.disconnectDevice();
    } catch (error) {
      console.error('Error Disconnecting SafetyTag Device:', error);
    }
  };

  const getDeviceInformation = async () => {
    try {
      console.log('Fetching SafetyTag Device Information...');
      await SafetyTagModule.getConnectedDevice();
    } catch (error) {
      console.error('Error Fetching SafetyTag Device Information:', error);
    }
  };

  const getTrips = async () => {
    await SafetyTagModule.getTrips();
  };

  const getTripsWithFraudDetection = async () => {
    await SafetyTagModule.getTripsWithFraudDetection();
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
    } catch (error) {
      console.error('Error disabling accelerometer data stream:', error);
    }
  };

  const isAccelerometerDataStreamEnabled = () => {
    try {
      console.log('Checking accelerometer data stream status...');
      SafetyTagModule.isAccelerometerDataStreamEnabled();
    } catch (error) {
      console.error('Error checking accelerometer data stream enable:', error);
    }
  };

  return {
    devices,
    isScanning,
    startScan,
    stopScan,
    startObserving,
    stopObserving,
    checkConnection,
    connectToDevice,
    disconnectDevice,
    getDeviceInformation,
    getTrips,
    getTripsWithFraudDetection,
    enableAccelerometerDataStream,
    disableAccelerometerDataStream,
    isAccelerometerDataStreamEnabled,
  };
};

export default useSafetyTagIOS;
