import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {DeviceEventEmitter} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {colors} from '../../Assets/Styles';
import {PrimaryGradientButton} from '../index';
import InfoModal from '../PopUpModals/InfoModal';
import {addDeviceEventListener} from '../../Utils/helpers';

const {black, gray, brightGreen, cobaltBlue, red} = colors;

// iOS-specific alignment process states
export const ALIGNMENT_PROCESS_STATES = {
  INACTIVE: 'inactive',
  REQUESTED: 'requested',
  STARTED: 'started',
  SEND_ST_DATA: 'sendSTData',
  COMPLETE: 'complete',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};
const shouldStop = ['cancelled', 'complete', 'failed', 'inactive', null];

// Z-Axis alignment states
export const Z_AXIS_STATES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};

// X-Axis alignment states
export const X_AXIS_STATES = {
  NONE: 'none',
  FIND_ANGLE: 'findAngle',
  DIRECTION_VALIDATION: 'directionValidation',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Mapping of process states to user-friendly display names
export const PROCESS_STATE_DISPLAY = {
  [ALIGNMENT_PROCESS_STATES.INACTIVE]: 'Not Started',
  [ALIGNMENT_PROCESS_STATES.REQUESTED]: 'Initializing',
  [ALIGNMENT_PROCESS_STATES.STARTED]: 'In Progress',
  [ALIGNMENT_PROCESS_STATES.SEND_ST_DATA]: 'Saving Data',
  [ALIGNMENT_PROCESS_STATES.COMPLETE]: 'Completed',
  [ALIGNMENT_PROCESS_STATES.FAILED]: 'Failed',
  [ALIGNMENT_PROCESS_STATES.CANCELLED]: 'Cancelled',
};

// Mapping of Z-axis states to user-friendly display names
export const Z_AXIS_STATE_DISPLAY = {
  [Z_AXIS_STATES.ONLINE]: 'Online',
  [Z_AXIS_STATES.OFFLINE]: 'Offline',
};

// Mapping of X-axis states to user-friendly display names
export const X_AXIS_STATE_DISPLAY = {
  [X_AXIS_STATES.NONE]: 'Not Started',
  [X_AXIS_STATES.FIND_ANGLE]: 'Finding Angle',
  [X_AXIS_STATES.DIRECTION_VALIDATION]: 'Validating Direction',
  [X_AXIS_STATES.COMPLETED]: 'Completed',
  [X_AXIS_STATES.FAILED]: 'Failed',
};

const infoActiveInitialState = {
  isVisible: false,
  title: '',
  description: '',
};

const AccelerometerDisplayIOS = ({
  // Props for data and status
  accelerometerData,
  alignmentDetails = {},
  alignmentStatus = 'Not Started',

  // Props for callbacks
  onStartAlignment,
  onStopAlignment,

  // Optional custom components
  PhaseListComponent,
  InstructionsPanelComponent,

  // Optional flags
  showRawData = false,
  showAlignmentDetails = true,
}) => {
  const [infoActive, setInfoActive] = useState(infoActiveInitialState);
  const [processState, setProcessState] = useState(
    ALIGNMENT_PROCESS_STATES.INACTIVE,
  );
  const [zAxisState, setZAxisState] = useState(Z_AXIS_STATES.OFFLINE);
  const [xAxisState, setXAxisState] = useState(X_AXIS_STATES.NONE);
  const [zAxisCompleted, setZAxisCompleted] = useState(false);
  const [currentPhaseId, setCurrentPhaseId] = useState('');

  useEffect(() => {
    const accelerometerSubscription = addDeviceEventListener(
      'onAccelerometerData',
      event => {
        //console.log('onAccelerometerData', event);
      },
    );

    const alignmentSubscription = addDeviceEventListener(
      'onAxisAlignmentState',
      event => {
        console.log('AxisAlignmentProcessState', event);

        // Update process state if available
        if (event.phase) {
          setProcessState(event.phase);
        }

        // Update Z-axis state if available
        if (event.zAxisState) {
          setZAxisState(event.zAxisState);

          // Check if Z-axis is online and mark it as completed
          if (event.zAxisState === Z_AXIS_STATES.ONLINE) {
            setZAxisCompleted(true);
          }
        }

        // Update X-axis state if available
        if (event.xAxisState) {
          setXAxisState(event.xAxisState);
        }

        // Show appropriate alerts based on state changes
        if (event.phase === ALIGNMENT_PROCESS_STATES.COMPLETE) {
          Alert.alert('Success', 'Axis alignment completed successfully');
        } else if (event.phase === ALIGNMENT_PROCESS_STATES.FAILED) {
          Alert.alert('Error', 'Axis alignment failed');
        }
      },
    );

    const successSubscription = addDeviceEventListener(
      'onAxisAlignmentSuccess',
      async () => {
        try {
          Alert.alert('Success', 'Axis alignment completed successfully');
        } catch (err) {
          console.log(err);
        }
      },
    );

    const stoppedSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentStopped',
      event => {
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

  // Update current phase ID whenever relevant states change
  useEffect(() => {
    const phaseId = getCurrentPhaseId();
    setCurrentPhaseId(phaseId);
  }, [processState, zAxisState, xAxisState, zAxisCompleted]);

  const onInfoModalOkPress = () => {
    setInfoActive(infoActiveInitialState);
  };

  // Get the current phase ID based on process state
  const getCurrentPhaseId = () => {
    switch (processState) {
      case ALIGNMENT_PROCESS_STATES.INACTIVE:
      case ALIGNMENT_PROCESS_STATES.CANCELLED:
        return '';
      case ALIGNMENT_PROCESS_STATES.REQUESTED:
        return 'STARTING';
      case ALIGNMENT_PROCESS_STATES.STARTED:
        // First check if Z-axis is online before proceeding to X-axis
        if (!zAxisCompleted) {
          return 'Z_AXIS_ALIGNMENT';
        }

        // Only proceed to X-axis phases if Z-axis is online
        if (xAxisState === X_AXIS_STATES.NONE) {
          return 'X_AXIS_NOT_STARTED';
        } else if (xAxisState === X_AXIS_STATES.FIND_ANGLE) {
          return 'FINDING_X_AXIS_ANGLE';
        } else if (xAxisState === X_AXIS_STATES.DIRECTION_VALIDATION) {
          return 'ANGLE_DIRECTION_VALIDATION';
        } else {
          return 'Z_AXIS_ALIGNMENT';
        }
      case ALIGNMENT_PROCESS_STATES.SEND_ST_DATA:
        return 'SENDING_ALIGNMENT_DATA_TO_ST';
      case ALIGNMENT_PROCESS_STATES.COMPLETE:
        return 'PROCESS_COMPLETED';
      case ALIGNMENT_PROCESS_STATES.FAILED:
      default:
        return 'STARTING';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.alignmentContainer}>
        <Text style={styles.title}>Axis Alignment</Text>
        <Text style={styles.title}>
          Status: {PROCESS_STATE_DISPLAY[processState] || 'Not Started'}
        </Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Z-Axis:</Text>
            <Text
              style={[
                styles.statusValue,
                zAxisState === Z_AXIS_STATES.ONLINE
                  ? styles.statusOnline
                  : styles.statusOffline,
              ]}>
              {Z_AXIS_STATE_DISPLAY[zAxisState] || 'Unknown'}
            </Text>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>X-Axis:</Text>
            <Text
              style={[
                styles.statusValue,
                xAxisState === X_AXIS_STATES.COMPLETED
                  ? styles.statusOnline
                  : xAxisState === X_AXIS_STATES.FAILED
                  ? styles.statusOffline
                  : styles.statusInProgress,
              ]}>
              {X_AXIS_STATE_DISPLAY[xAxisState] || 'Unknown'}
            </Text>
          </View>
        </View>

        {PhaseListComponent && (
          <PhaseListComponent currentPhase={currentPhaseId} />
        )}
        {InstructionsPanelComponent && (
          <InstructionsPanelComponent phase={currentPhaseId} />
        )}

        <View style={styles.buttonContainer}>
          {shouldStop.includes(alignmentDetails?.step) ? (
            <PrimaryGradientButton
              text={'Start Alignment'}
              onPress={onStartAlignment}
            />
          ) : (
            <PrimaryGradientButton
              text={'Stop Alignment'}
              onPress={onStopAlignment}
            />
          )}
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
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: wp('2%'),
    padding: wp('2%'),
    backgroundColor: '#f0f0f0',
    borderRadius: wp('2%'),
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
    color: black,
    marginRight: wp('2%'),
  },
  statusValue: {
    fontSize: hp('1.8%'),
    color: black,
  },
  statusOnline: {
    color: brightGreen,
    fontWeight: 'bold',
  },
  statusOffline: {
    color: red,
    fontWeight: 'bold',
  },
  statusInProgress: {
    color: cobaltBlue,
    fontWeight: 'bold',
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

export default AccelerometerDisplayIOS;
