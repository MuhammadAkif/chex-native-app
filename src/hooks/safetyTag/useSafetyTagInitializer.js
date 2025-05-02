import useDeviceConnection from './useDeviceConnection';
import useTrips from './useTrips';

const useSafetyTagInitializer = () => {
  const {getConnectedDeviceInfo, startDeviceScanning} = useDeviceConnection();
  const {getDeviceTrips, getDeviceTripsWithFraudData} = useTrips();

  return {
    getConnectedDeviceInfo,
    startDeviceScanning,
    getDeviceTrips,
    getDeviceTripsWithFraudData,
  };
};

export default useSafetyTagInitializer;
