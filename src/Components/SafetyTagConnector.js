import React from 'react';
import {View, Text, Button, Alert} from 'react-native';
import {NativeModules} from 'react-native';
import usePermissions from '../hooks/usePermissions';

const {SafetyTagModule} = NativeModules;

const SafetyTagConnector = () => {
  const {hasBluetoothPermission, hasLocationPermission} = usePermissions();

  const connectToTag = async () => {
    const havePermissions = hasBluetoothPermission && hasLocationPermission;
    console.log('Checking permissions: ', havePermissions);
    if (!havePermissions) {
      Alert.alert(
        'Error',
        'Bluetooth permissions are required to connect to devices.',
      );
      return;
    }
    try {
      console.log('Triggering native module');
      const message = await SafetyTagModule.connectToFirstDiscoveredTag();
      Alert.alert('Success', message);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 20}}>
        Connect to the first discovered Safety Tag
      </Text>
      <Button title="Connect to Tag" onPress={connectToTag} />
    </View>
  );
};

export default SafetyTagConnector;
