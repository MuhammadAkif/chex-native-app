import React from 'react';
import {View} from 'react-native';

import styles from './styles';
import TimeAndStatus from './TimeAndStatus';
import TripLocation from './TripLocation';
import DistanceAndSpeed from './DistanceAndSpeed';
import {
  convertSpeedToKmh,
  format12HourTime,
  formatDate,
  getElapsedTimeDiff,
  withDefault,
} from '../../Utils/helpers';

const TripCard = ({trip}) => {
  const {
    connectedDuringTrip,
    endElapsedRealtimeMs,
    endUnixTimeMs,
    receiveNumber,
    startElapsedRealtimeMs,
    startUnixTimeMs,
  } = trip;
  let avgSpeed = withDefault(convertSpeedToKmh(null), '-');
  const duration = withDefault(
    getElapsedTimeDiff(startUnixTimeMs, endUnixTimeMs),
    '-',
  );
  const startTime = withDefault(format12HourTime(startUnixTimeMs), '-');
  const date = formatDate(startUnixTimeMs);

  return (
    <View style={styles.container}>
      <TimeAndStatus
        duration={duration}
        time={startTime}
        status={'Completed'}
        date={date}
      />
      <TripLocation startLocation={'-'} endLocation={'-'} />
      <DistanceAndSpeed distance={'-'} avgspeed={'-'} />
    </View>
  );
};

export default TripCard;
