import React from 'react';
import {Text, View} from 'react-native';

import Location from '../../Assets/Icons/Location';
import styles from './styles';

const TripLocation = ({startLocation = '-', endLocation = '-'}) => (
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
      <Text style={styles.textColor}>{startLocation}</Text>
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
      <Text style={styles.textColor}>{endLocation}</Text>
    </View>
  </View>
);

export default TripLocation;
