import React, {useCallback} from 'react';

import {TripHistoryScreen} from '../Screens';
import {useDeviceState} from '../hooks/device';
import {useFocusEffect} from '@react-navigation/native';
import {useSafetyTagInitializer} from '../hooks';

const TripHistoryContainer = ({navigation}) => {
  const {tripsList} = useDeviceState();
  const {getDeviceTripsWithFraudData} = useSafetyTagInitializer();
  useFocusEffect(
    useCallback(() => {
      (async () => await getDeviceTripsWithFraudData())();
    }, []),
  );

  const onBackPress = () => navigation.goBack();

  return <TripHistoryScreen onBackPress={onBackPress} trips={tripsList} />;
};

export default TripHistoryContainer;
