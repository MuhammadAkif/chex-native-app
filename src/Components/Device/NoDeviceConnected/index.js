import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import {AvailableVehicles, PrimaryGradientButton} from '../../index';
import {fallBack} from '../../../Utils';
import {BluetoothOff} from '../../../Assets/Icons';
import {useSafetyTagInitializer} from '../../../hooks';
import AvailableDevices from '../AvailableDevices';
import {connectDevice} from '../../../services/device';
import {useDeviceActions, useDeviceState} from '../../../hooks/device';

const NoDeviceConnected = ({
  title = 'No Device Connected',
  description = 'Connect your device to view trip details and track your journey in real-time',
  buttonText = 'Connect',
  onPress = fallBack,
  isAvailableDevicesVisible = false,
}) => {
  const {deviceDetails, startDeviceScanning, connectToSelectedDevice} =
    useSafetyTagInitializer();
  const {setUserDeviceDetails} = useDeviceActions();
  const {isConnected} = useDeviceState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isVehiclesModalVisible, setIsVehiclesModalVisible] = useState({
    deviceAddress: null,
    isVisible: false,
  });
  const handleConnectPress = async () => {
    await startDeviceScanning();
    setModalVisible(true);
  };
  useEffect(() => {
    if (isAvailableDevicesVisible !== modalVisible) {
      setModalVisible(isAvailableDevicesVisible);
    }
  }, []);

  const handleCancelPress = () => {
    setModalVisible(false);
  };

  const handleOnConnectPress = async device => {
    if (isConnected) {
      return;
    }
    const {data} = await connectDevice(null, device);
    if (data?.isNewDevice) {
      setIsVehiclesModalVisible({isVisible: true, deviceAddress: device});
    } else {
      await connectToSelectedDevice(device);
      setUserDeviceDetails(data);
      //setTimeout(() => handleOnConnectPress(device), 3000);
    }
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
      {isVehiclesModalVisible && (
        <AvailableVehicles
          isVisible={isVehiclesModalVisible?.isVisible}
          deviceAddress={isVehiclesModalVisible?.deviceAddress}
        />
      )}
      <AvailableDevices
        devices={deviceDetails?.discoveredDevices}
        isVisible={modalVisible}
        onConnectPress={handleOnConnectPress}
        onCancelPress={handleCancelPress}
        onRescanPress={startDeviceScanning}
      />
    </View>
  );
};

export default NoDeviceConnected;
