import React from 'react';
import {StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {PrimaryGradientButton} from '../index';
import {colors} from '../../Assets/Styles';

const {red} = colors;

const ConnectionControls = ({
  handleScan,
  handleBondScan,
  checkDeviceConnection,
  handleDisconnectDevice,
  isConnected,
}) => (
  <View style={styles.buttonContainer}>
    <PrimaryGradientButton text={'Scan for Safety Tag'} onPress={handleScan} />
    {/*<PrimaryGradientButton
      text={'Scan for Bond Safety Tag'}
      onPress={handleBondScan}
    />*/}
    {/*<PrimaryGradientButton
      text={'Check Connection'}
      onPress={checkDeviceConnection}
    />*/}
    {isConnected && (
      <PrimaryGradientButton
        text={'Disconnect connected Device'}
        colors={[red, red]}
        onPress={handleDisconnectDevice}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    gap: hp('1%'),
    alignItems: 'center',
  },
});

export default ConnectionControls;
