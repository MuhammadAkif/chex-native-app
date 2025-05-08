import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import styles from './styles';
import {Bluetooth} from '../../../Assets/Icons';
import {SecondaryButton} from '../../index';
import {fallBack} from '../../../Utils';
import AvailableDevicesModal from './AvailableDevicesModal';

const RenderDevices = ({item: device, onPress}) => (
  <View style={styles.deviceList}>
    <View style={styles.listIconContainer}>
      <Bluetooth height={hp('3%')} width={wp('3%')} />
    </View>
    <Text
      style={styles.deviceListText}
      numberOfLines={1}
      ellipsizeMode={'tail'}>
      {device?.properties?.getTag}
    </Text>
    <SecondaryButton
      text={'Connect'}
      onPress={() => onPress(device?.properties?.getTag)}
      textStyle={[styles.cancelTextStyle, styles.connectText]}
      buttonStyle={[styles.cancelButton, styles.connectButton]}
    />
  </View>
);

const DeviceListHeader = ({text = 'Nearby devices', onPress}) => (
  <View style={[styles.deviceList, styles.headerColor]}>
    <View style={styles.listIconContainer}>
      <Bluetooth height={hp('3%')} width={wp('3%')} />
    </View>
    <Text
      style={styles.deviceListText}
      numberOfLines={1}
      ellipsizeMode={'tail'}>
      {text}
    </Text>
    <SecondaryButton
      text={'Rescan'}
      textStyle={[styles.cancelTextStyle]}
      buttonStyle={[
        styles.cancelButton,
        styles.connectButton,
        styles.rescanButton,
      ]}
      onPress={onPress}
    />
  </View>
);

const AvailableDevices = ({
  onConnectPress = fallBack,
  onRescanPress = fallBack,
  onCancelPress = fallBack,
  devices = [],
  isVisible,
}) => {
  const [availableDevicesState, setAvailableDevicesState] = useState({
    isVisible: false,
    data: [],
  });

  useEffect(() => {
    if (availableDevicesState?.isVisible !== isVisible) {
      setAvailableDevicesState(prevState => ({
        ...prevState,
        isVisible: isVisible,
      }));
    }
  }, [isVisible]);

  return (
    <AvailableDevicesModal
      visible={availableDevicesState.isVisible}
      RenderDevices={RenderDevices}
      ListHeaderComponent={DeviceListHeader}
      onConnectPress={onConnectPress}
      onRescanPress={onRescanPress}
      onCancelPress={onCancelPress}
      data={devices}
    />
  );
};

export default AvailableDevices;
