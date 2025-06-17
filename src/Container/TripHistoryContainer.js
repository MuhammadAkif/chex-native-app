import React, {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {TripHistoryScreen} from '../Screens';
import {useDeviceActions, useDeviceState} from '../hooks/device';
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
        try {
          const {data} = await getTripsList(userDeviceDetails?.device?.id);
          const filteredList = data.filter(
            list => list?.tripStatus === 'COMPLETED',
          );
          setTripsList(filteredList);
        } catch (error) {}
      })();
    }, []),
  );

  const onBackPress = () => navigation.goBack();

  return <TripHistoryScreen onBackPress={onBackPress} trips={tripsList} />;
};

export default TripHistoryContainer;
