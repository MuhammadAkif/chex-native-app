import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  DeviceEventEmitter,
  Alert,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import useSafetyTag from '../../hooks/useSafetyTag';
import {colors} from '../../Assets/Styles';

const CrashTestingTool = () => {
  const [isAligned, setIsAligned] = useState(false);
  const [crashEvents, setCrashEvents] = useState([]);
  const [thresholdEvents, setThresholdEvents] = useState([]);
  const {
    configureCrash,
    startAxisAlignment,
    stopAxisAlignment,
    isAlignmentRunning,
    enableAccelerometerDataStream,
    disableAccelerometerDataStream,
  } = useSafetyTag();

  // Setup crash detection after axis alignment
  const setupCrashDetection = async () => {
    try {
      // 1. First check if alignment is needed
      const alignmentRunning = await isAlignmentRunning();
      if (!alignmentRunning) {
        // 2. Start axis alignment
        await startAxisAlignment();
        Alert.alert(
          'Axis Alignment Started',
          'Please place the device on a flat surface and keep it still',
        );
      }

      // 3. Enable accelerometer data stream
      await enableAccelerometerDataStream();

      // 4. Set testing thresholds
      await configureCrash({
        averagingWindowSize: 3,
        thresholdXy: 100, // Very low threshold (100mg = 0.1g)
        thresholdXyz: 200, // Very low threshold (200mg = 0.2g)
        surpassingThresholds: 1,
      });
    } catch (error) {
      console.error('Error setting up crash detection:', error);
      Alert.alert('Setup Error', error.message);
    }
  };

  const stopTesting = async () => {
    try {
      await stopAxisAlignment();
      await disableAccelerometerDataStream();
      setIsAligned(false);
    } catch (error) {
      console.error('Error stopping crash detection:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Listen to alignment state changes
    const alignmentStateSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentStateChange',
      event => {
        if (!mounted) {
          return;
        }

        const {step, movement, speed, currentSpeed, currentHeading} = event;

        // Check if alignment is complete
        if (step === 'PROCESS_COMPLETED') {
          setIsAligned(true);
          Alert.alert('Success', 'Axis alignment completed successfully');
        } else if (step === 'PROCESS_FAILED') {
          Alert.alert('Error', 'Axis alignment failed');
        }

        // Show guidance based on current state
        if (step === 'FINDING_X_AXIS_ANGLE') {
          if (speed === 'CAR_TOO_SLOW') {
            console.log('Speed too low', 'Please drive between 4-60 km/h');
          } else if (speed === 'CAR_TOO_FAST') {
            console.log('Speed too high', 'Please drive slower');
          }

          if (movement === 'CAR_NOT_MOVING_STRAIGHT') {
            console.log('Movement', 'Please drive in a straight line');
          }
        }
      },
    );

    // Listen for success/failure
    const successSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentSuccess',
      () => {
        if (mounted) {
          setIsAligned(true);
          Alert.alert('Success', 'Axis alignment completed successfully');
        }
      },
    );

    const failureSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentError',
      error => {
        if (mounted) {
          Alert.alert('Error', `Axis alignment failed: ${error.message}`);
        }
      },
    );

    // Listen for crash events
    const crashDataSubscription = DeviceEventEmitter.addListener(
      'onCrashDataReceived',
      event => {
        if (!mounted) {
          return;
        }
        console.log('onCrashDataReceived: ', event);
        const crashData = JSON.parse(event.crashData);
        setCrashEvents(prev => [...prev, crashData]);
        Alert.alert(
          'Crash Detected',
          `Event ID: ${crashData.eventId}\n` +
            `Valid: ${crashData.validCrashEvent}\n` +
            `Complete: ${crashData.hasCompleteData}`,
        );
      },
    );

    const thresholdSubscription = DeviceEventEmitter.addListener(
      'onCrashThresholdEvent',
      event => {
        if (!mounted) {
          return;
        }
        console.log('onCrashThresholdEvent: ', event);
        const thresholdEvent = JSON.parse(event.crashThresholdEvent);
        setThresholdEvents(prev => [...prev, thresholdEvent]);
        Alert.alert(
          'Threshold Event',
          `Timestamp: ${new Date(
            thresholdEvent.timestampUnixMs,
          ).toLocaleString()}`,
        );
      },
    );

    return async () => {
      mounted = false;
      alignmentStateSubscription.remove();
      successSubscription.remove();
      failureSubscription.remove();
      crashDataSubscription.remove();
      thresholdSubscription.remove();
      await stopTesting();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Crash Detection Testing</Text>

          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusItem}>
              <Text style={styles.label}>Axis Aligned:</Text>
              <Text
                style={[
                  styles.value,
                  isAligned ? styles.success : styles.pending,
                ]}>
                {isAligned ? '✅ Ready' : '⏳ Pending'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.label}>Events Detected:</Text>
              <Text style={styles.value}>
                {crashEvents.length + thresholdEvents.length}
              </Text>
            </View>
          </View>

          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>Recent Events</Text>
            {crashEvents.slice(-3).map((event, index) => (
              <View key={`crash-${index}`} style={styles.eventItem}>
                <Text style={styles.eventTitle}>
                  Crash Event #{event.eventId}
                </Text>
                <Text style={styles.eventDetail}>
                  Valid: {event.validCrashEvent ? 'Yes' : 'No'}
                </Text>
                <Text style={styles.eventDetail}>
                  Complete: {event.hasCompleteData ? 'Yes' : 'No'}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={
                isAligned ? 'Start New Alignment' : 'Setup Crash Detection'
              }
              onPress={setupCrashDetection}
            />
            <Button title="Stop Testing" onPress={stopTesting} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: wp('4%'),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  statusSection: {
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontSize: hp('2%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: hp('1.8%'),
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: hp('1.8%'),
    color: '#333',
    fontWeight: '500',
  },
  success: {
    color: '#4CAF50',
  },
  pending: {
    color: '#FFC107',
  },
  eventsSection: {
    marginBottom: hp('3%'),
  },
  eventItem: {
    backgroundColor: '#f8f8f8',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  eventTitle: {
    fontSize: hp('1.8%'),
    fontWeight: '600',
    color: '#000',
    marginBottom: hp('0.5%'),
  },
  eventDetail: {
    fontSize: hp('1.6%'),
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: hp('1%'),
  },
});

export default CrashTestingTool;
