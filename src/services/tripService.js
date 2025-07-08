import notifee, {
  AndroidCategory,
  AndroidImportance,
} from '@notifee/react-native';
import Geolocation from '@react-native-community/geolocation';
import {Alert, Linking, Platform} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {store} from '../Store';
import {addLocation, setTrackingStatus} from '../Store/Actions/TripAction';

class TripService {
  constructor() {
    this.watchId = null;
    this.backgroundFetchInitialized = false;
    this.notificationId = 'trip-tracking-notification';
    this.notificationIntervalId = null;

    this.initializeNotifications();
    this.setupLocationService();
  }

  // FIXED: iOS-specific location setup
  setupLocationService() {
    if (Platform.OS === 'ios') {
      // Configure geolocation for iOS
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'always', // or 'always' for background
        enableBackgroundLocationUpdates: false, // Set to true if you need background
        locationProvider: 'auto',
      });
    }
  }

  async requestAllPermissions() {
    if (Platform.OS === 'ios') {
      try {
        const status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (status === RESULTS.GRANTED) {
          return true;
        }
        if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
          const reqStatus = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
          return reqStatus === RESULTS.GRANTED;
        }
        if (status === RESULTS.BLOCKED) {
          Alert.alert(
            'Location Permission Required',
            'Please enable location access in Settings > Privacy & Security > Location Services > Your App',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Open Settings',
                onPress: () => Linking.openURL('app-settings:'),
              },
            ],
          );
          return false;
        }
        return false;
      } catch (error) {
        console.error('[TripService] iOS location permission error:', error);
        return false;
      }
    } else {
      // Android permission logic (keep existing)
      try {
        const {PermissionsAndroid} = require('react-native');

        const locationPermissions = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const fineLocationGranted =
          locationPermissions[
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ] === 'granted';

        if (!fineLocationGranted) {
          console.error('Fine location permission not granted');
          return false;
        }

        if (Platform.Version >= 29) {
          const backgroundPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Background Location Permission',
              message:
                'This app needs background location access to track trips when the app is closed.',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            },
          );

          if (backgroundPermission !== 'granted') {
            console.warn('Background location permission not granted');
          }
        }

        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }

        return fineLocationGranted;
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
  }

  /**
   * Ensures 'Always' location permission is granted. If not, shows a custom dialog and redirects user to settings or system dialog.
   * @param {function} showCustomDialog - Callback to show a custom dialog. Should accept a callback to continue to settings.
   * @returns {Promise<boolean>} true if permission is granted, false otherwise
   */
  async ensureAlwaysLocationPermission(showCustomDialog) {
    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      if (status === RESULTS.GRANTED) {
        return true;
      }
      // Show custom dialog if not granted
      if (typeof showCustomDialog === 'function') {
        await new Promise(resolve => {
          showCustomDialog(async () => {
            // After user agrees, open settings
            Linking.openURL('app-settings:');
            resolve();
          });
        });
      } else {
        // Fallback: show system dialog
        await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      }
      // Re-check after user action
      const newStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      return newStatus === RESULTS.GRANTED;
    } else {
      // Android: check ACCESS_BACKGROUND_LOCATION
      const {PermissionsAndroid} = require('react-native');
      const bgStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
      );
      if (bgStatus) return true;
      if (typeof showCustomDialog === 'function') {
        await new Promise(resolve => {
          showCustomDialog(async () => {
            Linking.openSettings();
            resolve();
          });
        });
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
      }
      // Re-check after user action
      const newBgStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
      );
      return newBgStatus;
    }
  }

  /**
   * Requests all necessary location permissions, showing a custom modal if needed.
   * Returns true if permission is granted, false otherwise.
   * @param {function} showCustomDialog - Called if 'Always' permission is denied (for iOS or Android fallback)
   * @param {function} showBackgroundDialog - Called before requesting background location on Android
   */
  async requestLocationPermissionsWithModal(showCustomDialog, showBackgroundDialog) {
    if (Platform.OS === 'ios') {
      // 1. Request When In Use first
      let status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      if (status !== RESULTS.GRANTED) {
        let whenInUseStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (whenInUseStatus !== RESULTS.GRANTED) {
          whenInUseStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        }
        // Now request Always
        status = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      }
      if (status === RESULTS.GRANTED) {
        return true;
      } else {
        // Show custom modal if not granted
        await this.ensureAlwaysLocationPermission(showCustomDialog);
        // Re-check after modal
        status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        return status === RESULTS.GRANTED;
      }
    } else if (Platform.OS === 'android') {
      const { PermissionsAndroid } = require('react-native');
      // 1. Request foreground location first
      let fineGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (!fineGranted) {
        const fineResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        fineGranted = fineResult === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (!fineGranted) return false;

      // 2. Show background permission modal before requesting background location
      let bgGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
      );
      if (!bgGranted) {
        // Only show modal if permission is not already granted
        if (typeof showBackgroundDialog === 'function') {
          await new Promise(resolve => {
            showBackgroundDialog(() => {
              resolve();
            });
          });
        }
        const bgResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
        bgGranted = bgResult === PermissionsAndroid.RESULTS.GRANTED;
        if (!bgGranted) {
          // Show custom modal if not granted
          await this.ensureAlwaysLocationPermission(showCustomDialog);
          // Re-check after modal
          bgGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
          );
        }
      }
      return bgGranted;
    }
    return false;
  }

  async initializeBackgroundFetch() {
    if (this.backgroundFetchInitialized) return;

    try {
      const status = await BackgroundFetch.configure(
        {
          minimumFetchInterval: 15,
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
          forceAlarmManager: false,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
          requiresBatteryNotLow: false,
          requiresCharging: false,
          requiresDeviceIdle: false,
        },
        async taskId => {
          console.log('[TripService] Background fetch event:', taskId);

          try {
            await this.performLocationUpdate();
          } catch (error) {
            console.error('[TripService] Background task error:', error);
          }

          BackgroundFetch.finish(taskId);
        },
        async taskId => {
          console.log('[TripService] Background fetch timeout:', taskId);
          BackgroundFetch.finish(taskId);
        },
      );

      console.log('[TripService] BackgroundFetch configure status:', status);

      switch (status) {
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('[TripService] BackgroundFetch available');
          this.backgroundFetchInitialized = true;
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.warn('[TripService] BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_RESTRICTED:
          console.warn('[TripService] BackgroundFetch restricted');
          break;
        default:
          console.warn('[TripService] BackgroundFetch unknown status:', status);
      }
    } catch (error) {
      console.error('[TripService] BackgroundFetch config error:', error);
    }
  }

  async startLocationTracking() {
    try {
      // Request permissions first
      const hasPermission = await this.requestAllPermissions();

      if (!hasPermission) {
        throw new Error('Location permission denied');
      }
      // FIXED: Check if location services are enabled on iOS
      if (Platform.OS === 'ios') {
        const isLocationEnabled = await this.checkLocationServicesEnabled();
        if (!isLocationEnabled) {
          throw new Error(
            'Location services are disabled. Please enable them in Settings.',
          );
        }
      }

      // Initialize background fetch if not already done
      await this.initializeBackgroundFetch();

      // Start foreground location tracking
      this.startForegroundTracking();

      // Start BackgroundFetch (iOS has limitations)
      if (Platform.OS === 'android' || this.backgroundFetchInitialized) {
        const status = await BackgroundFetch.start();
        console.log('[TripService] BackgroundFetch start status:', status);
      }

      // Show persistent notification
      await this.showTrackingNotification();

      // Start notification timer (every 1 minute)
      if (this.notificationIntervalId) {
        clearInterval(this.notificationIntervalId);
      }
      this.notificationIntervalId = setInterval(() => {
        this.updateTrackingNotification();
      }, 60000); // 1 minute

      store.dispatch(setTrackingStatus(true));

      return true;
    } catch (error) {
      console.error('[TripService] Start tracking error:', error);
      throw error;
    }
  }

  // FIXED: Check if location services are enabled on iOS
  async checkLocationServicesEnabled() {
    return new Promise(resolve => {
      if (Platform.OS === 'ios') {
        // Try to get current position to check if services are enabled
        Geolocation.getCurrentPosition(
          position => {
            console.log('[TripService] Location services are enabled');
            resolve(true);
          },
          error => {
            console.log('[TripService] Location services check error:', error);
            if (error.code === 2) {
              // POSITION_UNAVAILABLE
              Alert.alert(
                'Location Services Disabled',
                'Please enable Location Services in Settings > Privacy & Security > Location Services',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Open Settings',
                    onPress: () => {
                      if (Platform.OS === 'ios') {
                        Linking.openURL('App-prefs:LOCATION_SERVICES');
                      }
                    },
                  },
                ],
              );
              resolve(false);
            } else {
              resolve(false);
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000,
          },
        );
      } else {
        resolve(true); // Android handles this differently
      }
    });
  }

  startForegroundTracking() {
    // Clear any existing watch
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    // FIXED: iOS-optimized location tracking options
    const locationOptions =
      Platform.OS === 'ios'
        ? {
            enableHighAccuracy: true,
            timeout: 30000, // Longer timeout for iOS
            maximumAge: 10000, // Accept newer cached locations
            distanceFilter: 10, // Only update when moved 10m
            useSignificantChanges: false, // Use regular location updates
          }
        : {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 5000,
            fastestInterval: 3000,
            timeout: 15000,
            maximumAge: 10000,
          };

    this.watchId = Geolocation.watchPosition(
      position => {
        console.log('[TripService] Location update:', position);
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
          speed: position.coords.speed || 0,
          accuracy: position.coords.accuracy,
        };

        store.dispatch(addLocation(location));
      },
      error => {
        console.error('[TripService] Foreground location error:', error);

        // FIXED: Handle iOS-specific errors
        if (Platform.OS === 'ios') {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              Alert.alert(
                'Location Permission Denied',
                'Please enable location access for this app in Settings.',
              );
              break;
            case 2: // POSITION_UNAVAILABLE
              console.warn(
                '[TripService] GPS signal unavailable, will retry...',
              );
              // Don't show alert for temporary GPS issues
              break;
            case 3: // TIMEOUT
              console.warn('[TripService] Location timeout, will retry...');
              break;
          }
        }
      },
      locationOptions,
    );
  }

  async performLocationUpdate() {
    // This runs in foreground/background (HeadlessTask handles kill state)
    console.log('[TripService] Performing location update');

    try {
      const location = await this.getCurrentLocation();
      if (location) {
        store.dispatch(addLocation(location));
      }
    } catch (error) {
      console.error('[TripService] Location update error:', error);
    }
  }

  getCurrentLocation() {
    return new Promise(resolve => {
      const options =
        Platform.OS === 'ios'
          ? {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 30000,
            }
          : {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 60000,
            };

      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            speed: position.coords.speed || 0,
            accuracy: position.coords.accuracy,
          });
        },
        error => {
          console.error('[TripService] getCurrentLocation error:', error);
          resolve(null);
        },
        options,
      );
    });
  }

  async stopLocationTracking() {
    try {
      // Stop foreground tracking
      if (this.watchId !== null) {
        Geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }

      // Stop BackgroundFetch
      const status = await BackgroundFetch.stop();
      console.log('[TripService] BackgroundFetch stop status:', status);

      await notifee.cancelNotification(this.notificationId);

      // Stop notification timer
      if (this.notificationIntervalId) {
        clearInterval(this.notificationIntervalId);
        this.notificationIntervalId = null;
      }

      store.dispatch(setTrackingStatus(false));

      console.log('[TripService] Location tracking stopped');
    } catch (error) {
      console.error('[TripService] Stop tracking error:', error);
    }
  }

  async showTrackingNotification() {
    try {
      await notifee.displayNotification({
        id: this.notificationId,
        title: 'Trip Active',
        body: 'Your trip is being tracked',
        android: {
          channelId: 'trip-tracking',
          importance: AndroidImportance.HIGH,
          ongoing: true,
          autoCancel: false,
          category: AndroidCategory.NAVIGATION,
          actions: [
            {
              title: 'End Trip',
              pressAction: {id: 'end-trip'},
            },
          ],
        },
        ios: {
          categoryId: 'trip-tracking',
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
          },
          actions: [
            {
              id: 'end-trip',
              title: 'End Trip',
            },
          ],
        },
      });
    } catch (error) {
      console.error('[TripService] Notification error:', error);
    }
  }

  async updateTrackingNotification() {
    try {
      const state = store.getState().trip;
      const duration = state?.startTime ? Date.now() - state?.startTime : 0;
      const hours = Math.floor(duration / 3600000);
      const minutes = Math.floor((duration % 3600000) / 60000);

      await notifee.displayNotification({
        id: this.notificationId,
        title: 'Trip Active',
        body: `Duration: ${hours}h ${minutes}m | Distance: ${state?.totalDistance.toFixed(
          2,
        )}km`,
        android: {
          channelId: 'trip-tracking',
          importance: AndroidImportance.HIGH,
          ongoing: true,
          autoCancel: false,
          category: AndroidCategory.NAVIGATION,
          actions: [
            {
              title: 'End Trip',
              pressAction: {id: 'end-trip'},
            },
          ],
        },
        ios: {
          categoryId: 'trip-tracking',
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
          },
          actions: [
            {
              id: 'end-trip',
              title: 'End Trip',
            },
          ],
        },
      });
    } catch (error) {
      console.error('[TripService] Update notification error:', error);
    }
  }

  async initializeNotifications() {
    try {
      await notifee.requestPermission();

      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'trip-tracking',
          name: 'Trip Tracking',
          description: 'Trip tracking notifications',
          importance: AndroidImportance.HIGH,
        });
      } else if (Platform.OS === 'ios') {
        // iOS notification categories
        await notifee.setNotificationCategories([
          {
            id: 'trip-tracking',
            actions: [
              {
                id: 'end-trip',
                title: 'End Trip',
                destructive: true,
              },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error('[TripService] Notification init error:', error);
    }
  }
}

export default new TripService();
