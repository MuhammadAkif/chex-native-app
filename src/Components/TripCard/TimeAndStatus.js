import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import {Clock} from '../../Assets/Icons';

const TimeAndStatus = ({
  date = '-',
  status = '-',
  time = '-',
  duration = '-',
}) => (
  <View style={styles.timeAndStatusContainer}>
    <View style={styles.rowStyle}>
      <Text style={styles.textColor}>{date}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
    <View style={styles.rowStyle}>
      <View style={styles.timeContainer}>
        <Clock />
        <Text style={[styles.textColor, styles.label]}>{time}</Text>
      </View>
      <Text style={styles.label}>
        Duration:
        <Text style={styles.textColor}> {duration}</Text>
      </Text>
    </View>
  </View>
);

export default TimeAndStatus;
