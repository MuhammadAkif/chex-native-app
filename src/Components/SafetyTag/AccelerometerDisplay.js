import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {DeviceEventEmitter} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import useSafetyTag from '../../hooks/useSafetyTag';
import {colors} from '../../Assets/Styles';
import {PrimaryGradientButton} from '../index';

const {black, gray} = colors;

const AccelerometerDisplay = () => {
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [alignmentStatus, setAlignmentStatus] = useState('Not Started');
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
        console.log('alignment state', event);
      },
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
    setAccelerometerData(null);
  };

  const handleStartAlignment = async () => {
    try {
      await handleStartStream();
      await startAxisAlignment(false);
      await checkServiceStatus();
    } catch (error) {
      console.error('Error starting alignment:', error);
      Alert.alert('Error', 'Failed to start alignment');
    }
  };

  const handleStopAlignment = async () => {
    try {
      await handleStopStream();
      await stopAxisAlignment();
      await checkServiceStatus();
    } catch (error) {
      console.error('Error stopping alignment:', error);
      Alert.alert('Error', 'Failed to stop alignment');
    }
  };

  return (
    <View style={styles.container}>
      {accelerometerData && (
        <View style={styles.dataContainer}>
          <Text style={styles.title}>Accelerometer Data</Text>
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

      <View style={styles.alignmentContainer}>
        <Text style={styles.title}>Axis Alignment</Text>
        <Text style={styles.title}>Status: {alignmentStatus}</Text>
        <Text style={styles.title}>
          Service: {isServiceRunning ? 'Running' : 'Stopped'}
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
            <Text style={[styles.instructionTitle, styles.textColor]}>
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
          <PrimaryGradientButton
            text={'Start Alignment'}
            onPress={handleStartAlignment}
          />
          <PrimaryGradientButton
            text={'Stop Alignment'}
            onPress={handleStopAlignment}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp('2%'),
    rowGap: wp('2%'),
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
  },
  dataContainer: {
    gap: wp('0.6%'),
    padding: wp('3%'),
    backgroundColor: gray,
  },
  buttonContainer: {
    marginTop: hp('1%'),
    gap: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignmentContainer: {
    gap: wp('0.6%'),
    padding: wp('3%'),
    backgroundColor: gray,
  },
  textAxis: {
    fontSize: hp('1.8%'),
    color: black,
  },
  alignmentDetails: {
    gap: wp('0.6%'),
    padding: wp('3%'),
    backgroundColor: '#f0f0f0',
  },
  instructions: {
    gap: wp('0.6%'),
    padding: wp('3%'),
  },
  instructionTitle: {
    fontWeight: 'bold',
  },
  textColor: {
    color: black,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: wp('3%'),
    borderRadius: 5,
    marginVertical: wp('2%'),
  },
  warningText: {
    color: '#856404',
    fontSize: hp('1.8%'),
  },
  alignmentValues: {
    marginTop: wp('2%'),
    gap: wp('0.6%'),
  },
});

export default AccelerometerDisplay;
