import React from 'react';
import {View, StyleSheet} from 'react-native';

import {colors} from '../Assets/Styles';

const {cobaltBlueLight} = colors;

const HeaderBackground = () => <View style={styles.container} />;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cobaltBlueLight,
  },
});

export default HeaderBackground;
