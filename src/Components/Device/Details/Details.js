import React from 'react';
import {View} from 'react-native';

import LabelValuePair from './LabelValuePair';
import ConnectionStatus from '../../UserProfile/Components/DeviceDetails/ConnectionStatus';
import styles from './styles';

const Details = ({
  isConnected = false,
  deviceTag = 'N/A',
  batteryHealth = 'N/A',
  lastSignal = 'N/A',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.deviceConnection}>
        <LabelValuePair label={'Device Tag'} value={deviceTag} />
        <ConnectionStatus isConnected={isConnected} />
      </View>
      <LabelValuePair label={'Battery'} value={batteryHealth} />
      <LabelValuePair label={'Last Signal'} value={lastSignal} />
    </View>
  );
};

export default Details;
