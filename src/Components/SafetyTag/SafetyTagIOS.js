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
import SafetyTagTrips from './SafetyTagTrips';
import SafetyTagAxisAlignment from './SafetyTagAxisAlignment';
import {formatUnixTime} from '../../Utils/helpers';

const SafetyTagIOS = () => {
  const {
    startScan,
    checkConnection,
    disconnectDevice,
    getDeviceInformation,
    getTrips,
    getTripsWithFraudDetection,
    enableAccelerometerDataStream,
    disableAccelerometerDataStream,
    isAccelerometerDataStreamEnabled,
  } = useSafetyTagIOS();
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [trips, setTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  useEffect(() => {
    const subscriptions = [
      DeviceEventEmitter.addListener('onDeviceConnected', event => {
        setConnectedDevice(event);
        setIsConnected(true);
      }),
      DeviceEventEmitter.addListener('onDeviceConnectionFailed', event => {
        setConnectedDevice(null);
        setIsConnected(false);
      }),
      DeviceEventEmitter.addListener('onDeviceDisconnected', event => {
        setConnectedDevice(null);
        setIsConnected(false);
        setCurrentTrip(null);
      }),
      DeviceEventEmitter.addListener('onGetConnectedDevice', event => {
        if (!event.error) {
          setConnectedDevice(event);
          setIsConnected(true);
        } else {
          setConnectedDevice(null);
          setIsConnected(false);
        }
      }),
      DeviceEventEmitter.addListener('onCheckConnection', event => {
        setIsConnected(event.isConnected);
      }),
      DeviceEventEmitter.addListener('onTripStarted', event => {
        console.log('Trip Started:', event);
        if (!event.error) {
          const {deviceId, deviceName, tripEvent, secondsSinceLastRestart} =
            event;
          setCurrentTrip({
            deviceId,
            deviceName,
            tripEvent: formatUnixTime(tripEvent),
            secondsSinceLastRestart,
            isOngoing: true,
          });
        }
      }),
      DeviceEventEmitter.addListener('onTripEnded', event => {
        console.log('Trip Ended:', event);
        if (!event.error) {
          const {deviceId, deviceName, tripEvent, secondsSinceLastRestart} =
            event;
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
      }),
      DeviceEventEmitter.addListener('onTripsReceived', event => {
        setIsLoadingTrips(false);
        console.log('Trips Received:', event);
        if (!event.error) {
          setTrips(event.trips || []);
        } else {
          console.error('Failed to get trips:', event.error);
        }
      }),
      DeviceEventEmitter.addListener('onAccelerometerData', event => {
        console.log('Accelerometer Data:', {
          x: event.x,
          y: event.y,
          z: event.z,
          timestamp: new Date(event.timestamp).toISOString()
        });
      }),
      DeviceEventEmitter.addListener('onAccelerometerError', event => {
        console.error('Accelerometer Error:', event.error);
      }),
      DeviceEventEmitter.addListener('onAccelerometerStreamStatus', event => {
        console.log('Accelerometer Stream Status:', event.isEnabled);
      }),
    ];

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

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

  const handleGetDeviceInformation = async () => {
    try {
      console.log('Fetching SafetyTag Device Information...');
      await getDeviceInformation();
    } catch (error) {
      console.error('Error Fetching SafetyTag Device Information:', error);
    }
  };

  const handleGetTrips = async () => {
    try {
      console.log('Fetching SafetyTag Trips...');
      setIsLoadingTrips(true);
      await getTrips();
    } catch (error) {
      console.error('Error Fetching SafetyTag Trips:', error);
      setIsLoadingTrips(false);
    }
  };

  const handleGetTripsWithFraudDetection = async () => {
    try {
      console.log('Fetching SafetyTag Trips with Fraud Detection...');
      setIsLoadingTrips(true);
      await getTripsWithFraudDetection();
    } catch (error) {
      console.error(
        'Error Fetching SafetyTag Trips with Fraud Detection:',
        error,
      );
      setIsLoadingTrips(false);
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

        {currentTrip && (
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

        <SafetyTagTrips trips={trips} isLoading={isLoadingTrips} />

        {isConnected && <SafetyTagAxisAlignment />}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStartScan}>
            <Text style={styles.buttonText}>Start Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={handleCheckConnection}>
            <Text style={styles.buttonText}>Check Connection</Text>
          </TouchableOpacity>

          <TouchableOpacity
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
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={handleIsAccelerometerEnabled}>
            <Text style={styles.buttonText}>
              Check Accelerometer Status
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={enableAccelerometerDataStream}>
            <Text style={styles.buttonText}>
              Enable Accelerometer Data Stream
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={disableAccelerometerDataStream}>
            <Text style={styles.buttonText}>
              Disable Accelerometer Data Stream
            </Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonMargin: {
    marginTop: 12,
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  currentTripContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  currentTripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  currentTripInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});

export default SafetyTagIOS;
