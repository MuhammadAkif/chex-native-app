import {useEffect, useState} from 'react';
import {Platform, Alert} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
  checkMultiple,
} from 'react-native-permissions';

const {BLUETOOTH_SCAN, BLUETOOTH_CONNECT, ACCESS_FINE_LOCATION} =
  PERMISSIONS.ANDROID;

const {GRANTED} = RESULTS;

const usePermissions = () => {
  const [hasBluetoothPermission, setHasBluetoothPermission] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const statuses = await checkMultiple([
          BLUETOOTH_SCAN,
          BLUETOOTH_CONNECT,
          ACCESS_FINE_LOCATION,
        ]);

        setHasBluetoothPermission(
          statuses[BLUETOOTH_SCAN] === GRANTED &&
            statuses[BLUETOOTH_CONNECT] === GRANTED,
        );
        setHasLocationPermission(statuses[ACCESS_FINE_LOCATION] === GRANTED);

        if (!hasBluetoothPermission) {
          const bluetoothRequest = await requestMultiple([
            BLUETOOTH_SCAN,
            BLUETOOTH_CONNECT,
          ]);
          setHasBluetoothPermission(
            bluetoothRequest[BLUETOOTH_SCAN] === GRANTED &&
              bluetoothRequest[BLUETOOTH_CONNECT] === GRANTED,
          );
        }
        if (!hasLocationPermission) {
          const locationRequest = await request(ACCESS_FINE_LOCATION);
          setHasLocationPermission(locationRequest === GRANTED);
        }
      }

      if (!hasBluetoothPermission) {
        Alert.alert(
          'Bluetooth Permission Required',
          'This app needs Bluetooth permissions to function correctly.',
          [{text: 'OK'}],
        );
      }
      if (!hasLocationPermission) {
        Alert.alert(
          'Location Permission Required',
          'This app needs Location permissions to function correctly.',
          [{text: 'OK'}],
        );
      }
    };

    requestPermissions().then();
  }, []);

  return {hasBluetoothPermission, hasLocationPermission};
};

export default usePermissions;
