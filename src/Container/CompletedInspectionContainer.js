import React from 'react';

import CompletedInspectionScreen from '../Screens/CompletedInspectionScreen';
import {ROUTES} from '../Navigation/ROUTES';
import {useNavigation} from '@react-navigation/native';

const CompletedInspectionContainer = () => {
  const navigation = useNavigation();
  // const [seconds, setSeconds] = useState(5);
  // useEffect(() => {
  //   if (seconds === 1) {
  //     navigation.replace(ROUTES.INSPECTION_SELECTION);
  //   } else {
  //     setInterval(() => {
  //       setSeconds(seconds - 1);
  //     }, 1000);
  //   }
  // }, [seconds]);
  const handleThankYouPress = () => navigation.replace(ROUTES.INTRO);
  return (
    <CompletedInspectionScreen
      navigation={navigation}
      handleThankYouPress={handleThankYouPress}
      // seconds={seconds}
    />
  );
};

export default CompletedInspectionContainer;
