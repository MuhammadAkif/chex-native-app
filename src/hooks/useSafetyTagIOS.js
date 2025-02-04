import {useEffect} from 'react';
import {NativeModules, NativeEventEmitter} from 'react-native';

const {SafetyTagModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(SafetyTagModule);

const useSafetyTagIOS = () => {
  useEffect(() => {
    startObserving().then();
    onDeviceReady();

    return () => stopObserving();
  }, []);

  function onDeviceReady() {
    eventEmitter.addListener('onDeviceDiscovered', event => {
      console.log('Device discovered:', event);
    });
    eventEmitter.addListener('onDeviceConnected', event => {
      console.log('Device connected:', event);
    });
    eventEmitter.addListener('onDeviceConnectionFailed', event => {
      console.error('Connection failed:', event);
    });
    eventEmitter.addListener('onDeviceDisconnected', event => {
      console.log('Device disconnected:', event);
    });
    eventEmitter.addListener('onGetConnectedDevice', event => {
      console.log('Got connected device info:', event);
    });
    eventEmitter.addListener('onCheckConnection', event => {
      console.log('Connection status:', event);
    });
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
      await SafetyTagModule.startObserving();
    } catch (error) {
      console.error('Error stopping observation:', error);
    }
  }

  const startScan = async () => {
    try {
      console.log('Starting scan for SafetyTag devices...');
      await SafetyTagModule.startScan();
    } catch (error) {
      console.error('Error starting scan:', error);
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

  return {
    startObserving,
    stopObserving,
    startScan,
    checkConnection,
    disconnectDevice,
    getDeviceInformation,
    getTrips,
    getTripsWithFraudDetection,
  };
};

export default useSafetyTagIOS;
