import React, { useEffect, useState } from 'react';
import { NativeModules, Text, Button, View, StyleSheet } from 'react-native';

const { SafetyTag } = NativeModules;

const SafetyTagConnector = () => {
  const [status, setStatus] = useState('Idle');
  const [tagAddress, setTagAddress] = useState(null);

  const connectToTag = () => {
    setStatus('Discovering...');
    SafetyTag.connectToFirstDiscoveredTag()
      .then((address) => {
        setStatus('Connected');
        setTagAddress(address);
      })
      .catch((error) => {
        setStatus(`Error: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Status: {status}</Text>
      {tagAddress && <Text style={styles.address}>Tag Address: {tagAddress}</Text>}
      <Button title="Connect to Tag" onPress={connectToTag} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    marginBottom: 20,
    color: 'blue',
  },
});

export default SafetyTagConnector;
