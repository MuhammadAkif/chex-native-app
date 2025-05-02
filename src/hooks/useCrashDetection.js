import {useEffect} from 'react';
import {DeviceEventEmitter, NativeModules} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCrashEvent,
  addThresholdEvent,
  updateCrashConfig,
} from '../Store/Actions';

const {SafetyTagModule} = NativeModules;

const useCrashDetection = () => {
  const dispatch = useDispatch();
  const {crashEvents, thresholdEvents, config} = useSelector(
    state => state.crashDetection,
  );

  useEffect(() => {
    console.log('Initializing crash detection');
    // Set up crash detection event listeners
    const crashDataSubscription = DeviceEventEmitter.addListener(
      'onCrashDataReceived',
      onCrashDataReceived,
    );

    const crashThresholdSubscription = DeviceEventEmitter.addListener(
      'onCrashThresholdEvent',
      onCrashThresholdEvent,
    );

    return () => {
      crashDataSubscription.remove();
      crashThresholdSubscription.remove();
    };
  }, []);

  function onCrashDataReceived(event) {
    console.log('crash-data', event);
    try {
      const crashData = JSON.parse(event.crashData);
      dispatch(addCrashEvent(crashData));
    } catch (error) {
      console.error('Error parsing crash data:', error);
    }
  }

  function onCrashThresholdEvent(event) {
    console.log('crash-event', event);
    try {
      const thresholdEvent = JSON.parse(event.crashThresholdEvent);
      dispatch(addThresholdEvent(thresholdEvent));
    } catch (error) {
      console.error('Error parsing threshold event:', error);
    }
  }
  const configureCrash = async ({
    averagingWindowSize = 5,
    thresholdXy = 500,
    thresholdXyz = 1300,
    surpassingThresholds = 2,
  } = {}) => {
    try {
      // Configure crash detection parameters
      await SafetyTagModule.setCrashAveragingWindowSize(averagingWindowSize);
      await SafetyTagModule.setCrashThresholdXyNormalized(thresholdXy);
      await SafetyTagModule.setCrashThresholdXyzNormalized(thresholdXyz);
      await SafetyTagModule.setCrashNumberOfSurpassingThresholds(
        surpassingThresholds,
      );

      // Update configuration in Redux store
      dispatch(
        updateCrashConfig({
          averagingWindowSize,
          thresholdXy,
          thresholdXyz,
          surpassingThresholds,
        }),
      );

      console.log('Crash configuration updated successfully');
    } catch (error) {
      console.error('Failed to configure crash settings:', error);
      throw error;
    }
  };

  const getLatestCrashEvent = () => {
    return crashEvents[0] || null;
  };

  const getLatestThresholdEvent = () => {
    return thresholdEvents[0] || null;
  };

  const getCurrentConfig = () => {
    return config;
  };

  return {
    // State
    crashEvents,
    thresholdEvents,
    config,

    // Methods
    configureCrash,
    getLatestCrashEvent,
    getLatestThresholdEvent,
    getCurrentConfig,
  };
};

export default useCrashDetection;
