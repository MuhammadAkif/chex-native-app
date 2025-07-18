import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';

import {colors} from '../Assets/Styles';

const {cobaltBlueLight} = colors;

const HeaderBackground = () => {
  return (
    <>
    <StatusBar translucent barStyle={''}/>
    <View style={styles.container} />
    </>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cobaltBlueLight,
  },
});

export default HeaderBackground;
