import {useEffect} from 'react';

import {useSafetyTagInitializer} from '../../hooks';
import {useUIActions} from '../../hooks/UI';
import {useDeviceActions, useDeviceState} from '../../hooks/device';

const DeviceConnectionMonitor = () => {
  const {toggleLoading} = useUIActions();
  const {
    setDevice,
    clearDevice,
    setDeviceTrip,
    setTripsList,
    clearTrip,
    setNewTrip,
  } = useDeviceActions();
  const {deviceAddress: storeDeviceAddress, trip: storeDeviceTrip} =
    useDeviceState();
  const {deviceDetails, clearOnGoingTrip} = useSafetyTagInitializer();
  /*const {deviceTrips} = useTrips();*/
  const {
    isLoading: isDeviceLoading = false,
    isConnected = false,
    connectedDevice = {},
    trip,
  } = deviceDetails;

  useEffect(() => {
    if (trip?.tripStatus === 'Completed') {
      const completedTrip = {
        ...storeDeviceTrip,
        tripStatus: 'Completed',
        tripEnd: trip?.tripEnd,
      };

      setDeviceTrip(completedTrip);
    }
  }, [trip?.tripStatus]);

  useEffect(() => {
    if (storeDeviceTrip?.tripStatus === 'Completed') {
      // (async () => await handleEndTrip())();
      /**
       * TODO: Commented setNewTrip because it is inserting trip in store - required test cycles
       */
      //setNewTrip(storeDeviceTrip);
      clearTrip();
      clearOnGoingTrip();
    }
    // if (storeDeviceTrip?.tripStatus === 'In Progress') {
    //   (async () => await handleStartTrip())();
    // }
  }, [storeDeviceTrip?.tripStatus]);

  useEffect(() => {
    toggleLoading(isDeviceLoading);
  }, [isDeviceLoading, toggleLoading]);

  useEffect(() => {
    if (!isConnected || connectedDevice?.deviceAddress === storeDeviceAddress) {
      return;
    }

    const deviceInfo = setDeviceParams();
    setDevice(deviceInfo);
  }, [connectedDevice, setDevice]);

  useEffect(() => {
    if (!isConnected) {
      clearDevice();
    }
  }, [isConnected, clearDevice]);

  /*useEffect(() => {
    if (deviceTrips?.message) {
      try {
        const trips = deviceTrips?.message
          ?.trim()
          .split('\n')
          .map(line => {
            const match = line.match(
              /Trip\(receiveNumber=(\d+), startUnixTimeMs=(\d+), startElapsedRealtimeMs=(-?\d+), endUnixTimeMs=(\d+), endElapsedRealtimeMs=(-?\d+), connectedDuringTrip=(true|false)\)/,
            );
            if (match) {
              return {
                receiveNumber: parseInt(match[1]),
                startUnixTimeMs: parseInt(match[2]),
                startElapsedRealtimeMs: parseInt(match[3]),
                endUnixTimeMs: parseInt(match[4]),
                endElapsedRealtimeMs: parseInt(match[5]),
                connectedDuringTrip: match[6] === 'true',
                commentInfo: {
                  comment: '',
                  time: null,
                },
                position: {
                  coords: {
                    speed: null,
                    heading: null,
                    longitude: null,
                    latitude: null,
                  },
                },
              };
            }
            return null;
          })
          .filter(Boolean);

        //(async () => await setDeviceTrips(trips))();
        setTripsList(trips);
      } catch (error) {}
    }
  }, [deviceTrips]);*/

  useEffect(() => {
    setTripParams();
  }, [trip]);

  function setDeviceParams() {
    const {
      connectedDevice: {
        deviceAddress = null,
        address = null,
        batteryHealth = null,
      },
    } = deviceDetails;
    return {
      ...connectedDevice,
      deviceAddress: deviceAddress || address,
      isConnected: isConnected,
      batteryHealth: batteryHealth,
    };
  }

  function setTripParams() {
    if (trip?.tripStatus === 'In Progress') {
      setDeviceTrip(trip);
    }
  }
  /*
  async function handleStartTrip() {
    const {
      tripStart: {
        position: {
          coords: {latitude: oldLat = null, longitude: oldLong = null} = {},
        },
        timestampUnixMs,
      },
    } = storeDeviceTrip || {};
    if (!isNotEmpty(timestampUnixMs) && !isDeviceConnected) {
      return;
    }
    getCurrentLocation(async position => {
      const {
        coords: {latitude: newLat, longitude: newLon},
      } = position || {};

      let distance = getDistanceFromLatLonInKm(oldLat, oldLong, newLat, newLon);
      distance = distance.toFixed(2);
      let speed = withDefault(convertSpeedToKmh(speed), '-');
      const duration_ = withDefault(getElapsedTime(timestampUnixMs), '-');
      const startTime = withDefault(
        formatUnixTimestampIntoDate(timestampUnixMs),
        '-',
      );
      const format = duration_.split(' ');
      const duration = Number(format[0]);
      const startPoint = {lng: oldLat, lat: oldLong, title: '', address: ''};
      const {data} = await setStartTrip(
        duration,
        Number(distance),
        userDeviceDetails?.device?.id,
        speed,
        startTime,
        startPoint,
      );
      setUserStartTripDetails(data);
    });
  }

  async function handleEndTrip() {
    const {
      tripEnd: {
        position: {
          coords: {latitude: oldLat = null, longitude: oldLong = null} = {},
        },
        timestampUnixMs,
      },
    } = storeDeviceTrip || {};
    if (!isNotEmpty(timestampUnixMs) && !isDeviceConnected) {
      return;
    }
    getCurrentLocation(async position => {
      const {
        coords: {latitude: newLat, longitude: newLon},
      } = position || {};

      let distance = getDistanceFromLatLonInKm(
        storeDeviceTrip?.tripStart?.position?.coords?.latitude,
        storeDeviceTrip?.tripStart?.position?.coords?.longitude,
        storeDeviceTrip?.tripEnd?.position?.coords?.latitude,
        storeDeviceTrip?.tripEnd?.position?.coords?.longitude,
      );
      distance = distance.toFixed(2);
      const duration_ = withDefault(getElapsedTime(timestampUnixMs), '-');

      const format = duration_.split(' ');
      const duration = Number(format[0]);
      const endTime = formatUnixTimestampIntoDate(timestampUnixMs);
      const endPoint = {
        lat: storeDeviceTrip?.tripEnd?.position?.coords?.latitude,
        lng: storeDeviceTrip?.tripEnd?.position?.coords?.longitude,
        title: '',
        address: '',
      };
      const body = {
        tripId: userStartTripDetails?.id,
        duration,
        distance,
        speed: null,
        completeStatus: true,
        endTime: formatUnixTimestampIntoDate(timestampUnixMs),
        endPoint: {
          lat: storeDeviceTrip?.tripEnd?.position?.coords?.latitude,
          lng: storeDeviceTrip?.tripEnd?.position?.coords?.longitude,
          title: '',
          address: '',
        },
      };
      const {data} = await updateTrip(
        userStartTripDetails?.id,
        duration,
        Number(distance),
        null,
        true,
        endTime,
        endPoint,
      );
    });
  }*/

  return null;
};

export default DeviceConnectionMonitor;
