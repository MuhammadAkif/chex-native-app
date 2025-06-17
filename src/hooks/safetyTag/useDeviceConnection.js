import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';

import useGeolocation from '../location/useGeoLocation';
import useSafetyTag from '../useSafetyTag';
import {Platforms} from '../../Constants';
import {devicesListOptimized} from '../../Utils/helpers';
import debounce from 'lodash/debounce';

const {OS} = Platform;
const {ANDROID, IOS} = Platforms;
const tripInitialState = {
  tripStart: {
    timestampElapsedRealtimeMs: null,
    timestampUnixMs: null,
    position: {
      coords: {
        speed: null,
        heading: null,
        altitude: null,
        accuracy: null,
        longitude: null,
        latitude: null,
      },
      extras: {
        meanCn0: null,
        maxCn0: null,
        satellites: null,
      },
      mocked: false,
      timestamp: null,
      locality: null,
      state: null,
      country: null,
    },
  },
  tripStatus: 'Not Started',
  tripEnd: {
    timestampElapsedRealtimeMs: null,
    timestampUnixMs: null,
    position: {
      coords: {
        speed: null,
        heading: null,
        altitude: null,
        accuracy: null,
        longitude: null,
        latitude: null,
      },
      extras: {
        meanCn0: null,
        maxCn0: null,
        satellites: null,
      },
      mocked: false,
      timestamp: null,
      locality: null,
      state: null,
      country: null,
    },
  },
};

