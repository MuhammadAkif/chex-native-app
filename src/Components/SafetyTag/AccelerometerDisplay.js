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
import {PhaseList, InstructionsPanel} from './AlignmentComponents';

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
    isDeviceConnected,
  } = useSafetyTag();
  const [alignmentDetails, setAlignmentDetails] = useState({
    movement: 'UNKNOWN',
    speed: 'UNKNOWN',
    currentSpeed: 0,
    currentHeading: 0,
    step: null,
  });

  const checkServiceStatus = async () => {
    const isActive = await isAlignmentRunning();
    console.log('isActiveAlignment', isActive);
    return isActive;
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
        //Need to work on this
        console.log('current step', event.step);
        console.log('prev step', alignmentDetails.step);
        if (event.step !== alignmentDetails.step) {
          setAlignmentDetails(event);
          console.log('alignment state changed to:', event.step);
        }
      },
    );

    const successSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentSuccess',
      async () => {
        setAlignmentDetails(prev => ({...prev, step: 'PROCESS_COMPLETED'}));
        Alert.alert('Success', 'Axis alignment completed successfully');
        await stopAxisAlignment();
      },
    );

    const stoppedSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentStopped',
      event => {
        setAlignmentStatus('Started');
        Alert.alert('Stopped', `Alignment stopped: ${event.reason}`);
      },
    );

    return () => {
      accelerometerSubscription.remove();
      alignmentSubscription.remove();
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
      setAlignmentDetails(prev => ({...prev, step: 'STARTING'}));
      await startAxisAlignment(false);
      setAlignmentStatus('Started');
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
      {/*{accelerometerData && (
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
      )}*/}

      <View style={styles.alignmentContainer}>
        <Text style={styles.title}>Axis Alignment</Text>
        <Text style={styles.title}>
          Status: {alignmentDetails?.step || 'Not Started'}
        </Text>
        <Text style={styles.title}>Service: {alignmentStatus}</Text>

        <PhaseList currentPhase={alignmentDetails?.step} />
        <InstructionsPanel phase={alignmentDetails?.step} />

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
    width: wp('100%'),
    rowGap: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
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
    width: wp('90%'),
    backgroundColor: gray,
    borderRadius: wp('2%'),
  },
  textAxis: {
    fontSize: hp('1.8%'),
    color: black,
  },
  alignmentDetails: {
    gap: wp('0.6%'),
    padding: wp('3%'),
    borderRadius: wp('2%'),
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
  phaseListContainer: {
    marginVertical: wp('2%'),
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: wp('2%'),
  },
  phaseListTitle: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
    marginBottom: wp('2%'),
  },
  phaseItem: {
    marginBottom: wp('2%'),
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('1%'),
  },
  phaseStatus: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
  },
  completed: {
    backgroundColor: '#4CAF50',
  },
  current: {
    backgroundColor: '#2196F3',
  },
  pending: {
    backgroundColor: '#e0e0e0',
  },
  statusIcon: {
    color: '#fff',
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
  },
  phaseTitle: {
    fontSize: hp('1.8%'),
    color: black,
  },
  currentPhaseTitle: {
    fontWeight: 'bold',
  },
  phaseDescription: {
    fontSize: hp('1.6%'),
    color: '#666',
    marginLeft: wp('8%'),
  },
  instructionsPanel: {
    backgroundColor: '#E3F2FD',
    padding: wp('3%'),
    borderRadius: 8,
    marginVertical: wp('2%'),
  },
  instructionDescription: {
    fontSize: hp('1.8%'),
    color: '#37474F',
    marginBottom: wp('2%'),
  },
  instructionsList: {
    gap: wp('1%'),
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: wp('2%'),
  },
  bulletPoint: {
    fontSize: hp('1.8%'),
    color: '#1976D2',
    marginRight: wp('2%'),
    marginTop: -wp('0.5%'),
  },
  instructionText: {
    fontSize: hp('1.8%'),
    color: '#37474F',
    flex: 1,
  },
});

export default AccelerometerDisplay;
