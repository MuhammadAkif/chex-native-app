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

function formatSmartDuration(ms) {
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function formatTo12HourTime(dateString) {
  const date = new Date(dateString);

  // Get UTC components (or use local with getHours(), etc.)
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // hour 0 should be 12

  return `${hours}:${minutes} ${ampm}`;
}

function formatDateToReadable(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const UTC_TO_TIMESTAMP = utc_time => {
  // Convert to ISO 8601 format that Date can parse
  const isoFormatted = utc_time.replace(' ', 'T') + ':00'; // Add seconds to timezone

  const date = new Date(isoFormatted);
  const timestamp = date.getTime();

  return timestamp;
};

const TripCard = ({trip}) => {
  const {
    connectedDuringTrip,
    endElapsedRealtimeMs,
    endUnixTimeMs,
    receiveNumber,
    startElapsedRealtimeMs,
    startUnixTimeMs,
    distance,
    createdAt,
    updatedAt,
  } = trip;
  let avgSpeed = withDefault(convertSpeedToKmh(null), '-');
  const distance_ = withDefault(`${distance} km`, '-');
  const durationMs = new Date(updatedAt) - new Date(createdAt);

  const duration = withDefault(formatSmartDuration(durationMs), '-');
  const startTime = withDefault(
    format12HourTime(new Date(createdAt).getTime()),
    '-',
  );
  const date = formatDateToReadable(createdAt);
  return (
    <View style={styles.container}>
      <TimeAndStatus
        duration={duration}
        time={startTime}
        status={'Completed'}
        date={date}
      />
      <TripLocation startLocation={'-'} endLocation={'-'} />
      <DistanceAndSpeed distance={distance_} avgspeed={'-'} />
    </View>
  );
};

export default TripCard;
