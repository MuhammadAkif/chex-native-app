import React, {useCallback} from 'react';

import {TripHistoryScreen} from '../Screens';
import {useDeviceActions, useDeviceState} from '../hooks/device';
import {useFocusEffect} from '@react-navigation/native';
import {getTripsList} from '../services/device';

const TripHistoryContainer = ({navigation}) => {
  const {tripsList, userDeviceDetails} = useDeviceState();
  const {setTripsList} = useDeviceActions();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        /**
         * TODO: Consider capturing API errors in a central error handler.
         * get the trip list from the device and send to backend and then retrieve list from backend to store in store of mobile device
         */
        const {data} = await getTripsList(userDeviceDetails?.device?.id);
        const filteredList = data.filter(
          list => list?.tripStatus === 'COMPLETED',
        );
        setTripsList(filteredList);
      })();
    }, []),
  );

  const onBackPress = () => navigation.goBack();

  return <TripHistoryScreen onBackPress={onBackPress} trips={tripsList} />;
};

export default TripHistoryContainer;
