import React from 'react';
import {View} from 'react-native';

import LabelValuePair from './LabelValuePair';
import ConnectionStatus from '../../UserProfile/Components/DeviceDetails/ConnectionStatus';
import styles from './styles';

const Details = ({
  isConnected = false,
  deviceTag = '12345',
  battery = '87%',
  lastSignal = '3min ago',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.deviceConnection}>
        <LabelValuePair label={'Device Tag'} value={deviceTag} />
        <ConnectionStatus isConnected={isConnected} />
      </View>
      <LabelValuePair label={'Battery'} value={battery} />
      <LabelValuePair label={'Last Signal'} value={lastSignal} />
    </View>
  );
};

export default Details;
