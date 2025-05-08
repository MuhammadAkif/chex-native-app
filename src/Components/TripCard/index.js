import React from 'react';
import {View} from 'react-native';

import styles from './styles';
import TimeAndStatus from './TimeAndStatus';
import TripLocation from './TripLocation';
import DistanceAndSpeed from './DistanceAndSpeed';

const TripCard = () => (
  <View style={styles.container}>
    <TimeAndStatus />
    <TripLocation />
    <DistanceAndSpeed />
  </View>
);

export default TripCard;
