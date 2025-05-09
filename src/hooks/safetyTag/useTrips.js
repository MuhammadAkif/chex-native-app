import {useState} from 'react';
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
    onTripDataWithFraudSuccess: onTripDataReceived,
    onTripDataError: onTripsDataError, //for android only
  });
  const {getTrips, getTripsWithFraudDetection} = useSafetyTagIOS({
    onTripStarted: onTripStart,
    onTripEnded: onTripEnd,
    onTripsReceived: onTripDataReceived,
  });
  const [deviceTrips, setDeviceTrips] = useState([]);

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
    setDeviceTrips(event);
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
      try {
        await queryTripWithFraudData();
      } catch (error) {
        setDeviceTrips({list: []});
      }
    }
    if (OS === IOS) {
      await getTripsWithFraudDetection();
    }
  }

  return {
    deviceTrips,
    getDeviceTrips,
    getDeviceTripsWithFraudData,
  };
};

export default useTrips;
