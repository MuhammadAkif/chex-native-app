import {StyleSheet, View} from 'react-native';
import React from 'react';

const IconWrapper = ({children}) => {
  return <View style={styles.iconWrapperContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  iconWrapperContainer: {
    backgroundColor: '#1E7DCB',
    width: 45,
    height: 45,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconWrapper;
