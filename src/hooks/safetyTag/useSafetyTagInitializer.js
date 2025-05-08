import useDeviceConnection from './useDeviceConnection';
import useTrips from './useTrips';

const useSafetyTagInitializer = () => {
  const {
    getConnectedDeviceInfo,
    startDeviceScanning,
    deviceDetails,
    disconnectDevice,
    connectToSelectedDevice,
  } = useDeviceConnection();
  const {getDeviceTrips, getDeviceTripsWithFraudData} = useTrips();

  return {
    deviceDetails,
    getConnectedDeviceInfo,
    startDeviceScanning,
    getDeviceTrips,
    getDeviceTripsWithFraudData,
    disconnectDevice,
    connectToSelectedDevice,
  };
};

export default useSafetyTagInitializer;
