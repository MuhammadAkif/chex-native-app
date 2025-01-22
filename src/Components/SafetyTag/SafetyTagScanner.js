import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  DeviceEventEmitter,
  Button,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import useSafetyTag from '../../hooks/useSafetyTag';
import {formatRawData} from '../../Utils/helpers';
import DeviceList from './DeviceList';
import AccelerometerDisplay from './AccelerometerDisplay';
import CrashTestingTool from './CrashTestingTool';

const SafetyTagScanner = () => {
  const [tripData, setTripData] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const {
    startScanning,
    startBondScanning,
    getDeviceConfiguration,
    disconnectDevice,
    subscribeToConnectionEvents,
    unsubscribeFromConnectionEvents,
    queryTripData,
    queryTripWithFraudData,
    startBackgroundScanning,
    stopBackgroundScanning,
    isBackgroundScanningActive,
    getBackgroundScanStatus,
    getDeviceInformation,
    isDeviceConnected,
    getConnectedDevice,
  } = useSafetyTag();

  useEffect(() => {
    subscribeToConnectionEvents().then();
    checkScanningStatus().then();

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
      stopBackgroundScanning().catch(console.error);
    };
  }, []);

  const checkScanningStatus = async () => {
    try {
      const isActive = await isBackgroundScanningActive();
      const status = await getBackgroundScanStatus();
      setIsScanning(isActive);
      setScanStatus(status);
    } catch (error) {
      console.error('Error checking scan status:', error);
    }
  };

  const checkDeviceConnection = async () => {
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
  };

  async function handleBackgroundScan() {
    try {
      if (!isScanning) {
        await startBackgroundScanning();
        setIsScanning(true);
      } else {
        await stopBackgroundScanning();
        setIsScanning(false);
      }
      await checkScanningStatus();
    } catch (error) {
      console.error('Error toggling background scan:', error);
      Alert.alert('Error', 'Failed to toggle background scanning');
    }
  }

  async function handleScan() {
    try {
      await startScanning();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetDeviceConfiguration() {
    try {
      await getDeviceConfiguration();
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

  const handleQueryTripData = async () => {
    try {
      const rawData = await queryTripData();
      // Parse and format the trip data
      const trips = formatRawData(rawData);
      setTripData(trips);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const handleQueryTripDataWithFraud = async () => {
    try {
      const rawData = await queryTripWithFraudData();
      // Parse and format the trip data
      const trips = formatRawData(rawData);
      setTripData(trips);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderTripItem = ({item}) => {
    const {receiveNumber, startUnixTime, endUnixTime, connectedDuringTrip} =
      item;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Trip #{receiveNumber}</Text>
        <Text style={styles.title}>Start Time: {startUnixTime}</Text>
        <Text style={styles.title}>End Time: {endUnixTime}</Text>
        <Text style={styles.title}>
          Connected During Trip: {connectedDuringTrip || 'N/A'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DeviceList />
      {connectedDevice && (
        <View style={styles.deviceInfoContainer}>
          <Text style={styles.deviceInfoTitle}>Connected Device</Text>
          <Text style={styles.deviceInfoText}>
            Address: {connectedDevice.address}
          </Text>
          <Text style={styles.deviceInfoText}>
            Bond Status: {connectedDevice.isBonded ? 'Bonded' : 'Not Bonded'}
          </Text>
          <Text style={styles.deviceInfoText}>
            RSSI: {connectedDevice.rssi} dBm
          </Text>
          <Text style={styles.deviceInfoText}>
            Mode: {connectedDevice.advertisementMode}
          </Text>
        </View>
      )}
      <Button title="Scan for Safety Tag" onPress={handleScan} />
      <Button title="Scan for Bond Safety Tag" onPress={handleBondScan} />
      <Button title="Check Connection" onPress={checkDeviceConnection} />
      <Button
        title={
          isScanning ? 'Stop Background Scanning' : 'Start Background Scanning'
        }
        onPress={handleBackgroundScan}
      />
      <Button
        title="Disconnect connected Device"
        onPress={handleDisconnectDevice}
      />
      <View style={[styles.tripContainer, styles.gap]}>
        <Button title="Query Trip Data" onPress={handleQueryTripData} />
        <Button
          title="Query Trip Data With Fraud"
          onPress={handleQueryTripDataWithFraud}
        />
        <FlatList
          data={tripData}
          renderItem={renderTripItem}
          style={styles.tripList}
          keyExtractor={item => item.receiveNumber.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/*<AccelerometerDisplay />*/}
      {/*<CrashTestingTool />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  tripList: {
    height: hp('100%'),
    width: wp('100%'),
    backgroundColor: 'gray',
  },
  tripContainer: {
    height: hp('60%'),
  },
  gap: {
    rowGap: wp('2%'),
  },
  section: {
    marginVertical: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  list: {
    maxHeight: 200,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  statusContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesContainer: {
    flex: 1,
  },
  deviceItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  controlsContainer: {
    flex: 1,
    padding: 20,
  },
  disconnectButton: {
    backgroundColor: '#f44336',
  },
  noDevicesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  deviceText: {
    marginBottom: 5,
  },
  autoConnectButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deviceInfoContainer: {
    padding: 15,
    margin: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  deviceInfoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});

export default SafetyTagScanner;
