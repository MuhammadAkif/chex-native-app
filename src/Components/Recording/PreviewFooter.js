import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {PrimaryGradientButton, SecondaryButton} from '../index';

const PreviewFooter = ({onRetryPress, onNextPress}) => (
  <View style={styles.container}>
    <SecondaryButton
      text={'Retry'}
      buttonStyle={[styles.button, styles.retryButton]}
      onPress={onRetryPress}
    />
    <PrimaryGradientButton
      text={'Next'}
      buttonStyle={styles.button}
      onPress={onNextPress}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: Platform.OS === 'ios' ? 0.2 : 0,
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: '5%',
  },
  button: {
    width: wp('35%'),
  },
  retryButton: {
    borderRadius: 20,
  },
});

export default PreviewFooter;
