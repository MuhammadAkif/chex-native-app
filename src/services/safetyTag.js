import {NativeModules} from 'react-native';

const {SafetyTag} = NativeModules;

export default {
  discoverDevices: () => SafetyTag.discoverDevices(),
  connectToDevice: deviceName => SafetyTag.connectToDevice(deviceName),
};

async function handleDeviceConnection() {
  try {
    // Discover devices
    const deviceName = await SafetyTag.discoverDevices();
    console.log(`Discovered: ${deviceName}`);

    // Connect to the device
    const connectionMessage = await SafetyTag.connectToDevice(deviceName);
    console.log(connectionMessage);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
