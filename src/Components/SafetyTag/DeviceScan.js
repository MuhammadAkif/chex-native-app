import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../Assets/Styles';

const DeviceScan = ({devices, isScanning, onDeviceSelect}) => {
  const handleOnDeviceSelect = device => {
    onDeviceSelect(device);
  };
  const renderDeviceItem = ({item}) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => handleOnDeviceSelect(item)}>
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceId}>ID: {item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Devices</Text>
        {isScanning && <ActivityIndicator color={colors.primary} />}
      </View>

      {devices.length > 0 ? (
        <FlatList
          data={devices}
          renderItem={renderDeviceItem}
          keyExtractor={item => item.id}
          style={styles.deviceList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {isScanning ? 'Scanning for devices...' : 'No devices found'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deviceList: {
    maxHeight: 300,
  },
  deviceItem: {
    padding: 15,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginVertical: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  deviceId: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 16,
  },
});

export default DeviceScan;
