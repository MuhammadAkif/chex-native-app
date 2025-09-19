import React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../Assets/Styles';
const {width, height} = Dimensions.get('window');

const LoadingIndicator = ({isLoading}) => (
  <Modal animationType="fade" transparent={true} backdropColor={'rgba(0,0,0,.3)'} statusBarTranslucent visible={isLoading}>
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.royalBlue} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default LoadingIndicator;
