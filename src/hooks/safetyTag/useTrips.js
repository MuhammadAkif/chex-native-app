import {Platform} from 'react-native';

import useSafetyTag from '../useSafetyTag';
import useSafetyTagIOS from '../useSafetyTagIOS';
import {Platforms} from '../../Constants';

const {OS} = Platform;
const {ANDROID, IOS} = Platforms;

const useTrips = () => {
  const {queryTripData, queryTripWithFraudData} = useSafetyTag({
    onTripStart: onTripStart,
    onTripStartError: onTripStartError, //for android only
    onTripEnd: onTripEnd,
    onTripDataSuccess: onTripDataReceived,
    onTripDataError: onTripsDataError, //for android only
  });
  const {getTrips, getTripsWithFraudDetection} = useSafetyTagIOS({
    onTripStarted: onTripStart,
    onTripEnded: onTripEnd,
    onTripsReceived: onTripDataReceived,
  });

  function onTripStart(event) {
    console.log('Trip started:', event);
  }
  function onTripStartError(event) {
    console.log('Trip start error:', event);
  }
  function onTripEnd(event) {
    console.log('Trip ended:', event);
  }
  function onTripDataReceived(event) {
    console.log('Trips data received:', event);
  }
  function onTripsDataError(event) {
    console.log('Trips data error:', event);
  }

  async function getDeviceTrips() {
    if (OS === ANDROID) {
      await queryTripData();
    }
    if (OS === IOS) {
      await getTrips();
    }
  }
  async function getDeviceTripsWithFraudData() {
    if (OS === ANDROID) {
      await queryTripWithFraudData();
    }
    if (OS === IOS) {
      await getTripsWithFraudDetection();
    }
  }

  return {
    getDeviceTrips,
    getDeviceTripsWithFraudData,
  };
};

export default useTrips;
