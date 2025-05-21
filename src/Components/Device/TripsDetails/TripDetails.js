import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import LabeledCard from './LabeledCard';
import TripStatus from './TripStatus';
import {IconLabel} from '../../index';
import {fallBack} from '../../../Utils';
import NoDeviceConnected from '../NoDeviceConnected';

const TripDetails = ({
  duration = '-',
  distance = '-',
  avgSpeed = '-',
  startTime = '-',
  tripStatus = 'Not Started',
  onViewHistoryPress = fallBack,
  displayHeader = true,
}) => (
  <View style={styles.container}>
    {displayHeader && (
      <View style={styles.header}>
        <Text style={styles.title}>Trip Details</Text>
        <IconLabel label={'View Trip History'} onPress={onViewHistoryPress} />
      </View>
    )}
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
