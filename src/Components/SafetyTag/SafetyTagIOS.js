import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {NativeModules, NativeEventEmitter} from 'react-native';

const {SafetyTagModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(SafetyTagModule);

const DeviceInfoRow = ({label, value}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const SafetyTagIOS = () => {
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Subscribe to SafetyTag events
    SafetyTagModule.startObserving();
    const subscriptions = [
      eventEmitter.addListener('onDeviceDiscovered', event => {
        console.log('Device discovered:', event);
      }),
      eventEmitter.addListener('onDeviceConnected', event => {
        console.log('Device connected:', event);
        setConnectedDevice(event);
        setIsConnected(true);
      }),
      eventEmitter.addListener('onDeviceConnectionFailed', event => {
        console.error('Connection failed:', event);
        setConnectedDevice(null);
        setIsConnected(false);
      }),
      eventEmitter.addListener('onDeviceDisconnected', event => {
        console.log('Device disconnected:', event);
        setConnectedDevice(null);
        setIsConnected(false);
      }),
      eventEmitter.addListener('onGetConnectedDevice', event => {
        console.log('Got connected device info:', event);
        if (!event.error) {
          setConnectedDevice(event);
          setIsConnected(true);
        } else {
          setConnectedDevice(null);
          setIsConnected(false);
        }
      }),
      eventEmitter.addListener('onCheckConnection', event => {
        console.log('Connection status:', event);
        setIsConnected(event.isConnected);
      }),
    ];

    // Cleanup subscriptions
    return () => {
      SafetyTagModule.stopObserving();
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  const handleStartScan = async () => {
    try {
      console.log('Starting scan for SafetyTag devices...');
      await SafetyTagModule.startScan();
    } catch (error) {
      console.error('Error starting scan:', error);
    }
  };

  const handleCheckConnection = async () => {
    try {
      console.log('Checking SafetyTag connection...');
      await SafetyTagModule.checkConnection();
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleDisconnectDevice = async () => {
    try {
      console.log('Disconnecting SafetyTag Device...');
      await SafetyTagModule.disconnectDevice();
      setConnectedDevice(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Error Disconnecting SafetyTag Device:', error);
    }
  };

  const handleGetDeviceInformation = async () => {
    try {
      console.log('Fetching SafetyTag Device Information...');
      await SafetyTagModule.getConnectedDevice();
    } catch (error) {
      console.error('Error Fetching SafetyTag Device Information:', error);
    }
  };

  const renderDeviceInfo = () => {
    if (!connectedDevice) return null;

    return (
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceInfoTitle}>Connected Device</Text>
        <View style={styles.divider} />
        <DeviceInfoRow label="Name" value={connectedDevice.name} />
        <DeviceInfoRow label="ID" value={connectedDevice.id} />
        <DeviceInfoRow 
          label="Connection State" 
          value={connectedDevice.state || (isConnected ? 'Connected' : 'Disconnected')} 
        />
        <DeviceInfoRow 
          label="Signal Strength" 
          value={connectedDevice.rssi !== 'N/A' ? `${connectedDevice.rssi} dBm` : 'Not Available'} 
        />
        <DeviceInfoRow 
          label="Advertising Mode" 
          value={connectedDevice.advertisingMode} 
        />
        <DeviceInfoRow 
          label="iBeacon UUID" 
          value={connectedDevice.iBeaconUUID !== 'N/A' ? connectedDevice.iBeaconUUID : 'Not Available'} 
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>SafetyTag Scanner</Text>
        
        {renderDeviceInfo()}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStartScan}>
            <Text style={styles.buttonText}>Start Scan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonMargin]} 
            onPress={handleCheckConnection}>
            <Text style={styles.buttonText}>Check Connection</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonMargin]} 
            onPress={handleGetDeviceInformation}>
            <Text style={styles.buttonText}>Refresh Device Info</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonMargin, styles.disconnectButton]} 
            onPress={handleDisconnectDevice}>
            <Text style={styles.buttonText}>Disconnect Device</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonMargin: {
    marginTop: 12,
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
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

export default SafetyTagIOS;
