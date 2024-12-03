import React from 'react';
import {Text, StyleSheet} from 'react-native';

import {colors} from '../../Assets/Styles';

const {black} = colors;

const TextLimit = ({currentLength, maxLength}) => (
  <Text style={styles.limitText}>
    {currentLength}/{maxLength}
  </Text>
);

const styles = StyleSheet.create({
  limitText: {
    width: '95%',
    color: black,
    textAlign: 'right',
  },
});

export default TextLimit;
