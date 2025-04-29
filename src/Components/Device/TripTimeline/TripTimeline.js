import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import AddressStatusList from './AddressStatusList';

const TripTimeline = ({
  primaryLocation = {title: 'Home', address: '456 Business Ave'},
  secondaryLocation = {title: 'Downtown Office', address: '789 Commerce Rd'},
}) => (
  <View style={styles.container}>
    <Text style={styles.title}>Trip Timeline</Text>
    <AddressStatusList
      primaryLocation={primaryLocation}
      secondaryLocation={secondaryLocation}
    />
  </View>
);

export default TripTimeline;
