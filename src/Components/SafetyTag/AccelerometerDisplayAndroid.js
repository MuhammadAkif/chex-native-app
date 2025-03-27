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
import InfoModal from '../PopUpModals/InfoModal';

const {black, gray} = colors;
const infoActiveInitialState = {
  isVisible: false,
  title: '',
  description: '',
};

const AccelerometerDisplayAndroid = () => {
  const [infoActive, setInfoActive] = useState(infoActiveInitialState);
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
        setAlignmentDetails(prevState =>
          prevState.step !== event.step ? event : prevState,
        );
        console.log('AxisAlignmentProcessState', event);
        console.log('alignment state changed to:', event.step);
      },
    );

    const successSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentSuccess',
      async () => {
        try {
          await stopAxisAlignment();
          setAlignmentDetails(prev => ({...prev, step: 'PROCESS_COMPLETED'}));
          Alert.alert('Success', 'Axis alignment completed successfully');
        } catch (err) {
          console.log(err);
        }
      },
    );

    const stoppedSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentStopped',
      event => {
        setAlignmentStatus('Started');
        const body = {
          isVisible: true,
          title: 'Stopped',
          description:
            event.reason === 'BY_REQUEST'
              ? 'Alignment process was stopped as per request'
              : `Alignment stopped: ${event.reason}`,
        };
        !infoActive.isVisible && setInfoActive(body);
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
      const body = {
        isVisible: true,
        title: 'Axis Alignment',
        description: 'Successfully started axis alignment',
      };
      setInfoActive(body);
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

  const onInfoModalOkPress = () => {
    setInfoActive(infoActiveInitialState);
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
      <InfoModal
        isVisible={infoActive.isVisible}
        onOkPress={onInfoModalOkPress}
        title={infoActive.title}
        description={infoActive.description}
      />
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
  phaseListContainer: {
    marginVertical: wp('2%'),
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: wp('2%'),
  },
});

export default AccelerometerDisplayAndroid;
