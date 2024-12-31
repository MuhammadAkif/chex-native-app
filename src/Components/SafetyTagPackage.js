/*
import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, DeviceEventEmitter} from 'react-native';
import {NativeModules} from 'react-native';
import {requestBluetoothPermissions} from '../Utils/helpers';

const {SafetyTag} = NativeModules;

const SafetyTagComponent = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logMessages, setLogMessages] = useState([]); // Store logs

  useEffect(() => {
    // Initialize safety tag and listen to logs from the native side
    initializeSafetyTag().then();
    requestBluetoothPermissions().then();

    const logListener = DeviceEventEmitter.addListener(
      'SafetyTagLog',
      message => {
        console.log('Native Log:', message);
        setLogMessages(prevLogs => [...prevLogs, message]); // Update logs
      },
    );

    // Cleanup the listener when the component is unmounted
    return () => {
      logListener.remove();
    };
  }, []);

  const initializeSafetyTag = async () => {
    try {
      const message = await SafetyTag.initialize();
      setStatusMessage(message);
      console.log('Initialization Success:', message);
    } catch (error) {
      setErrorMessage('Initialization error: ' + error.message);
      console.error('Initialization error:', error);
    }
  };

  const connectToFirstTag = async () => {
    const hasPermissions = await requestBluetoothPermissions();
    if (hasPermissions) {
      try {
        const message = await SafetyTag.connectToFirstDiscoveredTagSample();
        setStatusMessage(message);
        console.log('Connection Success:', message);
      } catch (error) {
        setErrorMessage('Connection error: ' + error.message);
        console.error('Connection error:', error);
      }
    } else {
      await requestBluetoothPermissions();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Tag Module</Text>
      {statusMessage ? (
        <Text style={styles.success}>{statusMessage}</Text>
      ) : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button
        title="Connect to First Discovered Tag"
        onPress={connectToFirstTag}
      />

      {/!* Display the logs *!/}
      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Logs from Native Module:</Text>
        {logMessages.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {log}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  success: {
    color: 'green',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  logContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    width: '100%',
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SafetyTagComponent;
*/
