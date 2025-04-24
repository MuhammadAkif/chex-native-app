import {useEffect, useState} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

/**
 * Custom hook to request and check camera permissions.
 *
 * @returns {boolean} hasPermission - Indicates whether the app has been granted camera access.
 */
export const useCameraPermissions = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      await getCameraPermission();
    })();
  }, []);

  async function getCameraPermission() {
    const cameraPermission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const status = await check(cameraPermission);
    setHasPermission(status);

    if (status === RESULTS.DENIED) {
      // Permission was denied, but we can ask again
      const newStatus = await request(cameraPermission);
      setHasPermission(newStatus);
    } else if (status === RESULTS.BLOCKED) {
      // Permission is permanently blocked, must open settings
      Alert.alert(
        'Permission Blocked',
        'Camera access is permanently denied. Please enable it in settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
        ],
      );
    }
  }

  return hasPermission;
};
