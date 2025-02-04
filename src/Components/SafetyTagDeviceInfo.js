import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const DeviceInfoRow = ({label, value}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const SafetyTagDeviceInfo = props => {
  const {isConnected = 'Disconnected', connectedDevice = {}} = props;
  if (!connectedDevice) {
    return null;
  }

  return (
    <View style={styles.deviceInfo}>
      <Text style={styles.deviceInfoTitle}>Connected Device</Text>
      <View style={styles.divider} />
      <DeviceInfoRow label="Name" value={connectedDevice.name} />
      <DeviceInfoRow label="ID" value={connectedDevice.id} />
      <DeviceInfoRow
        label="Connection State"
        value={
          connectedDevice.state || (isConnected ? 'Connected' : 'Disconnected')
        }
      />
      <DeviceInfoRow
        label="Signal Strength"
        value={
          connectedDevice.rssi !== 'N/A'
            ? `${connectedDevice.rssi} dBm`
            : 'Not Available'
        }
      />
      <DeviceInfoRow
        label="Advertising Mode"
        value={connectedDevice.advertisingMode}
      />
      <DeviceInfoRow
        label="iBeacon UUID"
        value={
          connectedDevice.iBeaconUUID !== 'N/A'
            ? connectedDevice.iBeaconUUID
            : 'Not Available'
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  deviceInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
});

export default SafetyTagDeviceInfo;