const useDeviceConnection = (onEvents = {}) => {
  const {
    startScanning,
    getConnectedDevice,
    startDiscovery,
    readBatteryLevel,
    isDeviceConnected,
    clearDevice,
    connectToDevice,
  } = useSafetyTag({
    onDeviceFound: onDeviceDiscovered,
    onConnecting: onDeviceConnecting, //for android only
    onConnectionError: onDeviceConnectionFailed,
    onConnected: onDeviceConnected,
    onDeviceDisconnected: onDeviceDisconnected,
    onTripStart: onTripStart,
    onTripEnd: onTripEnd,
    onTripDataWithFraudSuccess: onTripDataWithFraudSuccess,
  });
  /*  const {startScan, getDeviceInformation, checkConnection} = useSafetyTagIOS({
    onDeviceDiscovered: onDeviceDiscovered,
    onDeviceConnectionFailed: onDeviceConnectionFailed,
    onDeviceConnected: onDeviceConnected,
    onDeviceDisconnected: onDeviceDisconnected,
    onGetConnectedDevice: onGetConnectedDevice,
    onCheckConnection: onCheckConnection,
  });*/
  const {getCurrentLocation, checkPermissionOnly} = useGeolocation();

  const [deviceDetails, setDeviceDetails] = useState({
    discoveredDevices: [],
    isConnecting: false,
    isConnected: false,
    isConnectionFailed: false,
    isScanning: false,
    connectedDevice: {},
    isLoading: false,
    trip: tripInitialState,
    trips: [],
  });

  useEffect(() => {
    (async () => {
      const isConnected = OS === ANDROID ? await isDeviceConnected() : null;
      // OS === ANDROID ? await isDeviceConnected() : await checkConnection();
      if (isConnected) {
        setDeviceDetails(prevState => ({...prevState, isConnected}));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (deviceDetails?.isConnected) {
        await getConnectedDeviceInfo();
      } else {
        await startDeviceScanning();
      }
    })();
  }, [deviceDetails?.isConnected]);

  function onDeviceDiscovered(devicesList) {
    const newDevice = devicesList.device;
    setDeviceDetails(prevState => ({
      ...prevState,
      discoveredDevices: devicesListOptimized(
        prevState?.discoveredDevices,
        newDevice,
      ),
      isScanning: true,
      isConnecting: false,
      isConnected: false,
      isConnectionFailed: false,
      connectedDevice: {},
      isLoading: false,
    }));
  }

  function onDeviceConnecting(event) {
    console.log('Device connecting:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: true,
      isLoading: true,
    }));
  }

  function onDeviceConnectionFailed(event) {
    console.log('Device connection failed:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: false,
      isConnectionFailed: true,
      isLoading: false,
    }));
  }

  async function onDeviceConnected(event) {
    console.log('Device connected:', event);
    const batteryHealth = await readBatteryHealth();
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: false,
      isConnected: true,
      isConnectionFailed: false,
      connectedDevice: {...event, batteryHealth: batteryHealth},
      isLoading: false,
    }));
    await getConnectedDeviceInfo();
  }

  function onDeviceDisconnected(event) {
    console.log('Device disconnected:', event);
    setDeviceDetails(prevState => ({
      ...prevState,
      isConnecting: false,
      isConnected: false,
      isConnectionFailed: false,
      connectedDevice: {},
      discoveredDevices: [],
      isScanning: true,
      isLoading: false,
    }));
  }
  const debounceTripStart = React.useMemo(
    () =>
      debounce(async tripStart => await handleTripLocation(tripStart), 1000),
    [],
  );
  const debounceTripEnd = React.useMemo(
    () =>
      debounce(async tripEnd => {
        checkPermissionOnly();
        await getCurrentLocation(position => {
          setDeviceDetails(prevState => ({
            ...prevState,
            trip: {
              ...prevState.tripStart,
              tripStatus: 'Completed',
              tripEnd: {
                ...tripEnd,
                position,
              },
            },
          }));
        });
      }, 1000),
    [],
  );
  async function onTripStart(event) {
    const tripStart = JSON.parse(event?.tripEventJson);
    if (
      deviceDetails?.trip?.tripStart?.timestampUnixMs ===
      tripStart?.timestampUnixMs
    ) {
      return;
    }
    await debounceTripStart(tripStart);
  }

  async function handleTripLocation(tripStart) {
    checkPermissionOnly();
    await getCurrentLocation(
      position => onGetCurrentLocationSuccess(position, tripStart),
      error => console.log('location getting error: ', error),
    );
  }

  async function onGetCurrentLocationSuccess(position, tripStart) {
    // const {data: geonames} = await getNearbyPopulatedPlace(
    //   position.coords.latitude,
    //   position.coords.longitude,
    // );
    // const {toponymName, adminName1, countryName} = geonames[0];
    setDeviceDetails(prevState => ({
      ...prevState,
      trip: {
        ...prevState.tripEnd,
        tripStart: {
          ...tripStart,
          position: {
            ...position,
            locality: null,
            state: null,
            country: null,
          },
        },
        tripStatus: 'In Progress',
      },
    }));
  }

  async function onTripEnd(event) {
    const tripEnd = JSON.parse(event?.tripEventJson);

    if (
      deviceDetails?.trip?.tripEnd?.timestampUnixMs === tripEnd?.timestampUnixMs
    ) {
      return;
    }
    await debounceTripEnd(tripEnd);
  }

  async function onTripDataWithFraudSuccess(event) {
    console.log('Trips: ', event);
    // setDeviceDetails(prevState => ({...prevState, trips: event}));
  }

  function onGetConnectedDevice(event) {
    console.log('Connected device info:', event);
    setDeviceDetails(prevState => ({...prevState, connectedDevice: event}));
  }

  function onCheckConnection({isConnected = false}) {
    console.log('Device Connection:', isConnected);
    if (isConnected) {
      setDeviceDetails(prevState => ({...prevState, isConnected}));
    }
  }

  async function startDeviceScanning() {
    setDeviceDetails(prevState => ({...prevState, isScanning: true}));
    if (OS === ANDROID) {
      await startDiscovery();
      // await startScanning();
    }
    if (OS === IOS) {
      //await startScan();
    }
  }

  async function disconnectDevice() {
    setDeviceDetails(prevState => ({...prevState, isScanning: true}));
    if (OS === ANDROID) {
      await clearDevice();
      // await startScanning();
    }
    if (OS === IOS) {
      //await startScan();
    }
  }

  async function getConnectedDeviceInfo() {
    if (OS === ANDROID) {
      const device = await getConnectedDevice();
      const batteryHealth = await readBatteryLevel();
      console.log('Connected device info:', device);
      setDeviceDetails({
        ...deviceDetails,
        discoveredDevices: [],
        isScanning: false,
        isConnecting: false,
        isConnected: true,
        connectedDevice: {...device, batteryHealth: batteryHealth},
      });
    }
    if (OS === IOS) {
      //await getDeviceInformation();
    }
  }

  async function readBatteryHealth() {
    if (OS === ANDROID) {
      return await readBatteryLevel();
    }
    if (OS === IOS) {
      // await getDeviceInformation();
    }
  }

  const connectToSelectedDevice = async device => {
    await connectToDevice(device);
  };

  const clearOnGoingTrip = () => {
    setDeviceDetails(prevState => ({...prevState, trip: tripInitialState}));
  };

  return {
    getConnectedDeviceInfo,
    startDeviceScanning,
    deviceDetails,
    disconnectDevice,
    connectToSelectedDevice,
    clearOnGoingTrip,
  };
};

export default useDeviceConnection;
