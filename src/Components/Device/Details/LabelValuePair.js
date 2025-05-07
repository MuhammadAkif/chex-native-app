import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';

const LabelValuePair = ({
  label = 'label',
  value = 'value',
  textLabelStyle,
  textValueStyle,
}) => (
  <View style={styles.labelValuePairContainer}>
    <Text
      style={[styles.label, textLabelStyle]}
      numberOfLines={1}
      ellipsizeMode={'tail'}>
      {label}:
    </Text>
    <Text
      style={[styles.value, textValueStyle]}
      numberOfLines={1}
      ellipsizeMode={'tail'}>
      {value}
    </Text>
  </View>
);

export default LabelValuePair;
