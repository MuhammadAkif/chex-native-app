import React, {useCallback} from 'react';
import {Alert, BackHandler, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {InspectionSelectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {ANDROID, HARDWARE_BACK_PRESS} from '../Constants';

const InspectionSelectionContainer = ({navigation}) => {
  const exitApp = () => {
    if (Platform.OS === ANDROID) {
      Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    }
  };
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        HARDWARE_BACK_PRESS,
        exitApp,
      );
      return () => backHandler.remove();
    }, []),
  );
  const handleNewInspectionPress = () =>
    navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION);
  const handleInspectionInProgressPress = () =>
    navigation.navigate(ROUTES.INSPECTION_IN_PROGRESS);
  const handleInspectionReviewedPress = () =>
    navigation.navigate(ROUTES.INSPECTION_REVIEWED);

  return (
    <InspectionSelectionScreen
      handleNewInspectionPress={handleNewInspectionPress}
      handleInspectionInProgressPress={handleInspectionInProgressPress}
      handleInspectionReviewedPress={handleInspectionReviewedPress}
    />
  );
};

export default InspectionSelectionContainer;
