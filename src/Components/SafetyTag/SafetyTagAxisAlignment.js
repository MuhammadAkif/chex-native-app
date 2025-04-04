import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button, DeviceEventEmitter} from 'react-native';
import {useAxisAlignment} from '../../hooks/useAxisAlignment';
import {colors} from '../../Assets/Styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {requestLocationPermission} from '../../Utils/helpers';

const SafetyTagAxisAlignment = () => {
  const {
    alignmentState,
    startAlignment,
    stopAlignment,
    checkAlignmentStatus,
    removeStoredAlignment,
  } = useAxisAlignment();
  const isAlignmentRunning = alignmentState?.phase === 'started';
  const buttonText = isAlignmentRunning ? 'Stop Alignment' : 'Start Alignment';

  useEffect(() => {
    const subscriptions = [
      DeviceEventEmitter.addListener(
        'onAxisAlignmentStatusCheck',
        onAxisAlignmentStatusCheck,
      ),
    ];
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  async function onAxisAlignmentStatusCheck(event) {
    if (event.hasStarted) {
      await stopAlignment();
    } else {
      await startAlignment();
    }
  }

  const handleIsAlignmentActive = async () => {
    checkAlignmentStatus().then();
  };

  async function handleAlignmentToggle() {
    //await requestLocationPermission();
    await handleIsAlignmentActive();
    await removeStoredAlignment();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{alignmentState?.phase || 'Not Started'}</Text>
      <Button title={buttonText} onPress={handleAlignmentToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  subsection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  axisSection: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  axisTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  text: {
    fontSize: hp('2.5%'),
    padding: wp('2%'),
    color: colors.black,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  message: {
    fontSize: hp('2.5%'),
    marginBottom: 4,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: hp('2.5%'),
    marginBottom: 4,
    color: '#f44336',
    fontWeight: '500',
  },
  warningText: {
    color: '#ff9800',
  },
  alignmentValues: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SafetyTagAxisAlignment;
