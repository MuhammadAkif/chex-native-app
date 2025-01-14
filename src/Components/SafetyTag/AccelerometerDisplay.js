import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  NativeModules,
} from 'react-native';
import {DeviceEventEmitter} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import useSafetyTag from '../../hooks/useSafetyTag';
import {colors} from '../../Assets/Styles';

const {SafetyTagModule} = NativeModules;

const AccelerometerDisplay = () => {
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [alignmentStatus, setAlignmentStatus] = useState('Not Started');
  const [isTracking, setIsTracking] = useState(false);
  let watchId = null;
  const {
    subscribeToAccelerometerData,
    enableAccelerometerDataStream,
    disableAccelerometerDataStream,
    startAxisAlignment,
    stopAxisAlignment,
    isAlignmentRunning,
  } = useSafetyTag();
  const [alignmentDetails, setAlignmentDetails] = useState({
    movement: 'UNKNOWN',
    speed: 'UNKNOWN',
    currentSpeed: 0,
    currentHeading: 0,
  });
  const [isServiceRunning, setIsServiceRunning] = useState(false);

  const checkServiceStatus = async () => {
    const running = await isAlignmentRunning();
    setIsServiceRunning(running);
  };

  useEffect(() => {
    const accelerometerSubscription = DeviceEventEmitter.addListener(
      'onAccelerometerData',
      event => {
        setAccelerometerData(event);
      },
    );

    const alignmentSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentStateChange',
      event => {
        setAlignmentStatus(event.step);
        setAlignmentDetails({
          movement: event.movement,
          speed: event.speed,
          currentSpeed: event.currentSpeed,
          currentHeading: event.currentHeading,
        });
      },
    );

    const locationStartSubscription = DeviceEventEmitter.addListener(
      'startLocationUpdates',
      startLocationTracking,
    );

    const locationStopSubscription = DeviceEventEmitter.addListener(
      'stopLocationUpdates',
      stopLocationTracking,
    );

    const statusInterval = setInterval(checkServiceStatus, 1000);

    const successSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentSuccess',
      async () => {
        Alert.alert('Success', 'Axis alignment completed successfully');
        await stopAxisAlignment();
      },
    );

    const stoppedSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentStopped',
      event => {
        Alert.alert('Stopped', `Alignment stopped: ${event.reason}`);
      },
    );

    return () => {
      accelerometerSubscription.remove();
      alignmentSubscription.remove();
      locationStartSubscription.remove();
      locationStopSubscription.remove();
      stopLocationTracking();
      clearInterval(statusInterval);
      successSubscription.remove();
      stoppedSubscription.remove();
    };
  }, []);

  const handleStartStream = async () => {
    subscribeToAccelerometerData();
    await enableAccelerometerDataStream();
  };

  const handleStopStream = async () => {
    await disableAccelerometerDataStream();
  };

  const handleStartAlignment = async () => {
    try {
      await startAxisAlignment();
      await checkServiceStatus();
    } catch (error) {
      console.error('Error starting alignment:', error);
      Alert.alert('Error', 'Failed to start alignment');
    }
  };

  const handleStopAlignment = async () => {
    try {
      await stopAxisAlignment();
      await checkServiceStatus();
    } catch (error) {
      console.error('Error stopping alignment:', error);
      Alert.alert('Error', 'Failed to stop alignment');
    }
  };

  const startLocationTracking = async () => {
    try {
      setIsTracking(true);
      watchId = Geolocation.watchPosition(
        position => {
          const {coords, timestamp} = position;
          const speed = coords.speed || 0; // meters per second
          const heading = coords.heading || 0;
          const elapsedRealtime = Date.now(); // This is an approximation

          SafetyTagModule.updateAxisAlignmentLocation(
            heading,
            speed,
            timestamp,
            elapsedRealtime,
          );
        },
        error => {
          console.error('Location error:', error);
          Alert.alert('Error', 'Failed to get location updates');
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 1000,
          fastestInterval: 500,
        },
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      Alert.alert('Error', 'Failed to start location tracking');
    }
  };

  const stopLocationTracking = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      watchId = null;
    }
    setIsTracking(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accelerometer Data</Text>
      {accelerometerData && (
        <View style={styles.dataContainer}>
          <Text style={styles.textAxis}>
            X: {accelerometerData.xAxis.toFixed(2)} mg
          </Text>
          <Text style={styles.textAxis}>
            Y: {accelerometerData.yAxis.toFixed(2)} mg
          </Text>
          <Text style={styles.textAxis}>
            Z: {accelerometerData.zAxis.toFixed(2)} mg
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Start Stream" onPress={handleStartStream} />
        <Button title="Stop Stream" onPress={handleStopStream} />
      </View>

      <View style={styles.alignmentContainer}>
        <Text style={styles.title}>Axis Alignment</Text>
        <Text style={styles.title}>Status: {alignmentStatus}</Text>
        <Text style={styles.title}>
          Location Tracking: {isTracking ? 'Active' : 'Inactive'}
        </Text>
        <Text style={styles.title}>
          Background Service: {isServiceRunning ? 'Running' : 'Stopped'}
        </Text>

        <View style={styles.alignmentDetails}>
          <Text style={styles.textAxis}>
            Movement: {alignmentDetails.movement}
          </Text>
          <Text style={styles.textAxis}>
            Speed Status: {alignmentDetails.speed}
          </Text>
          <Text style={styles.textAxis}>
            Current Speed: {(alignmentDetails.currentSpeed * 3.6).toFixed(1)}{' '}
            km/h
          </Text>
          <Text style={styles.textAxis}>
            Heading: {alignmentDetails.currentHeading.toFixed(1)}°
          </Text>
        </View>

        {alignmentStatus === 'FINDING_X_AXIS_ANGLE' && (
          <View style={styles.instructions}>
            <Text style={[styles.instructionTitle, styles.textAxis]}>
              Instructions:
            </Text>
            <Text style={styles.textAxis}>1. Drive in a straight line</Text>
            <Text style={styles.textAxis}>
              2. Maintain speed between 4-60 km/h
            </Text>
            <Text style={styles.textAxis}>3. Gently accelerate or brake</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={isServiceRunning ? 'Stop Alignment' : 'Start Alignment'}
            onPress={
              isServiceRunning ? handleStopAlignment : handleStartAlignment
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  alignmentContainer: {
    marginTop: 20,
    backgroundColor: colors.black,
  },
  textAxis: {
    color: colors.black,
  },
  alignmentDetails: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  instructions: {
    backgroundColor: '#e6f3ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  instructionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default AccelerometerDisplay;
