import {useState} from 'react';

const PREREQUISITES = {
  BLUETOOTH: {
    title: 'Bluetooth',
    description: 'Enable Bluetooth on your device',
    isRequired: true,
  },
  LOCATION: {
    title: 'Location Services',
    description: 'Enable Location Services for device scanning',
    isRequired: true,
  },
  PERMISSIONS: {
    title: 'App Permissions',
    description: 'Grant necessary permissions (Location, Bluetooth)',
    isRequired: true,
  },
};

const CONNECTION_STEPS = [
  {
    id: 1,
    title: 'Prepare Device',
    description: 'Ensure your Safety Tag device is powered on and within range',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Start Scanning',
    description: 'Press "Start Scan" to search for nearby Safety Tag devices',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Select Device',
    description: 'Select your device from the list of discovered devices',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Establish Connection',
    description: 'Wait for the connection to be established',
    status: 'pending',
  },
];

const ALIGNMENT_STEPS = [
  {
    id: 1,
    title: 'Device Placement',
    description: 'Place the device in your vehicle in a fixed position',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Start Alignment',
    description: 'Begin the axis alignment process',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Drive Straight',
    description: 'Drive in a straight line at a steady speed (4-60 km/h)',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Complete Alignment',
    description: 'Continue driving until alignment is complete',
    status: 'pending',
  },
];

const TROUBLESHOOTING_TIPS = [
  {
    id: 1,
    issue: 'Device Not Found',
    solutions: [
      'Ensure device is powered on',
      'Check if device is within range',
      'Verify Bluetooth is enabled',
      'Try restarting the device',
    ],
  },
  {
    id: 2,
    issue: 'Connection Failed',
    solutions: [
      'Ensure all permissions are granted',
      'Check if device is already connected to another phone',
      'Try restarting the app',
      'Move closer to the device',
    ],
  },
  {
    id: 3,
    issue: 'Alignment Issues',
    solutions: [
      'Ensure device is firmly mounted',
      'Drive at recommended speed (4-60 km/h)',
      'Drive in a straight line',
      'Avoid sudden movements or stops',
    ],
  },
];

const useDeviceInstructions = () => {
  const [connectionProgress, setConnectionProgress] =
    useState(CONNECTION_STEPS);
  const [alignmentProgress, setAlignmentProgress] = useState(ALIGNMENT_STEPS);

  const updateConnectionStep = (stepId, newStatus) => {
    setConnectionProgress(prev =>
      prev.map(step =>
        step.id === stepId ? {...step, status: newStatus} : step,
      ),
    );
  };

  const updateAlignmentStep = (stepId, newStatus) => {
    setAlignmentProgress(prev =>
      prev.map(step =>
        step.id === stepId ? {...step, status: newStatus} : step,
      ),
    );
  };

  const resetProgress = () => {
    setConnectionProgress(CONNECTION_STEPS);
    setAlignmentProgress(ALIGNMENT_STEPS);
  };

  const getPrerequisites = () => PREREQUISITES;
  const getConnectionSteps = () => connectionProgress;
  const getAlignmentSteps = () => alignmentProgress;
  const getTroubleshootingTips = () => TROUBLESHOOTING_TIPS;

  return {
    prerequisites: PREREQUISITES,
    connectionSteps: connectionProgress,
    alignmentSteps: alignmentProgress,
    troubleshootingTips: TROUBLESHOOTING_TIPS,
    updateConnectionStep,
    updateAlignmentStep,
    resetProgress,
    getPrerequisites,
    getConnectionSteps,
    getAlignmentSteps,
    getTroubleshootingTips,
  };
};

export default useDeviceInstructions;
