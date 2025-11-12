import React, {useEffect, useState} from 'react';
import {BackHandler, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {IntroScreen} from '../Screens';
import {HARDWARE_BACK_PRESS} from '../Constants';
import {ROUTES, TABS} from '../Navigation/ROUTES';

const IntroContainer = ({navigation}) => {
  const {canGoBack, goBack} = navigation;
  const {
    user: {token, data},
  } = useSelector(state => state?.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, handle_Hardware_Back_Press);
    return () => backHandler.remove();
  }, []);

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
    navigation.popTo(ROUTES.TABS, {name: ROUTES.VEHICLE_INFORMATION});
  };
  return <IntroScreen handleStartInspection={onNewInspectionPress} handleOpenSettings={handleOpenSettings} isLoading={isLoading} />;
};

export default IntroContainer;
