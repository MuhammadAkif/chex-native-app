import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import LabeledCard from './LabeledCard';
import TripStatus from './TripStatus';

const TripDetails = ({
  duration = '-',
  distance = '-',
  avgSpeed = '-',
  startTime = '-',
  tripStatus = 'Not Started',
}) => (
  <View style={styles.container}>
    <Text style={styles.title}>Trip Details</Text>
    <View style={styles.labeledCardContainer}>
      <LabeledCard label={'Duration'} value={duration} />
      <LabeledCard label={'Distance'} value={distance} />
      <LabeledCard label={'Avg. Speed'} value={avgSpeed} />
      <LabeledCard label={'Start Time'} value={startTime} />
      <TripStatus value={tripStatus} />
    </View>
  </View>
);

export default TripDetails;
