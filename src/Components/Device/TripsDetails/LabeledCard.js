import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';

const LabeledCard = ({label = 'label', value = 'Value'}) => (
  <View style={styles.labelCardContainer}>
    <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.label}>
      {label}
    </Text>
    <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.value}>
      {value}
    </Text>
  </View>
);
export default LabeledCard;
