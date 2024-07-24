import React, {useCallback, useState} from 'react';
import {Alert, BackHandler, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {InspectionSelectionScreen} from '../Screens';
import {ANDROID, HARDWARE_BACK_PRESS} from '../Constants';
import {handleNewInspectionPress} from '../Utils';

const InspectionSelectionContainer = ({navigation}) => {
  const dispatch = useDispatch();
  const {token, data} = useSelector(state => state?.auth);
  const [isLoading, setIsLoading] = useState(false);

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
  const handleNavigation = PATH => navigation.navigate(PATH);

  return (
    <InspectionSelectionScreen
      handleNewInspectionPress={onNewInspectionPress}
      handleNavigation={handleNavigation}
      isLoading={isLoading}
    />
  );
};

export default InspectionSelectionContainer;
