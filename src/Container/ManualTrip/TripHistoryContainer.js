import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TripHistoryScreen from '../../Screens/ManualTrip/TripHistoryScreen';
import { fetchUserTripsAsync } from '../../Store/Actions/TripAction';
import { LoadingIndicator } from '../../Components';

const TripHistoryContainer = ({ navigation }) => {
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const completedTrips = trips?.filter?.(t => t.status == 'COMPLETED') || []

  useEffect(() => {
    dispatch(fetchUserTripsAsync(setTrips, setIsLoading));
  }, [dispatch]);
  
  if (isLoading) return <LoadingIndicator isLoading={isLoading} />
  return <TripHistoryScreen trips={completedTrips} navigation={navigation} onPullToRefresh={() => dispatch(fetchUserTripsAsync(setTrips, () => {}))} />;
};

export default TripHistoryContainer;