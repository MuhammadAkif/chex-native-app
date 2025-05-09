import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';

const DistanceAndSpeed = ({distance = '-', avgspeed = '-'}) => (
  <View style={styles.rowStyle}>
    <Text style={styles.label}>
      Distance:
      <Text style={[styles.textColor, styles.bold]}> {distance}</Text>
    </Text>
    <Text style={styles.label}>
      Avg Speed:
      <Text style={[styles.textColor, styles.bold]}> {avgspeed}</Text>
    </Text>
  </View>
);

export default DistanceAndSpeed;
