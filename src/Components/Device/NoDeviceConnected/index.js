import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import {PrimaryGradientButton} from '../../index';
import {fallBack} from '../../../Utils';
import {BluetoothOff} from '../../../Assets/Icons';

const NoDeviceConnected = ({
  title = 'No Device Connected',
  description = 'Connect your device to view trip details and track your journey in real-time',
  buttonText = 'Connect',
  onPress = fallBack,
}) => {
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
        onPress={onPress}
      />
    </View>
  );
};

export default NoDeviceConnected;
