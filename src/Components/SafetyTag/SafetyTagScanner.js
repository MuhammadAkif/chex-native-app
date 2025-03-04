import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  DeviceEventEmitter,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import useSafetyTag from '../../hooks/useSafetyTag';
import DeviceList from './DeviceList';
import AccelerometerDisplay from './AccelerometerDisplay';
import {colors} from '../../Assets/Styles';
import ConnectedDevice from './ConnectedDevice';
import {isNotEmpty} from '../../Utils';
import ConnectionControls from './ConnectionControls';

const SafetyTagScanner = () => {
  const [scanStatus, setScanStatus] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const {
    startScanning,
    startBondScanning,
    disconnectDevice,
    subscribeToConnectionEvents,
    unsubscribeFromConnectionEvents,
    stopBackgroundScanning,
    getBackgroundScanStatus,
    isDeviceConnected,
    getConnectedDevice,
  } = useSafetyTag();

  useEffect(() => {
    subscribeToConnectionEvents().then();
    checkScanningStatus().then();

    DeviceEventEmitter.addListener('onConnected', event => {
      checkDeviceConnection().then();
      console.log('Successfully connected to the device:', event);
    });
    DeviceEventEmitter.addListener('onDeviceDisconnected', event => {
      console.log('Device is disconnected...');
      setConnectedDevice(null);
      // Handle the connecting event here (e.g., show loading spinner)
    });
    // Set up event listeners for background scanning
    const deviceFoundSubscription = DeviceEventEmitter.addListener(
      'onBackgroundDeviceFound',
      device => {
        console.log('Background device found:', device);
      },
    );

    return () => {
      deviceFoundSubscription.remove();
      unsubscribeFromConnectionEvents();
      stopBackgroundScanning().then();
    };
  }, []);

  const checkScanningStatus = async () => {
    try {
      const status = await getBackgroundScanStatus();
      setScanStatus(status);
    } catch (error) {
      console.error('Error checking scan status:', error);
    }
  };

  async function checkDeviceConnection() {
    try {
      const isConnected = await isDeviceConnected();
      console.log({isConnected});
      if (isConnected) {
        const device = await getConnectedDevice();
        setConnectedDevice(device);
        console.log('Connected Device:', device);
      } else {
        setConnectedDevice(null);
      }
    } catch (error) {
      console.error('Error checking device connection:', error);
      Alert.alert('Error', 'Failed to check device connection');
    }
  }

  async function handleScan() {
    try {
      await startScanning();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleBondScan() {
    try {
      await startBondScanning();
    } catch (error) {
      console.error(error);
    }
  }

  const handleDisconnectDevice = async () => {
    try {
      await disconnectDevice();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <DeviceList />
        <ConnectedDevice connectedDevice={connectedDevice} />
        <ConnectionControls
          handleScan={handleScan}
          handleBondScan={handleBondScan}
          checkDeviceConnection={checkDeviceConnection}
          handleDisconnectDevice={handleDisconnectDevice}
          isConnected={isNotEmpty(connectedDevice)}
        />
        {isNotEmpty(connectedDevice) && <AccelerometerDisplay />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  scroll: {
    gap: wp('2%'),
  },
});

export default SafetyTagScanner;
