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

const {black, gray} = colors;
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

  useEffect(() => {
    const accelerometerSubscription = DeviceEventEmitter.addListener(
      'onAccelerometerData',
      event => {
        //console.log('onAccelerometerData', event);
      },
    );

    const alignmentSubscription = DeviceEventEmitter.addListener(
      'onAxisAlignmentState',
      event => {
        console.log('AxisAlignmentProcessState', event);
      },
    );

    const successSubscription = DeviceEventEmitter.addListener(
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

  const onInfoModalOkPress = () => {
    setInfoActive(infoActiveInitialState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.alignmentContainer}>
        <Text style={styles.title}>Axis Alignment</Text>
        <Text style={styles.title}>
          Status: {alignmentDetails?.step || 'Not Started'}
        </Text>
        <Text style={styles.title}>Service: {alignmentStatus}</Text>

        {PhaseListComponent && (
          <PhaseListComponent currentPhase={alignmentDetails?.step} />
        )}
        {InstructionsPanelComponent && (
          <InstructionsPanelComponent phase={alignmentDetails?.step} />
        )}
        <View style={styles.buttonContainer}>
          {alignmentStatus !== 'Started' ? (
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
