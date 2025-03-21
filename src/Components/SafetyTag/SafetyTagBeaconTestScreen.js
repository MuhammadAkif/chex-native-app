import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';
import {SafetyTagBeaconTest} from './SafetyTagBeaconTest';

const {SafetyTagModule} = NativeModules;

export const SafetyTagBeaconTestScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const subscriptions = [
      DeviceEventEmitter.addListener(
        'onDeviceDiscovered',
        handleDeviceDiscovered,
      ),
      DeviceEventEmitter.addListener(
        'onDeviceConnected',
        handleDeviceConnected,
      ),
      DeviceEventEmitter.addListener(
        'onDeviceDisconnected',
        handleDeviceDisconnected,
      ),
      DeviceEventEmitter.addListener(
        'onDeviceConnectionFailed',
        handleConnectionFailed,
      ),
      DeviceEventEmitter.addListener(
        'onGetConnectedDevice',
        onGetConnectedDevice,
      ),
    ];

    // Check if we already have a connected device
    checkConnectedDevice().then();

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
      // Stop scanning when component unmounts
      stopScan().then();
    };
  }, []);

  function onGetConnectedDevice(event) {
    if (!event.error) {
      console.log('Connected Device - SafetyTagIOS --:', event);
      setConnectedDevice(event);
    } else {
      setConnectedDevice(null);
    }
  }

  const checkConnectedDevice = async () => {
    try {
      await SafetyTagModule.getConnectedDevice();
    } catch (error) {
      console.error('Failed to get connected device:', error);
    }
  };

  const handleDeviceDiscovered = device => {
    console.log('📱 Discovered device:', device);
    setDiscoveredDevices(prev => {
      const exists = prev.some(d => d.id === device.id);
      if (!exists) {
        return [...prev, device];
      }
      return prev;
    });
  };

  const handleDeviceConnected = device => {
    console.log('✅ Device connected - SafetyTagBeaconScannerScreen:', device);
    setConnectedDevice(device);
    setIsScanning(false);
  };

  const handleDeviceDisconnected = device => {
    console.log('❌ Device disconnected:', device);
    setConnectedDevice(null);
  };

  const handleConnectionFailed = (device, error) => {
    console.error('Failed to connect:', error);
    setError(`Failed to connect to ${device.name}: ${error}`);
  };

  const startScan = async () => {
    try {
      setError(null);
      setIsScanning(true);
      setDiscoveredDevices([]);
      await SafetyTagModule.startScan(false); // Don't auto-connect during scanning
      console.log('🔍 Started scanning...');
    } catch (error) {
      console.error('Failed to start scan:', error);
      setError('Failed to start scanning: ' + error);
      setIsScanning(false);
    }
  };

  const stopScan = async () => {
    try {
      await SafetyTagModule.stopScan();
      setIsScanning(false);
      console.log('⏹️ Stopped scanning');
    } catch (error) {
      console.error('Failed to stop scan:', error);
    }
  };

  const connectToDevice = async device => {
    try {
      console.log('🔌 Connecting to device:', device);
      await SafetyTagModule.connectDevice(device.id);
    } catch (error) {
      console.error('Failed to connect:', error);
      setError('Failed to connect: ' + error);
    }
  };

  const disconnectDevice = async () => {
    try {
      console.log('🔌 Disconnecting device...');
      await SafetyTagModule.disconnectDevice();
      setConnectedDevice(null);
    } catch (error) {
      console.error('Failed to disconnect:', error);
      setError('Failed to disconnect: ' + error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>SafetyTag Beacon Testing</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Clear Error" onPress={() => setError(null)} />
        </View>
      )}

      {/* Connection Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Status</Text>
        {connectedDevice ? (
          <View>
            <Text style={styles.connected}>
              Connected to: {connectedDevice.name}
            </Text>
            <Button title="Disconnect" onPress={disconnectDevice} />
          </View>
        ) : (
          <Text style={styles.disconnected}>No device connected</Text>
        )}
      </View>

      {/* Scanning Controls */}
      {!connectedDevice && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Scanner</Text>
          <Button
            title={isScanning ? 'Stop Scan' : 'Start Scan'}
            onPress={isScanning ? stopScan : startScan}
          />
          {isScanning && <ActivityIndicator style={styles.spinner} />}
        </View>
      )}

      {/* Discovered Devices */}
      {!connectedDevice && discoveredDevices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovered Devices</Text>
          {discoveredDevices.map(device => (
            <View key={device.id} style={styles.deviceItem}>
              <Text>Name: {device.name}</Text>
              <Text>ID: {device.id}</Text>
              <Button title="Connect" onPress={() => connectToDevice(device)} />
            </View>
          ))}
        </View>
      )}

      {/* Beacon Test Component */}
      {connectedDevice && (
        <View style={styles.section}>
          <SafetyTagBeaconTest device={connectedDevice} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  connected: {
    color: 'green',
    fontSize: 16,
    marginBottom: 8,
  },
  disconnected: {
    color: 'red',
    fontSize: 16,
  },
  deviceItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  spinner: {
    marginTop: 8,
  },
});
