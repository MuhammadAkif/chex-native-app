import {useEffect, useState} from 'react';
import {NativeModules, DeviceEventEmitter} from 'react-native';

const {SafetyTagModule} = NativeModules;

const useAxisAlignment = () => {
  const [alignmentState, setAlignmentState] = useState(null);
  const [alignmentData, setAlignmentData] = useState(null);
  const [isAligning, setIsAligning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const subscriptions = [
      DeviceEventEmitter.addListener('onAxisAlignmentState', event => {
        console.log('Axis Alignment State:', event);
        if (event.error) {
          setError(event.error);
          setIsAligning(false);
        } else {
          setError(null);
          setAlignmentState({
            status: event.status,
            phase: event.phase,
            details: event.details,
          });
          
          // Update isAligning based on the phase
          const nonAligningPhases = ['inactive', 'complete', 'failed', 'cancelled'];
          setIsAligning(!nonAligningPhases.includes(event.phase));
        }
      }),
      DeviceEventEmitter.addListener('onAxisAlignmentData', event => {
        console.log('Axis Alignment Data:', event);
        if (event.error) {
          setError(event.error);
        } else {
          setError(null);
          setAlignmentData({
            theta: event.theta,
            phi: event.phi,
            timestamp: event.timestamp,
            details: event.details,
          });
        }
      }),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  const startAxisAlignment = (resumeIfAvailable = false) => {
    try {
      setError(null);
      setAlignmentState(null);
      setAlignmentData(null);
      SafetyTagModule.startAxisAlignment(resumeIfAvailable);
    } catch (error) {
      console.error('Error starting axis alignment:', error);
      setError(error.message);
      setIsAligning(false);
    }
  };

  const stopAxisAlignment = () => {
    try {
      setError(null);
      SafetyTagModule.stopAxisAlignment();
    } catch (error) {
      console.error('Error stopping axis alignment:', error);
      setError(error.message);
    }
  };

  return {
    alignmentState,
    alignmentData,
    isAligning,
    error,
    startAxisAlignment,
    stopAxisAlignment,
  };
};

export default useAxisAlignment;
