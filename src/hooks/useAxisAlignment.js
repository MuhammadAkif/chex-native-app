import {useEffect, useRef, useState} from 'react';
import {Alert, DeviceEventEmitter, NativeModules} from 'react-native';

const {SafetyTagModule} = NativeModules;
// const eventEmitter = new NativeEventEmitter(SafetyTagModule);

export const useAxisAlignment = () => {
  const alignmentStatusRef = useRef(null);
  const [alignmentState, setAlignmentState] = useState(null);
  const [vehicleState, setVehicleState] = useState(null);
  const [alignmentData, setAlignmentData] = useState(null);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [alignmentDetails, setAlignmentDetails] = useState({
    angles: {
      current: null,
      previous: null,
    },
    bootstrap: {
      completed: 0,
      total: 0,
      sampleSize: 0,
    },
    validation: {
      confidenceLevel: 0,
      flipAngleCounter: 0,
      validatedDataCounter: 0,
      isFlipped: false,
    },
    theta: {
      previous: null,
      new: null,
      rotationAxis: null,
    },
    phase: null,
    zAxisState: null,
    xAxisState: null,
    validVehicleState: false,
    isRetrying: false,
  });

  useEffect(() => {
    const subscriptions = [
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
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  function onAxisAlignmentState(state) {
    setAlignmentState(state);
    /*    console.log('Received alignment state:', state);
    const {
      angles: {current, previous},
      overallIterationCount,
      bootstrapOverallIterations,
      currentBootstrapBufferSize,
      directionValidation: {
        confidenceLevel,
        flipAngleCounter,
        validatedDataCounter,
        isFlipped,
      },
      theta,
      phase,
      zAxisState,
      xAxisState,
      validVehicleState,
      isRetrying,
    } = state;
    setAlignmentState(state);

    // Update detailed state information
    setAlignmentDetails({
      angles: {
        current: current,
        previous: previous,
      },
      bootstrap: {
        completed: overallIterationCount,
        total: bootstrapOverallIterations,
        sampleSize: currentBootstrapBufferSize,
      },
      validation: {
        confidenceLevel: confidenceLevel,
        flipAngleCounter: flipAngleCounter,
        validatedDataCounter: validatedDataCounter,
        isFlipped: isFlipped,
      },
      theta: {
        previous: theta.previous,
        new: theta.new,
        rotationAxis: theta.rotationAxis,
      },
      phase: phase,
      zAxisState: zAxisState,
      xAxisState: xAxisState,
      validVehicleState: validVehicleState,
      isRetrying: isRetrying,
    });*/
  }

  function onVehicleState(state) {
    console.log('Received vehicle state:', state);
    setVehicleState(state);
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
  }

  function onAxisAlignmentError(error) {
    console.log('onAxisAlignmentError: ', error);
    setError(error.error);
    Alert.alert('Alignment Error', error.error);
  }

  function onAxisAlignmentFinished(result) {
    console.log('Axis Alignment Finished:', result);
    if (result.success) {
      Alert.alert('Success', 'Axis alignment completed successfully');
    } else {
      Alert.alert('Error', result.error || 'Alignment failed');
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
  }

  function onStoredAxisAlignmentCheck(event) {}

  function onAxisAlignmentStatusCheck(event) {
    alignmentStatusRef.current = {
      hasStarted: event?.hasStarted || false,
      error: event?.error || null,
    };
  }

  const startAlignment = async (resumeIfAvailable = false) => {
    try {
      setError(null);
      setIsComplete(false);
      await SafetyTagModule.startAxisAlignment(resumeIfAvailable);
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

  return {
    alignmentStatusRef,
    alignmentState,
    alignmentDetails,
    vehicleState,
    alignmentData,
    error,
    isComplete,
    startAlignment,
    stopAlignment,
    checkAlignmentStatus,
    checkStoredAlignment,
    removeStoredAlignment,
    getAlignmentConfiguration,
  };
};
