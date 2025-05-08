import React, {useState} from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import {PrimaryGradientButton} from '../../index';
import {fallBack} from '../../../Utils';
import {BluetoothOff} from '../../../Assets/Icons';
import {useSafetyTagInitializer} from '../../../hooks';
import AvailableDevices from '../AvailableDevices';

const NoDeviceConnected = ({
  title = 'No Device Connected',
  description = 'Connect your device to view trip details and track your journey in real-time',
  buttonText = 'Connect',
  onPress = fallBack,
}) => {
  const {deviceDetails, startDeviceScanning, connectToSelectedDevice} =
    useSafetyTagInitializer();
  const [modalVisible, setModalVisible] = useState(false);
  const handleConnectPress = async () => {
    await startDeviceScanning();
    setModalVisible(true);
  };

  const handleCancelPress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <BluetoothOff />
      </View>
      <Text style={[styles.textColor, styles.title]}>{title}</Text>
      <Text style={[styles.textColor, styles.description]}>{description}</Text>
      <PrimaryGradientButton
        text={buttonText}
        buttonStyle={styles.button}
        onPress={handleConnectPress}
      />
      <AvailableDevices
        devices={deviceDetails?.discoveredDevices}
        isVisible={modalVisible}
        onConnectPress={connectToSelectedDevice}
        onCancelPress={handleCancelPress}
        onRescanPress={startDeviceScanning}
      />
    </View>
  );
};

export default NoDeviceConnected;
