import React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const LoadingIndicator = () => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={true}
    style={styles.container}>
    <View style={styles.centeredView}>
      <ActivityIndicator size={'large'} color={colors.white} />
    </View>
  </Modal>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 27, 81, 0.9)',
    paddingTop: hp('7%'),
  },
});

export default LoadingIndicator;
