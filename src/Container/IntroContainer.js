import React, {useEffect, useState} from 'react';
import {BackHandler, Linking} from 'react-native';
import {useDispatch} from 'react-redux';

import {IntroScreen} from '../Screens';
import {HARDWARE_BACK_PRESS} from '../Constants';
import {handleNewInspectionPress} from '../Utils';
import {useAuthState} from '../hooks/auth';

const IntroContainer = ({navigation}) => {
  const {canGoBack, goBack} = navigation;
  const {user: data} = useAuthState();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      handle_Hardware_Back_Press,
    );
    return () => backHandler.remove();
  }, []);

  const resetAllStates = () => {
    setIsLoading(false);
  };
  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      goBack();
      return true;
    }
    return false;
  }
  const handleOpenSettings = async () => {
    await Linking.openSettings().then();
  };
  const onNewInspectionPress = async () => {
    try {
      await handleNewInspectionPress(
        dispatch,
        setIsLoading,
        data?.companyId,
        navigation,
      );
      resetAllStates();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <IntroScreen
      handleStartInspection={onNewInspectionPress}
      handleOpenSettings={handleOpenSettings}
      isLoading={isLoading}
    />
  );
};

export default IntroContainer;
