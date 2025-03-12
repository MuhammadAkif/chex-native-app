import {useEffect, useCallback} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  AppState,
  DeviceEventEmitter,
} from 'react-native';
import {backGroundTask} from '../services/safetyTag';

const {SafetyTagModule} = NativeModules;
// const eventEmitter = new NativeEventEmitter(SafetyTagModule);

export const useSafetyTagBeacon = (onEvents = {}) => {
  const onRegionEntered = useCallback(
    event => {
      console.log('🟢 Device entered region:', event);
      console.log('   - Device ID:', event.deviceId);
      console.log('   - Device Name:', event.connectedDeviceName);
      console.log('   - State:', event.isBackground ? 'background' : 'active');
      console.log(
        '   - Timestamp:',
        new Date(event.timestamp * 1000).toISOString(),
      );

      // Handle background wake up
      if (event.isBackground) {
        handleBackgroundWakeUp().then();
      }

      onEvents.onRegionEntered?.(event);
    },
    [onEvents.onRegionEntered],
  );

  const onRegionExited = useCallback(
    event => {
      console.log('🔴 Device exited region:', event);
      console.log('   - Device ID:', event.deviceId);
      console.log('   - Device Name:', event.connectedDeviceName);
      console.log('   - State:', event.isBackground ? 'background' : 'active');
      console.log(
        '   - Timestamp:',
        new Date(event.timestamp * 1000).toISOString(),
      );

      // Handle background wake up
      if (event.isBackground) {
        handleBackgroundWakeUp();
      }

      onEvents.onRegionExited?.(event);
    },
    [onEvents.onRegionExited],
  );

  const onRegionStateChanged = useCallback(
    event => {
      console.log('🔄 Region state changed:', event);
      console.log('   - Device ID:', event.deviceId);
      console.log('   - Device Name:', event.deviceName);
      console.log('   - State:', event.state);
      onEvents.onRegionStateChanged?.(event);
    },
    [onEvents.onRegionStateChanged],
  );

  const handleBackgroundWakeUp = async () => {
    try {
      const result = await SafetyTagModule.handleBackgroundWakeUp();
      console.log('🌟 Background wake up handled:', result);
      console.log('   - App State:', result.state);
      console.log('   - Is Connected:', result.isConnected);
      console.log(
        '   - Timestamp:',
        new Date(result.timestamp * 1000).toISOString(),
      );

      // You can perform any background tasks here
      if (result.isConnected) {
        // For example, fetch updated device info
        await SafetyTagModule.getConnectedDevice();
      }

      onEvents.onBackgroundWakeUp?.(result);
    } catch (error) {
      console.error('❌ Background wake up failed:', error);
    }
  };

  useEffect(() => {
    console.log('📱 Setting up SafetyTag beacon listeners...');
    const subscriptions = [
      DeviceEventEmitter.addListener('onRegionEntered', onRegionEntered),
      DeviceEventEmitter.addListener('onRegionExited', onRegionExited),
      DeviceEventEmitter.addListener(
        'onRegionStateChanged',
        onRegionStateChanged,
      ),
    ];

    return () => {
      console.log('🧹 Cleaning up SafetyTag beacon listeners...');
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, [onRegionEntered, onRegionExited, onRegionStateChanged]);

  const startMonitoring = async device => {
    try {
      console.log('🔍 Starting monitoring for device:', {
        id: device.id,
        name: device.name,
        iBeaconUUID: device.iBeaconUUID,
      });
      await SafetyTagModule.startMonitoringDevice(
        device.id,
        device.name,
        device.iBeaconUUID,
      );
      console.log('✅ Successfully started monitoring device');
    } catch (error) {
      console.error('❌ Failed to start monitoring:', error);
    }
  };

  const stopMonitoring = async device => {
    try {
      console.log('⏹️ Stopping monitoring for device:', {
        id: device.id,
        name: device.name,
        iBeaconUUID: device.iBeaconUUID,
      });
      await SafetyTagModule.stopMonitoringDevice(
        device.id,
        device.name,
        device.iBeaconUUID,
      );
      console.log('✅ Successfully stopped monitoring device');
    } catch (error) {
      console.error('❌ Failed to stop monitoring:', error);
    }
  };

  const isBeingMonitored = async device => {
    try {
      const isMonitored = await SafetyTagModule.isDeviceBeingMonitored(
        device.id,
        device.name,
        device.iBeaconUUID,
      );
      console.log('🔍 Device monitoring status:', {
        id: device.id,
        name: device.name,
        isMonitored,
      });
      return isMonitored;
    } catch (error) {
      console.error('❌ Failed to check monitoring status:', error);
      return false;
    }
  };

  const enableAutoConnect = async device => {
    try {
      console.log('🔌 Enabling auto-connect for device:', {
        id: device.id,
        name: device.name,
        iBeaconUUID: device.iBeaconUUID,
      });
      await SafetyTagModule.enableAutoConnect(
        device.id,
        device.name,
        device.iBeaconUUID,
      );
      console.log('✅ Successfully enabled auto-connect');
    } catch (error) {
      console.error('❌ Failed to enable auto-connect:', error);
    }
  };

  const disableAutoConnect = async device => {
    try {
      console.log('🔌 Disabling auto-connect for device:', {
        id: device.id,
        name: device.name,
        iBeaconUUID: device.iBeaconUUID,
      });
      await SafetyTagModule.disableAutoConnect(
        device.id,
        device.name,
        device.iBeaconUUID,
      );
      console.log('✅ Successfully disabled auto-connect');
    } catch (error) {
      console.error('❌ Failed to disable auto-connect:', error);
    }
  };

  const isAutoConnectEnabled = async device => {
    try {
      const isEnabled = await SafetyTagModule.isAutoConnectEnabled(
        device.id,
        device.name,
        device.iBeaconUUID,
      );
      console.log('🔍 Device auto-connect status:', {
        id: device.id,
        name: device.name,
        isEnabled,
      });
      return isEnabled;
    } catch (error) {
      console.error('❌ Failed to check auto-connect status:', error);
      return false;
    }
  };

  const startSignificantLocationChanges = () => {
    console.log('📍 Starting significant location changes monitoring...');
    SafetyTagModule.startMonitoringSignificantLocationChanges();
  };

  const stopSignificantLocationChanges = () => {
    console.log('⏹️ Stopping significant location changes monitoring...');
    SafetyTagModule.stopMonitoringSignificantLocationChanges();
  };

  return {
    startMonitoring,
    stopMonitoring,
    isBeingMonitored,
    enableAutoConnect,
    disableAutoConnect,
    isAutoConnectEnabled,
    startSignificantLocationChanges,
    stopSignificantLocationChanges,
    handleBackgroundWakeUp,
  };
};
