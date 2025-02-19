import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';

import {useSafetyTagIOS} from '../../hooks';
import {SafetyTagDeviceInfo} from '../index';
import SafetyTagAxisAlignment from './SafetyTagAxisAlignment';
import {formatUnixTime} from '../../Utils/helpers';
import DeviceScan from './DeviceScan';
import {colors} from '../../Assets/Styles';
import {SafetyTagBeaconTestScreen} from './SafetyTagBeaconTestScreen';

const SafetyTagIOS = () => {
  const {
    devices,
    isScanning,
    startScan,
    checkConnection,
    connectToDevice,
    disconnectDevice,
    isAccelerometerDataStreamEnabled,
    enableAccelerometerDataStream,
    disableAccelerometerDataStream,
  } = useSafetyTagIOS();
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [trips, setTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  useEffect(() => {
    const subscriptions = [
      DeviceEventEmitter.addListener('onDeviceConnected', onDeviceConnected),
      DeviceEventEmitter.addListener(
        'onDeviceConnectionFailed',
        onDeviceConnectionFailed,
      ),
      DeviceEventEmitter.addListener(
        'onDeviceDisconnected',
        onDeviceDisconnected,
      ),
      DeviceEventEmitter.addListener(
        'onGetConnectedDevice',
        onGetConnectedDevice,
      ),
      DeviceEventEmitter.addListener('onCheckConnection', onCheckConnection),
      DeviceEventEmitter.addListener('onTripStarted', onTripStarted),
      DeviceEventEmitter.addListener('onTripEnded', onTripEnded),
      DeviceEventEmitter.addListener('onTripsReceived', onTripsReceived),
      DeviceEventEmitter.addListener(
        'onAccelerometerData',
        onAccelerometerData,
      ),
      DeviceEventEmitter.addListener(
        'onAccelerometerError',
        onAccelerometerError,
      ),
      DeviceEventEmitter.addListener(
        'onAccelerometerStreamStatus',
        onAccelerometerStreamStatus,
      ),
    ];

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  function onDeviceConnected(event) {
    setConnectedDevice(event);
    setIsConnected(true);
  }

  function onDeviceConnectionFailed(event) {
    setConnectedDevice(null);
    setIsConnected(false);
  }

  function onDeviceDisconnected(event) {
    setConnectedDevice(null);
    setIsConnected(false);
    setCurrentTrip(null);
  }

  function onGetConnectedDevice(event) {
    if (!event.error) {
      setConnectedDevice(event);
      setIsConnected(true);
    } else {
      setConnectedDevice(null);
      setIsConnected(false);
    }
  }

  function onCheckConnection(event) {
    setIsConnected(event.isConnected);
  }

  function onTripStarted(event) {
    // console.log('Trip Started:', event);
    if (!event.error) {
      const {deviceId, deviceName, tripEvent, secondsSinceLastRestart} = event;
      setCurrentTrip({
        deviceId,
        deviceName,
        tripEvent: formatUnixTime(tripEvent),
        secondsSinceLastRestart,
        isOngoing: true,
      });
    }
  }

  function onTripEnded(event) {
    // console.log('Trip Ended:', event);
    if (!event.error) {
      const {deviceId, deviceName, tripEvent, secondsSinceLastRestart} = event;
      const endedTrip = {
        deviceId,
        deviceName,
        tripEvent: formatUnixTime(tripEvent),
        secondsSinceLastRestart,
        isOngoing: false,
      };
      setCurrentTrip(null);
      setTrips(prevTrips => [endedTrip, ...prevTrips]);
    }
  }

  function onTripsReceived(event) {
    setIsLoadingTrips(false);
    // console.log('Trips Received:', event);
    if (!event.error) {
      setTrips(event.trips || []);
    } else {
      console.error('Failed to get trips:', event.error);
    }
  }

  function onAccelerometerData(event) {
    const {x, y, z, secondsSinceLastRestart} = event;
    /*console.log('Accelerometer Data:', {
      x,
      y,
      z,
      secondsSinceLastRestart,
    });*/
  }

  function onAccelerometerError(event) {
    console.error('Accelerometer Error:', event.error);
  }

  function onAccelerometerStreamStatus(event) {
    console.log('Accelerometer Stream Status:', event.isEnabled);
  }

  const handleStartScan = async () => {
    try {
      console.log('Starting scan for SafetyTag devices...');
      await startScan();
    } catch (error) {
      console.error('Error starting scan:', error);
    }
  };

  const handleCheckConnection = async () => {
    try {
      console.log('Checking SafetyTag connection...');
      await checkConnection();
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleDisconnectDevice = async () => {
    try {
      console.log('Disconnecting SafetyTag Device...');
      await disconnectDevice();
      setConnectedDevice(null);
      setIsConnected(false);
      setCurrentTrip(null);
    } catch (error) {
      console.error('Error Disconnecting SafetyTag Device:', error);
    }
  };

  const handleIsAccelerometerEnabled = async () => {
    try {
      const isEnabled = await isAccelerometerDataStreamEnabled();
      console.log('Accelerometer stream status:', isEnabled);
      return isEnabled;
    } catch (error) {
      console.error('Error checking accelerometer status:', error);
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>SafetyTag Scanner</Text>

        <SafetyTagDeviceInfo
          isConnected={isConnected}
          connectedDevice={connectedDevice}
        />

        {/* {currentTrip && (
          <View style={styles.currentTripContainer}>
            <Text style={styles.currentTripTitle}>Ongoing Trip</Text>
            <Text style={styles.currentTripInfo}>
              Device: {currentTrip.deviceName}
            </Text>
            <Text style={styles.currentTripInfo}>
              Started: {currentTrip.tripEvent}
            </Text>
          </View>
        )}

        <SafetyTagTrips trips={trips} isLoading={isLoadingTrips} />*/}

        {isConnected && <SafetyTagAxisAlignment />}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStartScan}>
            <Text style={styles.buttonText}>Start Scan</Text>
          </TouchableOpacity>
          {isScanning && (
            <DeviceScan
              devices={devices}
              isScanning={isScanning}
              onDeviceSelect={connectToDevice}
            />
          )}
          <SafetyTagBeaconTestScreen />
          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={handleCheckConnection}>
            <Text style={styles.buttonText}>Check Connection</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={handleGetDeviceInformation}>
            <Text style={styles.buttonText}>Refresh Device Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={handleGetTrips}>
            <Text style={styles.buttonText}>Get Trips</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={handleGetTripsWithFraudDetection}>
            <Text style={styles.buttonText}>
              Get Trips (with Fraud Detection)
            </Text>
          </TouchableOpacity>*/}
          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={enableAccelerometerDataStream}>
            <Text style={styles.buttonText}>Enable Accelerometer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={disableAccelerometerDataStream}>
            <Text style={styles.buttonText}>Disable Accelerometer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={handleIsAccelerometerEnabled}>
            <Text style={styles.buttonText}>Check Accelerometer Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonMargin,
              styles.disconnectButton,
            ]}
            onPress={handleDisconnectDevice}>
            <Text style={styles.buttonText}>Disconnect Device</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonMargin: {
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
  },
  currentTripContainer: {
    backgroundColor: '#E3F2FD',
    borderColor: '#90CAF9',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  currentTripInfo: {
    color: '#333',
    fontSize: 14,
    marginBottom: 4,
  },
  currentTripTitle: {
    color: '#1976D2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  detailsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
  },
  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
  },
  errorText: {
    color: colors.white,
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  statusContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  statusText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
  statusTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default SafetyTagIOS;
