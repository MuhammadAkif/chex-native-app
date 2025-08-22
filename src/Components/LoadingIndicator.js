import React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const {white, cobaltBlueLight} = colors;

const LoadingIndicator = ({isLoading}) => (
  <Modal animationType="slide" transparent={true} statusBarTranslucent visible={isLoading} style={styles.container}>
    <View style={styles.centeredView}>
      <ActivityIndicator size={'large'} color={white} />
    </View>
    <StatusBar backgroundColor={cobaltBlueLight} barStyle="light-content" translucent={true} />
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
    backgroundColor: cobaltBlueLight,
    paddingTop: hp('7%'),
  },
});

export default LoadingIndicator;
