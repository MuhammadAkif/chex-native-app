import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  Alert,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import useSafetyTag from '../../hooks/useSafetyTag';
import {formatRawData} from '../../Utils/helpers';
import AccelerometerDisplay from './AccelerometerDisplay';
import CrashTestingTool from './CrashTestingTool';

const SafetyTagScanner = () => {
  const [tripData, setTripData] = useState([]);

  const {
    startScanning,
    startBondScanning,
    getDeviceConfiguration,
    disconnectDevice,
    subscribeToConnectionEvents,
    unsubscribeFromConnectionEvents,
    queryTripData,
    queryTripWithFraudData,
    readBatteryLevel,
  } = useSafetyTag();

  useEffect(() => {
    subscribeToConnectionEvents().then();

    return unsubscribeFromConnectionEvents;
  }, []);

  async function handleScan() {
    try {
      await startScanning();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetDeviceConfiguration() {
    try {
      await getDeviceConfiguration();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleBondScan() {
    try {
      await startBondScanning();
    } catch (error) {
      console.error(error);
    }
  }

  const handleDisconnectDevice = async () => {
    try {
      await disconnectDevice();
    } catch (error) {
      console.error(error);
    }
  };

  const handleQueryTripData = async () => {
    try {
      const rawData = await queryTripData();
      // Parse and format the trip data
      const trips = formatRawData(rawData);
      setTripData(trips);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const handleQueryTripDataWithFraud = async () => {
    try {
      const rawData = await queryTripWithFraudData();
      // Parse and format the trip data
      const trips = formatRawData(rawData);
      setTripData(trips);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderTripItem = ({item}) => {
    const {receiveNumber, startUnixTime, endUnixTime, connectedDuringTrip} =
      item;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Trip #{receiveNumber}</Text>
        <Text style={styles.title}>Start Time: {startUnixTime}</Text>
        <Text style={styles.title}>End Time: {endUnixTime}</Text>
        <Text style={styles.title}>
          Connected During Trip: {connectedDuringTrip || 'N/A'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Button title="Scan for Safety Tag" onPress={handleScan} />
        <Button title="Scan for Bond Safety Tag" onPress={handleBondScan} />
        {/*<Button
          title="Get Safety Tag device configuration"
          onPress={handleGetDeviceConfiguration}
        />
        <Button
          title="Unsubscribe Device Info"
          onPress={unsubscribeFromConnectionEvents}
        />*/}
        <Button
          title="Disconnect connected Device"
          onPress={handleDisconnectDevice}
        />
        {/*<Button title="Read battery level" onPress={readBatteryLevel} />*/}

        <View style={[styles.tripContainer, styles.gap]}>
          <Button title="Query Trip Data" onPress={handleQueryTripData} />
          <Button
            title="Query Trip Data With Fraud"
            onPress={handleQueryTripDataWithFraud}
          />
          <FlatList
            data={tripData}
            renderItem={renderTripItem}
            style={styles.tripList}
            keyExtractor={item => item.receiveNumber.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        <AccelerometerDisplay />
        <CrashTestingTool />
      </ScrollView>
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
  gap: {
    rowGap: wp('2%'),
  },
  section: {
    marginVertical: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  list: {
    maxHeight: 200,
  },
});

export default SafetyTagScanner;
