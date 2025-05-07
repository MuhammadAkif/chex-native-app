import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';
import AddressStatusList from './AddressStatusList';
import {fallBack} from '../../../Utils';

const TripTimeline = ({
  primaryLocation = {title: 'Home', address: '456 Business Ave'},
  secondaryLocation = {title: 'Downtown Office', address: '789 Commerce Rd'},
  onAddCommentsPress = fallBack,
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Trip Timeline</Text>
    </View>
    <AddressStatusList
      primaryLocation={primaryLocation}
      secondaryLocation={secondaryLocation}
    />
  </View>
);

export default TripTimeline;
