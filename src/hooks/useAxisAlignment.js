import {useEffect, useState} from 'react';
import {Alert, DeviceEventEmitter, NativeModules} from 'react-native';

const {SafetyTagModule} = NativeModules;

/**
 * Hook for managing SafetyTag axis alignment functionality
 * @param {Object} onEvents - Callback functions for various events
 * @returns {Object} - Alignment state and utility functions
 */
export const useAxisAlignment = onEvents => {
  // ==========================================
  // State Management
  // ==========================================
  const [error, setError] = useState(null);

  // ==========================================
  // Event Listeners Setup
  // ==========================================
  useEffect(() => {
    // Register all event listeners
    const subscriptions = [
      // Alignment-specific events
      DeviceEventEmitter.addListener(
        'onAxisAlignmentState',
        onAxisAlignmentState,
      ),
      DeviceEventEmitter.addListener('onVehicleState', onVehicleState),
      DeviceEventEmitter.addListener(
        'onAxisAlignmentData',
        onAxisAlignmentData,
      ),
      DeviceEventEmitter.addListener(
        'onAxisAlignmentError',
        onAxisAlignmentError,
      ),
      DeviceEventEmitter.addListener(
        'onAxisAlignmentFinished',
        onAxisAlignmentFinished,
      ),
      DeviceEventEmitter.addListener(
        'onAxisAlignmentMissing',
        onAxisAlignmentMissing,
      ),
      DeviceEventEmitter.addListener(
        'onAxisAlignmentStatusCheck',
        onAxisAlignmentStatusCheck,
      ),
      DeviceEventEmitter.addListener(
        'onStoredAxisAlignmentCheck',
        onStoredAxisAlignmentCheck,
      ),

      // Accelerometer events
      DeviceEventEmitter.addListener(
        'onAccelerometerData',
        onAccelerometerData,
      ),
      DeviceEventEmitter.addListener(
        'onAccelerometerError',
        onAccelerometerError,
      ),
      DeviceEventEmitter.addListener(
        'onAccelerometerStreamStatus',
        onAccelerometerStreamStatus,
      ),
    ];

    // Cleanup function to remove all listeners
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  // ==========================================
  // Event Handlers - Alignment Events
  // ==========================================
  function onAxisAlignmentState(state) {
    if (onEvents && onEvents.onAxisAlignmentState) {
      onEvents.onAxisAlignmentState(state);
    }
  }

  function onVehicleState(state) {
    if (onEvents && onEvents.onVehicleState) {
      onEvents.onVehicleState(state);
    }
  }

  function onAxisAlignmentData(data) {
    console.log('Received alignment data:', data);
    /*setAlignmentData({
      ...data,
      matrices: {
        theta: data.matrices.theta,
        phi: data.matrices.phi,
      },
    });*/

    if (onEvents && onEvents.onAxisAlignmentData) {
      onEvents.onAxisAlignmentData(data);
    }
  }

  function onAxisAlignmentError(error) {
    console.log('onAxisAlignmentError: ', error);
    setError(error.error);
    Alert.alert('Alignment Error', error.error);

    if (onEvents && onEvents.onAxisAlignmentError) {
      onEvents.onAxisAlignmentError(error);
    }
  }

  function onAxisAlignmentFinished(result) {
    console.log('Axis Alignment Finished:', result);
    if (result.success) {
      Alert.alert('Success', 'Axis alignment completed successfully');
    } else {
      Alert.alert('Error', result.error || 'Alignment failed');
    }

    if (onEvents && onEvents.onAxisAlignmentFinished) {
      onEvents.onAxisAlignmentFinished(result);
    }
  }

  function onAxisAlignmentMissing() {
    Alert.alert(
      'Alignment Missing',
      'The axis alignment is missing. Would you like to start a new alignment?',
      [
        {
          text: 'Yes',
          onPress: startAlignment,
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
    );

    if (onEvents && onEvents.onAxisAlignmentMissing) {
      onEvents.onAxisAlignmentMissing();
    }
  }

  function onStoredAxisAlignmentCheck(event) {
    if (onEvents && onEvents.onStoredAxisAlignmentCheck) {
      onEvents.onStoredAxisAlignmentCheck(event);
    }
  }

  function onAxisAlignmentStatusCheck(event) {
    if (onEvents && onEvents.onAxisAlignmentStatusCheck) {
      onEvents.onAxisAlignmentStatusCheck(event);
    }
  }

  // ==========================================
  // Event Handlers - Accelerometer Events
  // ==========================================
  function onAccelerometerData(event) {
    console.log('Accelerometer Data:', event);

    if (onEvents && onEvents.onAccelerometerData) {
      onEvents.onAccelerometerData(event);
    }
  }

  function onAccelerometerError(event) {
    console.error('Accelerometer Error:', event.error);

    if (onEvents && onEvents.onAccelerometerError) {
      onEvents.onAccelerometerError(event);
    }
  }

  function onAccelerometerStreamStatus(event) {
    console.log('Accelerometer Stream Status:', event.isEnabled);

    if (onEvents && onEvents.onAccelerometerStreamStatus) {
      onEvents.onAccelerometerStreamStatus(event);
    }
  }

  // ==========================================
  // Utility Functions
  // ==========================================
  const startAlignment = async (resumeIfAvailable = false) => {
    try {
      setError(null);
      await SafetyTagModule.startIOSAxisAlignment(resumeIfAvailable);
    } catch (err) {
      setError(err.message);
    }
  };

  const stopAlignment = async () => {
    try {
      await SafetyTagModule.stopAxisAlignment();
    } catch (err) {
      setError(err.message);
    }
  };

  const checkAlignmentStatus = async () => {
    try {
      return await SafetyTagModule.checkAxisAlignmentStatus();
    } catch (err) {
      setError(err.message);
    }
  };

  const getAlignmentConfiguration = async () => {
    try {
      await SafetyTagModule.getAlignmentConfiguration();
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const checkStoredAlignment = async () => {
    try {
      SafetyTagModule.hasStoredAxisAlignment();
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const removeStoredAlignment = async () => {
    try {
      const hasStoredAxisAlignment = await checkStoredAlignment();
      if (hasStoredAxisAlignment) {
        await SafetyTagModule.removeStoredAxisAlignment();
        console.log(
          'Removed stored alignment - status: ',
          hasStoredAxisAlignment,
        );
      } else {
        console.log(
          "Doesn't have stored alignment - status: ",
          hasStoredAxisAlignment,
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // Return Values
  // ==========================================
  return {
    // State
    error,

    // Utility Functions
    startAlignment,
    stopAlignment,
    checkAlignmentStatus,
    checkStoredAlignment,
    removeStoredAlignment,
    getAlignmentConfiguration,
  };
};
