import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';

const TripStatus = ({label = 'Trip Status', value = 'In Progress'}) => (
  <View style={styles.statusCardContainer}>
    <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.label}>
      {label}
    </Text>
    <Text
      numberOfLines={1}
      ellipsizeMode={'tail'}
      style={[styles.value, styles.statusTextColor]}>
      {value}
    </Text>
  </View>
);

export default TripStatus;
