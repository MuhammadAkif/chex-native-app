import React, {useEffect, useState} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';

import {
  startScanning,
  startBondScanning,
  disconnectDevice,
  subscribeToConnectionEvents,
  unsubscribeFromConnectionEvents,
} from '../../hooks/useSafetyTagPermissions';

const SafetyTagScanner = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);

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
});

export default SafetyTagScanner;
