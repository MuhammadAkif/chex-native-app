import React from 'react';
import {View} from 'react-native';

import LabelValuePair from './LabelValuePair';
import ConnectionStatus from '../../UserProfile/Components/DeviceDetails/ConnectionStatus';
import styles from './styles';
import LabelValuePairWithProgress from './LabelValuePairWithProgress';

const Details = ({
  isConnected = false,
  deviceTag = '-',
  batteryHealth = '-',
  lastSignal = '-',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.deviceConnection}>
        <LabelValuePair label={'Device Tag'} value={deviceTag} />
        <ConnectionStatus isConnected={isConnected} />
      </View>
      <LabelValuePair
        label={'Battery'}
        value={batteryHealth}
        textValueStyle={styles.fieldMaxWidth}
      />
      <LabelValuePair
        label={'Last Signal'}
        value={lastSignal}
        textValueStyle={styles.fieldMaxWidth}
      />
    </View>
  );
};

export default Details;
