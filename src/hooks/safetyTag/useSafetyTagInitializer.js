import useDeviceConnection from './useDeviceConnection';
import useTrips from './useTrips';

const useSafetyTagInitializer = () => {
  const {
    getConnectedDeviceInfo,
    startDeviceScanning,
    deviceDetails,
    disconnectDevice,
    connectToSelectedDevice,
    clearOnGoingTrip,
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
    clearOnGoingTrip,
  };
};

export default useSafetyTagInitializer;
