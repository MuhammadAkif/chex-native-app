import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import {useSafetyTagIOS} from '../../hooks';
import {LoadingIndicator, SafetyTagDeviceInfo} from '../index';
import {formatUnixTime} from '../../Utils/helpers';
import DeviceScan from './DeviceScan';
import {SafetyTagBeaconTestScreen} from './SafetyTagBeaconTestScreen';
import {
  addCrashData,
  addThresholdEvent,
  setCrashError,
  updateCrashStatus,
} from '../../Store/Actions';
import CrashEventDisplay from './CrashEventDisplay';
import AccelerometerDisplayIOS from './AccelerometerDisplayIOS';
import {PhaseList, InstructionsPanel} from './AlignmentComponents';
import {useAxisAlignment} from '../../hooks/useAxisAlignment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../Assets/Styles';
import FloatingButton from './FloatingButton/FloatingButton';
import useBoolean from '../../hooks/useBoolean';
import ConnectedDevice from './ConnectedDevice';

const {white, black} = colors;

const SafetyTagIOS = () => {
  const dispatch = useDispatch();
  const {
    devices,
    isScanning,
    startScan,
    connectToDevice,
    disconnectDevice,
    getDeviceInformation,
    enableAccelerometerDataStream,
    disableAccelerometerDataStream,
    requestAlwaysPermission,
  } = useSafetyTagIOS({
    onDeviceConnected: onDeviceConnected,
    onDeviceConnectionFailed: onDeviceConnectionFailed,
    onDeviceDisconnected: onDeviceDisconnected,
    onGetConnectedDevice: onGetConnectedDevice,
    onCheckConnection: onCheckConnection,
    onTripStarted: onTripStarted,
    onTripEnded: onTripEnded,
    onTripsReceived: onTripsReceived,
    onCrashThreshold: onCrashThreshold,
    onCrashEvent: onCrashEvent,
  });
  const {startAlignment, stopAlignment} = useAxisAlignment();
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [trips, setTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [alignmentDetails, setAlignmentDetails] = useState({
    movement: 'UNKNOWN',
    speed: 'UNKNOWN',
    currentSpeed: 0,
    currentHeading: 0,
    step: null,
  });
  const [alignmentStatus, setAlignmentStatus] = useState('Not Started');
  const {
    value: isLoading,
    toggle: toggleIsLoading,
    setFalse: setIsLoadingFalse,
  } = useBoolean(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  useEffect(() => {
    getDeviceInformation().then();
    const subscriptions = [
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
      DeviceEventEmitter.addListener(
        'onAxisAlignmentState',
        onAxisAlignmentState,
      ),
      DeviceEventEmitter.addListener('onVehicleState', onVehicleState),
      DeviceEventEmitter.addListener(
        'onAxisAlignmentData',
        onAxisAlignmentData,
      ),
      DeviceEventEmitter.addListener(
        'onAxisAlignmentError',
        onAxisAlignmentError,
      ),
      DeviceEventEmitter.addListener(
        'onAxisAlignmentFinished',
        onAxisAlignmentFinished,
      ),
      DeviceEventEmitter.addListener(
        'onDeviceConnectionStateChange',
        onDeviceConnectionStateChange,
      ),
    ];

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  function onCrashThreshold(event) {
    console.log('Crash Threshold:', event);
    try {
      const thresholdEvent = JSON.parse(event?.crashThresholdEvent);
      dispatch(addThresholdEvent(thresholdEvent));
    } catch (error) {
      console.error('Error parsing threshold event:', error);
      dispatch(setCrashError('Error parsing threshold event'));
    }
  }

  function onCrashEvent(event) {
    console.log('Crash data:', event);
    try {
      const crashData = JSON.parse(event?.crashData);
      dispatch(addCrashData(crashData));
      dispatch(
        updateCrashStatus(crashData?.status ? 'COMPLETE_DATA' : 'PARTIAL_DATA'),
      );
    } catch (error) {
      console.error('Error parsing crash data:', error);
      dispatch(setCrashError('Error parsing crash data'));
    }
  }

  function onDeviceConnectionStateChange(event) {
    setConnectionState(event.state);
    if (event.state === 'connecting') {
      toggleIsLoading(true);
    } else {
      setIsLoadingFalse();
    }
  }

  function onDeviceConnected(event) {
    setConnectedDevice(event);
    setIsConnected(true);
    setConnectionState('connected');
    setIsLoadingFalse();
    getDeviceInformation().then();
  }

  function onDeviceConnectionFailed(event) {
    setConnectedDevice(null);
    setIsConnected(false);
    setConnectionState('failed');
    setIsLoadingFalse();
    Alert.alert('Connection Failed', 'Failed to connect to device');
  }

  function onDeviceDisconnected(event) {
    setConnectedDevice(null);
    setIsConnected(false);
    setConnectionState('disconnected');
    setCurrentTrip(null);
    isLoading && setIsLoadingFalse();
  }

  function onGetConnectedDevice(event) {
    if (!event?.error) {
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
    const {x: xAxis, y: yAxis, z: zAxis, secondsSinceLastRestart} = event;
    //setAccelerometerData({xAxis, yAxis, zAxis, secondsSinceLastRestart});
  }

  function onAccelerometerError(event) {
    console.error('Accelerometer Error:', event.error);
  }

  function onAccelerometerStreamStatus(event) {
    console.log('Accelerometer Stream Status:', event.isEnabled);
  }

  function onAxisAlignmentState(event) {
    console.log('Alignment State Update:', event);
    setAlignmentDetails(prev => ({
      ...prev,
      step: event.phase,
      zAxisState: event.zAxisState,
      xAxisState: event.xAxisState,
      validVehicleState: event.validVehicleState,
      currentBootstrapBufferSize: event.currentBootstrapBufferSize,
      overallIterationCount: event.overallIterationCount,
    }));
  }

  function onVehicleState(event) {
    console.log('Vehicle State Update:', event);
    setAlignmentDetails(prev => ({
      ...prev,
      validVehicleState: event.validVehicleState,
      hasValidIntervals: event.hasValidIntervals,
    }));
  }

  function onAxisAlignmentData(event) {
    console.log('Alignment Data Update:', event);
    setAlignmentDetails(prev => ({
      ...prev,
      status: event.status,
      theta: event.theta,
      phi: event.phi,
    }));
  }

  function onAxisAlignmentError(event) {
    console.error('Alignment Error:', event.error);
    Alert.alert('Alignment Error', event.error);
    setAlignmentStatus('Error');
  }

  function onAxisAlignmentFinished(event) {
    console.log('Alignment Finished:', event);
    if (event.success) {
      setAlignmentStatus('Completed');
      Alert.alert('Success', 'Axis alignment completed successfully');
    } else {
      setAlignmentStatus('Failed');
      Alert.alert('Alignment Failed', event.error || 'Unknown error occurred');
    }
  }

  const handleStartScan = async () => {
    try {
      await getDeviceInformation();
      console.log('Starting scan for SafetyTag devices...');
      await startScan();
      await startScan();
    } catch (error) {
      console.error('Error starting scan:', error);
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

  const checkLocationPermission = async () => {
    try {
      const result = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            'Error',
            'Location service is not available on this device',
          );
          return false;

        case RESULTS.DENIED:
          // Permission has not been requested yet
          const requestResult = await requestAlwaysPermission();
          return requestResult === RESULTS.GRANTED;

        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          return true;

        case RESULTS.BLOCKED:
          await requestAlwaysPermission();
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  };

  const handleStartAlignment = async () => {
    try {
      const hasPermission = await checkLocationPermission();

      if (!hasPermission) {
        return; // Exit if permission not granted
      }

      await enableAccelerometerDataStream();
      setAlignmentDetails(prev => ({...prev, step: 'STARTING'}));
      await startAlignment(false);
      setAlignmentStatus('Started');
    } catch (error) {
      console.error('Error starting alignment:', error);
      Alert.alert('Error', 'Failed to start alignment');
    }
  };

  const handleStopAlignment = async () => {
    try {
      await disableAccelerometerDataStream();
      await stopAlignment();
      setAccelerometerData(null);
      setAlignmentStatus('Stopped');
    } catch (error) {
      console.error('Error stopping alignment:', error);
      Alert.alert('Error', 'Failed to stop alignment');
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
        <ConnectedDevice
          isConnected={isConnected}
          connectedDevice={connectedDevice}
        />

        <View style={styles.buttonContainer}>
          {!isConnected && (
            <TouchableOpacity style={styles.button} onPress={handleStartScan}>
              <Text style={styles.buttonText}>Start Scan</Text>
            </TouchableOpacity>
          )}
          {isScanning && (
            <DeviceScan
              devices={devices}
              isScanning={isScanning}
              onDeviceSelect={connectToDevice}
            />
          )}
          <SafetyTagBeaconTestScreen />
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonMargin,
              styles.disconnectButton,
            ]}
            onPress={handleDisconnectDevice}>
            <Text style={styles.buttonText}>Disconnect Device</Text>
          </TouchableOpacity>
          <View style={styles.alignmentContainer}>
            {isConnected && (
              <AccelerometerDisplayIOS
                accelerometerData={accelerometerData}
                alignmentDetails={{
                  ...alignmentDetails,
                  movement: alignmentDetails.validVehicleState
                    ? 'VALID'
                    : 'INVALID',
                  speed: alignmentDetails.hasValidIntervals
                    ? 'VALID'
                    : 'INVALID',
                  currentSpeed: 0, // You might want to get this from another source
                  currentHeading: alignmentDetails.theta || 0,
                  step: alignmentDetails.step,
                  zAxisState: alignmentDetails.zAxisState,
                  xAxisState: alignmentDetails.xAxisState,
                  phi: alignmentDetails.phi,
                }}
                alignmentStatus={alignmentStatus}
                onStartAlignment={handleStartAlignment}
                onStopAlignment={handleStopAlignment}
                PhaseListComponent={PhaseList}
                InstructionsPanelComponent={InstructionsPanel}
                showRawData={false}
                showAlignmentDetails={true}
              />
            )}
            {isConnected && <CrashEventDisplay />}
          </View>
        </View>
      </ScrollView>
      <FloatingButton />
      <LoadingIndicator isLoading={isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('1%'),
    paddingVertical: wp('4%'),
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    rowGap: hp('1%'),
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
  disconnectButton: {
    backgroundColor: '#FF3B30',
  },
  scrollContent: {
    padding: wp('5%'),
    rowGap: wp('2%'),
  },
  scrollView: {
    flex: 1,
  },
  title: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  alignmentContainer: {
    width: wp('90%'),
  },
  helpButton: {
    position: 'absolute',
    bottom: hp('2%'),
    right: wp('4%'),
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: black,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  helpButtonText: {
    color: white,
    fontSize: hp('3%'),
    fontWeight: 'bold',
  },
});

export default SafetyTagIOS;
