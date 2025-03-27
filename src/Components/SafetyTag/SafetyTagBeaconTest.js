import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, DeviceEventEmitter} from 'react-native';
import {useSafetyTagBeacon} from '../../hooks/useSafetyTagBeacon';

export const SafetyTagBeaconTest = ({device}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isAutoConnectEnabled, setIsAutoConnectEnabled] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  const {
    startMonitoring,
    stopMonitoring,
    isBeingMonitored,
    enableAutoConnect,
    disableAutoConnect,
    isAutoConnectEnabled: checkAutoConnect,
    startSignificantLocationChanges,
    stopSignificantLocationChanges,
  } = useSafetyTagBeacon({
    onRegionEntered: event => {
      setLastEvent({type: 'entered', ...event});
    },
    onRegionExited: event => {
      setLastEvent({type: 'exited', ...event});
    },
    onRegionStateChanged: event => {
      setLastEvent({type: 'stateChanged', ...event});
    },
    onDeviceMonitoringStatus: onDeviceMonitoringStatus,
    onAutoConnectStatus: onAutoConnectStatus,
  });

  useEffect(() => {
    if (device) {
      // Check initial states
      checkStates().then();
    }
  }, [device]);

  function onDeviceMonitoringStatus(event) {
    setIsMonitoring(event);
  }

  function onAutoConnectStatus(event) {
    setIsMonitoring(event);
  }

  const checkStates = async () => {
    if (device) {
      isBeingMonitored(device).then();
      const autoConnect = await checkAutoConnect(device);
      setIsAutoConnectEnabled(autoConnect);
    }
  };

  const handleStartMonitoring = async () => {
    if (device) {
      await startMonitoring(device);
      await checkStates();
    }
  };

  const handleStopMonitoring = async () => {
    if (device) {
      await stopMonitoring(device);
      await checkStates();
    }
  };

  const handleEnableAutoConnect = async () => {
    if (device) {
      await enableAutoConnect(device);
      await checkStates();
    }
  };

  const handleDisableAutoConnect = async () => {
    if (device) {
      await disableAutoConnect(device);
      await checkStates();
    }
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>No device selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafetyTag Beacon Test</Text>

      <View style={styles.deviceInfo}>
        <Text style={styles.deviceTitle}>Device Info:</Text>
        <Text>ID: {device.id}</Text>
        <Text>Name: {device.name}</Text>
        <Text>iBeacon UUID: {device.iBeaconUUID}</Text>
      </View>

      <View style={styles.status}>
        <Text style={styles.statusTitle}>Status:</Text>
        <Text>Monitoring: {isMonitoring ? '✅' : '❌'}</Text>
        <Text>Auto-Connect: {isAutoConnectEnabled ? '✅' : '❌'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          onPress={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
        />
        <Button
          title={
            isAutoConnectEnabled
              ? 'Disable Auto-Connect'
              : 'Enable Auto-Connect'
          }
          onPress={
            isAutoConnectEnabled
              ? handleDisableAutoConnect
              : handleEnableAutoConnect
          }
        />
        <Button
          title="Start Location Changes"
          onPress={startSignificantLocationChanges}
        />
        <Button
          title="Stop Location Changes"
          onPress={stopSignificantLocationChanges}
        />
      </View>

      {lastEvent && (
        <View style={styles.eventContainer}>
          <Text style={styles.eventTitle}>Last Event:</Text>
          <Text>Type: {lastEvent.type}</Text>
          <Text>State: {lastEvent.state}</Text>
          <Text>Device: {lastEvent.deviceName}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  warning: {
    color: 'red',
    fontSize: 16,
  },
  deviceInfo: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  deviceTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 8,
    marginBottom: 16,
  },
  eventContainer: {
    padding: 8,
    backgroundColor: '#e6ffe6',
    borderRadius: 8,
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
