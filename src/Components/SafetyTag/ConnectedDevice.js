import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../../Assets/Styles';
import {isNotEmpty} from '../../Utils';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const {black} = colors;

const ConnectedDevice = ({connectedDevice}) => (
  <View style={styles.deviceInfoContainer}>
    <Text style={[styles.deviceInfoTitle, styles.textColor]}>
      {isNotEmpty(connectedDevice?.address)
        ? 'Device Connected 🟢'
        : 'Device Not Connected 🔴'}
    </Text>
    {isNotEmpty(connectedDevice) && (
      <>
        <Text style={[styles.deviceInfoText, styles.textColor]}>
          Address: {connectedDevice?.address}
        </Text>
        <Text style={[styles.deviceInfoText, styles.textColor]}>
          Bond Status: {connectedDevice?.isBonded ? 'Bonded' : 'Not Bonded'}
        </Text>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  deviceInfoContainer: {
    width: wp('90%'),
    alignSelf: 'center',
    padding: wp('4%'),
    backgroundColor: '#f5f5f5',
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  deviceInfoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  textColor: {
    color: black,
  },
});

export default ConnectedDevice;
