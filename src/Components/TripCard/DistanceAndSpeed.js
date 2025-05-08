import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';

const DistanceAndSpeed = () => (
  <View style={styles.rowStyle}>
    <Text style={styles.label}>
      Distance:
      <Text style={[styles.textColor, styles.bold]}> 28.5 km</Text>
    </Text>
    <Text style={styles.label}>
      Avg Speed:
      <Text style={[styles.textColor, styles.bold]}> 38 km/h</Text>
    </Text>
  </View>
);

export default DistanceAndSpeed;
