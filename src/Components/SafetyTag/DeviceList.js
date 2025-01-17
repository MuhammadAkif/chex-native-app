import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import useSafetyTag from '../../hooks/useSafetyTag';
import {colors} from '../../Assets/Styles';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const {
    startDiscovery,
    stopDiscovery,
    connectToDevice,
    connectToBondedDevice,
  } = useSafetyTag();

  useEffect(() => {
    startDiscovery().then();

    const deviceSubscription = DeviceEventEmitter.addListener(
      'onDeviceFound',
      event => {
        /*console.log(
          'Complete Device Info:',
          JSON.stringify(event.device, null, 2),
        );*/
        const newDevice = event.device;
        setDevices(prevDevices => {
          const exists = prevDevices.some(
            device => device.properties.getTag === newDevice.properties.getTag,
          );
          if (!exists) {
            return [...prevDevices, newDevice];
          }
          return prevDevices;
        });
      },
    );

    // Cleanup
    return () => {
      stopDiscovery().then();
      deviceSubscription.remove();
    };
  }, []);

  const handleDeviceSelect = async device => {
    try {
      let status = null;
      if (device.properties.isBonded) {
        status = await connectToBondedDevice(device.properties.getTag);
      } else {
        status = await connectToDevice(device.properties.getTag);
      }
      console.log({status});
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const renderDevice = ({item}) => {
    const {
      properties: {getTag, getAdvertisementMode, isBonded, getRssi},
    } = item;
    return (
      <TouchableOpacity
        style={styles.deviceItem}
        onPress={() => handleDeviceSelect(item)}>
        <Text style={styles.deviceName}>SafetyTag {getTag || 'Unknown'}</Text>
        <Text style={styles.deviceAddress}>
          Advertisement Mode: {getAdvertisementMode}
        </Text>
        <Text style={styles.deviceStatus}>
          {isBonded === 'true' ? '🔒 Bonded' : '📡 Available'} • Signal:{' '}
          {getRssi} dBm
        </Text>
      </TouchableOpacity>
    );
  };

  const devicesKeyExtractor = device => {
    const {
      properties: {getTag},
    } = device;
    return getTag;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Devices</Text>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={devicesKeyExtractor}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Searching for devices...</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  deviceName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: colors.black,
  },
  deviceAddress: {
    fontSize: hp('1.8%'),
    color: '#666',
  },
  deviceStatus: {
    fontSize: hp('1.6%'),
    color: '#333',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
  },
});

export default DeviceList;
