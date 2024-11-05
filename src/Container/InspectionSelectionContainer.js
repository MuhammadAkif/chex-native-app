import React, {useCallback, useState} from 'react';
import {Alert, BackHandler, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {InspectionSelectionScreen} from '../Screens';
import {HARDWARE_BACK_PRESS, Platforms} from '../Constants';
import {handleNewInspectionPress} from '../Utils';

const {ANDROID} = Platforms;
const {OS} = Platform;

const InspectionSelectionContainer = ({navigation}) => {
  const {navigate} = navigation;
  const dispatch = useDispatch();
  const {
    user: {token, data},
  } = useSelector(state => state?.auth);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        HARDWARE_BACK_PRESS,
        handle_Hardware_Back_Press,
      );
      return () => backHandler.remove();
    }, []),
  );

  function resetAllStates() {
    setIsLoading(false);
  }
  function handle_Hardware_Back_Press() {
    if (OS === ANDROID) {
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
  }

  const onNewInspectionPress = async () => {
    await handleNewInspectionPress(
      dispatch,
      setIsLoading,
      data?.companyId,
      navigation,
      resetAllStates,
    );
  };
  const handleNavigation = path => navigate(path);

  return (
    <InspectionSelectionScreen
      handleNewInspectionPress={onNewInspectionPress}
      handleNavigation={handleNavigation}
      isLoading={isLoading}
    />
  );
};

export default InspectionSelectionContainer;
