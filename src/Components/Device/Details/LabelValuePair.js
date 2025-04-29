import {Text} from 'react-native';
import React from 'react';
import styles from './styles';

const LabelValuePair = ({label = 'label', value = 'value'}) => (
  <Text style={styles.label} numberOfLines={1} ellipsizeMode={'tail'}>
    {label}: <Text style={styles.value}>{value}</Text>
  </Text>
);

export default LabelValuePair;
