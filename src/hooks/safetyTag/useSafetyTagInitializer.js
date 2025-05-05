import useDeviceConnection from './useDeviceConnection';
import useTrips from './useTrips';

const useSafetyTagInitializer = () => {
  const {
    getConnectedDeviceInfo,
    startDeviceScanning,
    deviceDetails,
    disconnectDevice,
  } = useDeviceConnection();
  const {getDeviceTrips, getDeviceTripsWithFraudData} = useTrips();

  return {
    deviceDetails,
    getConnectedDeviceInfo,
    startDeviceScanning,
    getDeviceTrips,
    getDeviceTripsWithFraudData,
    disconnectDevice,
  };
};

export default useSafetyTagInitializer;
