import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert, BackHandler, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {InspectionSelectionScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {ANDROID, HARDWARE_BACK_PRESS} from '../Constants';
import {colors} from '../Assets/Styles';
import {handleNewInspectionPress} from '../Utils';

const InspectionSelectionContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token, data} = useSelector(state => state?.auth);
  const [isLoading, setIsLoading] = useState(false);
  const selectedText = isLoading ? (
    <ActivityIndicator size={'small'} color={colors.white} />
  ) : (
    '+ New Inspection'
  );

  function resetAllStates() {
    setIsLoading(false);
  }
  const handle_Hardware_Back_Press = () => {
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
        handle_Hardware_Back_Press,
      );
      return () => backHandler.remove();
    }, []),
  );

  const onNewInspectionPress = async () => {
    await handleNewInspectionPress(
      dispatch,
      setIsLoading,
      data?.companyId,
      token,
      navigation,
      resetAllStates,
    );
  };
  // navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION);
  const handleInspectionInProgressPress = () =>
    navigation.navigate(ROUTES.INSPECTION_IN_PROGRESS);
  const handleInspectionReviewedPress = () =>
    navigation.navigate(ROUTES.INSPECTION_REVIEWED);

  return (
    <InspectionSelectionScreen
      handleNewInspectionPress={onNewInspectionPress}
      handleInspectionInProgressPress={handleInspectionInProgressPress}
      handleInspectionReviewedPress={handleInspectionReviewedPress}
      selectedText={selectedText}
      isLoading={isLoading}
    />
  );
};

export default InspectionSelectionContainer;
