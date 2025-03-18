import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  DeviceEventEmitter,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import useSafetyTag from '../../hooks/useSafetyTag';
import DeviceList from './DeviceList';
import AccelerometerDisplay from './AccelerometerDisplay';
import {colors} from '../../Assets/Styles';
import ConnectedDevice from './ConnectedDevice';
import {isNotEmpty} from '../../Utils';
import ConnectionControls from './ConnectionControls';
import InstructionsModal from './InstructionsModal';
import {
  setFirstTimeOpen,
  setShowInstructions,
} from '../../Store/Actions/AppStateActions';
import CrashEventDisplay from './CrashEventDisplay';
import {LoadingIndicator} from '../index';

const {white, black} = colors;

const SafetyTagScanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const dispatch = useDispatch();
  const {isFirstTimeOpen, showInstructions} = useSelector(
    state => state.appState,
  );

  const {
    startScanning,
    startBondScanning,
    disconnectDevice,
    subscribeToConnectionEvents,
    unsubscribeFromConnectionEvents,
    stopBackgroundScanning,
    getBackgroundScanStatus,
    isDeviceConnected,
    getConnectedDevice,
  } = useSafetyTag();

  useEffect(() => {
    if (isFirstTimeOpen) {
      dispatch(setShowInstructions(true));
      dispatch(setFirstTimeOpen(false));
    }
    subscribeToConnectionEvents().then();
    checkDeviceConnection().then();
    checkScanningStatus().then();
    DeviceEventEmitter.addListener('onConnecting', event => {
      !isLoading && setIsLoading(true);
    });
    DeviceEventEmitter.addListener('onConnected', event => {
      checkDeviceConnection().then();
      setIsLoading(false);
      console.log('Successfully connected to the device:', event);
    });
    DeviceEventEmitter.addListener('onDeviceDisconnected', event => {
      console.log('Device is disconnected...', event);
      Alert.alert('Connection', `Device is disconnected: ${event.reason}`);
      setConnectedDevice(null);
    });
    DeviceEventEmitter.addListener('onAxisAlignmentStopped', async event => {
      await checkDeviceConnection();
    });
    const deviceFoundSubscription = DeviceEventEmitter.addListener(
      'onBackgroundDeviceFound',
      device => {
        console.log('Background device found:', device);
      },
    );

    return () => {
      deviceFoundSubscription.remove();
      unsubscribeFromConnectionEvents();
      stopBackgroundScanning().then();
    };
  }, [dispatch, isFirstTimeOpen]);

  const checkScanningStatus = async () => {
    try {
      const status = await getBackgroundScanStatus();
      setScanStatus(status);
    } catch (error) {
      console.error('Error checking scan status:', error);
    }
  };

  async function checkDeviceConnection() {
    try {
      const isConnected = await isDeviceConnected();
      console.log('isConnected:', isConnected);
      if (isConnected) {
        const device = await getConnectedDevice();
        setConnectedDevice(device);
        console.log('Connected Device:', device);
        setScanStatus(false);
      } else {
        setScanStatus(true);
        setConnectedDevice(null);
      }
    } catch (error) {
      console.error('Error checking device connection:', error);
      Alert.alert('Error', 'Failed to check device connection');
    }
  }

  async function handleScan() {
    try {
      const isConnected = await isDeviceConnected();
      if (!isConnected) {
        setScanStatus(true);
        await startScanning();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleBondScan() {
    try {
      const isConnected = await isDeviceConnected();
      if (!isConnected) {
        await startBondScanning();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDisconnectDevice = async () => {
    try {
      await disconnectDevice();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowInstructions = () => {
    dispatch(setShowInstructions(true));
  };

  const handleCloseInstructions = () => {
    dispatch(setShowInstructions(false));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {scanStatus && <DeviceList />}
        <ConnectedDevice connectedDevice={connectedDevice} />
        <ConnectionControls
          handleScan={handleScan}
          handleBondScan={handleBondScan}
          checkDeviceConnection={checkDeviceConnection}
          handleDisconnectDevice={handleDisconnectDevice}
          isConnected={isNotEmpty(connectedDevice)}
        />
        {isNotEmpty(connectedDevice) && <AccelerometerDisplay />}
        {isNotEmpty(connectedDevice) && <CrashEventDisplay />}
      </ScrollView>

      <TouchableOpacity
        style={styles.helpButton}
        onPress={handleShowInstructions}>
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>

      <InstructionsModal
        visible={showInstructions}
        onClose={handleCloseInstructions}
      />
      <StatusBar
        backgroundColor={white}
        barStyle="light-content"
        translucent={true}
      />
      <LoadingIndicator isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
    paddingTop: StatusBar.currentHeight,
  },
  scroll: {
    gap: wp('2%'),
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

export default SafetyTagScanner;
