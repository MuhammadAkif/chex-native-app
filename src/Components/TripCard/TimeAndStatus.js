import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import {Clock} from '../../Assets/Icons';

const TimeAndStatus = () => (
  <View style={styles.timeAndStatusContainer}>
    <View style={styles.rowStyle}>
      <Text style={styles.textColor}>May 5, 2025</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Completed</Text>
      </View>
    </View>
    <View style={styles.rowStyle}>
      <View style={styles.timeContainer}>
        <Clock />
        <Text style={[styles.textColor, styles.label]}>10:30AM</Text>
      </View>
      <Text style={styles.label}>
        Duration:
        <Text style={styles.textColor}>45 mins</Text>
      </Text>
    </View>
  </View>
);

export default TimeAndStatus;
