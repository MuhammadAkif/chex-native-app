import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import Location from '../../Assets/Icons/Location';
import styles from './styles';

const TripLocation = () => (
  <View style={styles.tripLocationContainer}>
    <View
      style={[
        styles.rowStyle,
        styles.tripIconAndTextContainer,
        styles.zeroPadding,
      ]}>
      <View style={styles.locationGreen}>
        <Location />
      </View>
      <Text style={styles.textColor}>Home</Text>
    </View>
    <View
      style={[
        styles.rowStyle,
        styles.tripIconAndTextContainer,
        styles.zeroPadding,
      ]}>
      <View style={[styles.locationGreen, styles.locationRed]}>
        <Location />
      </View>
      <Text style={styles.textColor}>Downtown office</Text>
    </View>
  </View>
);

export default TripLocation;
