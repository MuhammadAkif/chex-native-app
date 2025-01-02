import React, {useEffect, useState} from 'react';
import {View, Button, Text, Alert, StyleSheet, FlatList} from 'react-native';

import {
  startScanning,
  startBondScanning,
  disconnectDevice,
  subscribeToConnectionEvents,
  unsubscribeFromConnectionEvents,
  configTripStartRecognitionForce,
  configTripStartRecognitionDuration,
  configTripEndTimeout,
  configTripMinimalDuration,
  queryTripData,
} from '../../hooks/useSafetyTagPermissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const SafetyTagScanner = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [tripData, setTripData] = useState([]);

  useEffect(() => {
    subscribeToConnectionEvents();

    return unsubscribeFromConnectionEvents;
  }, []);

  const handleScan = async () => {
    try {
      await startScanning();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBondScan = async () => {
    try {
      await startBondScanning();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnectDevice = async () => {
    try {
      await disconnectDevice();
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfigForce = async () => {
    try {
      await configTripStartRecognitionForce(50);
      Alert.alert('Success', 'Trip start recognition force configured');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleConfigDuration = async () => {
    try {
      await configTripStartRecognitionDuration(100);
      Alert.alert('Success', 'Trip start recognition duration configured');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleConfigTimeout = async () => {
    try {
      await configTripEndTimeout(30);
      Alert.alert('Success', 'Trip end timeout configured');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleConfigMinimalDuration = async () => {
    try {
      await configTripMinimalDuration(10);
      Alert.alert('Success', 'Minimal trip duration configured');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const formatUnixTime = unixTime => {
    const date = new Date(unixTime);
    return date.toLocaleString();
  };

  const handleQueryTripData = async () => {
    try {
      const rawData = await queryTripData();
      // Parse and format the trip data
      const trips = rawData
        .split('\n')
        .filter(line => line.startsWith('Trip'))
        .map(tripStr => {
          const data = tripStr
            .match(/(\w+)=([^,)\s]+)/g)
            .reduce((obj, pair) => {
              const [key, value] = pair.split('=');
              obj[key] = isNaN(value) ? value : Number(value); // Convert numbers
              return obj;
            }, {});
          const {startUnixTimeMs = 0, endUnixTimeMs = 0} = data || {};
          return {
            ...data,
            startUnixTime: formatUnixTime(startUnixTimeMs),
            endUnixTime: formatUnixTime(endUnixTimeMs),
          };
        });
      setTripData(trips);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderTripItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.title}>Trip #{item.receiveNumber}</Text>
      <Text style={styles.title}>Start Time: {item.startUnixTime}</Text>
      <Text style={styles.title}>End Time: {item.endUnixTime}</Text>
      <Text style={styles.title}>
        Connected During Trip: {item.connectedDuringTrip || 'N/A'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Scan for Safety Tag" onPress={handleScan} />
      <Button title="Scan for Bond Safety Tag" onPress={handleBondScan} />
      <Button
        title="Unsubscribe Device Info"
        onPress={unsubscribeFromConnectionEvents}
      />
      <Button
        title="Disconnect connected Device"
        onPress={handleDisconnectDevice}
      />
      {deviceInfo && <Text style={styles.deviceInfo}>{deviceInfo}</Text>}

      <View style={styles.tripContainer}>
        <Text>Safety Tag Module Example</Text>
        <Button title="Query Trip Data" onPress={handleQueryTripData} />
        <FlatList
          data={tripData}
          renderItem={renderTripItem}
          style={styles.tripList}
          keyExtractor={item => item.receiveNumber.toString()}
          contentContainerStyle={styles.listContainer}
        />
        <Button title="Config Force" onPress={handleConfigForce} />
        <Button title="Config Duration" onPress={handleConfigDuration} />
        <Button title="Config Timeout" onPress={handleConfigTimeout} />
        <Button
          title="Config Minimal Duration"
          onPress={handleConfigMinimalDuration}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  tripList: {
    height: hp('100%'),
    width: wp('100%'),
    backgroundColor: 'gray',
  },
  tripContainer: {
    height: hp('60%'),
  },
});

export default SafetyTagScanner;
