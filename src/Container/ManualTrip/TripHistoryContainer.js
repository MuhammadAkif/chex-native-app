import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TripHistoryScreen from '../../Screens/ManualTrip/TripHistoryScreen';
import { clearTrip } from '../../Store/Actions/TripAction';

const TripHistoryContainer = ({navigation}) => {
  const trips = useSelector(state => state.trip?.trips) || [];
  const dispatch = useDispatch()
  
  const handleClearHistory = () => {
    dispatch(clearTrip())  
  }
  
  return <TripHistoryScreen trips={trips.reverse()} navigation={navigation} onPressClear={handleClearHistory} />;
};

export default TripHistoryContainer;