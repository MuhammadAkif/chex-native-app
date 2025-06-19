import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

const BackgroundLocation: React.FC = () => {
  useEffect(() => {
    (async () => {
      try {
        await setupGeolocation();
      } catch (err) {
        console.warn('setupGeolocation() failed:', err);
      }
    })();

    // Cleanup on component unmount
    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, []);

  async function setupGeolocation() {
    // Request location permissions for Android
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
        // Request background location permission for Android 10+
        if (Platform.Version >= 29) {
          const grantedBg = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Background Location Permission',
              message:
                'We need background location to continue tracking when the app is closed',
              buttonPositive: 'OK',
            },
          );
          if (grantedBg !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Background location permission denied');
            return;
          }
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    try {
      await BackgroundGeolocation.reset();
      await BackgroundGeolocation.ready({
        // Keep the service alive across app kills and reboots
        stopOnTerminate: false,
        startOnBoot: true,
        preventSuspend: true,

        // Always stay "moving" (never stationary)
        stopTimeout: 0,
        heartbeatInterval: 60, // 60 s between callbacks

        // Persistent notification required on Android 8+
        notification: {
          title: 'App is tracking your location',
          text: 'Tap to return to the app',
          channelName: 'Location Tracking',
          priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_LOW,
        },

        // Your existing settings...
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        url: '',
        autoSync: false,
        extras: {},
        debug: true,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      });

      // Register listeners before start
      BackgroundGeolocation.onLocation(location => {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: new Date(location.timestamp).toISOString(),
        };
        console.log('Location Data:', locationData);
      });

      BackgroundGeolocation.onMotionChange(event => {
        if (event.isMoving) {
          console.log('[MotionChange] Device started moving', event.location);
        } else {
          console.log(
            '[MotionChange] Device stopped (stationary)',
            event.location,
          );
        }
      });

      BackgroundGeolocation.onActivityChange(event => {
        console.log('[onActivityChange] ', event);
      });

      BackgroundGeolocation.onHeartbeat(event => {
        console.log('[Heartbeat] ', event.location);
      });

      // Guarded start: only start if not already enabled
      const state = await BackgroundGeolocation.getState();
      if (!state.enabled) {
        try {
          await BackgroundGeolocation.start();
        } catch (err) {
          console.warn('BackgroundGeolocation.start() failed:', err);
        }
      } else {
        console.log('BackgroundGeolocation already started');
      }
    } catch (err) {
      console.warn('BackgroundGeolocation.ready() failed:', err);
    }
  }

  return null; // This component doesn't render anything
};

export default BackgroundLocation;
