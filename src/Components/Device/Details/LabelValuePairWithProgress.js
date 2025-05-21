import React from 'react';
import {Text, View} from 'react-native';
import {Bar} from 'react-native-progress';

import styles from './styles';

const LabelValuePairWithProgress = ({
  label = 'label',
  value = 'value',
  textLabelStyle,
  textValueStyle,
}) => (
  <View style={styles.progressLabelValuePairContainer}>
    <Text
      style={[styles.label, textLabelStyle]}
      numberOfLines={1}
      ellipsizeMode={'tail'}>
      {label}:
    </Text>
    <View style={styles.progressContainer}>
      <Bar progress={0.99} width={80} height={5} style={styles.progressBar} />
      <Text
        style={[styles.value, styles.progressValue, textValueStyle]}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {value}
      </Text>
    </View>
  </View>
);

export default LabelValuePairWithProgress;
