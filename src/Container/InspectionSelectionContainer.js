import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {BackHandler, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {HARDWARE_BACK_PRESS, Platforms} from '../Constants';
import {handleNewInspectionPress} from '../Utils';

const {ANDROID} = Platforms;
const {OS} = Platform;

const InspectionSelectionContainer = ({navigation}) => {
  const {navigate} = navigation;
  const dispatch = useDispatch();
  const {
    user: {data},
  } = useSelector(state => state?.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        HARDWARE_BACK_PRESS,
        hardwareBackPress,
      );
      return () => backHandler.remove();
    }, []),
  );

  function resetAllStates() {
    setShowExitPopup(false);
    setIsLoading(false);
  }
  function hardwareBackPress() {
    if (OS === ANDROID) {
      setShowExitPopup(true);
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
  function onExitPress() {
    resetAllStates();
    BackHandler.exitApp();
  }
  function onExitCancelPress() {
    setShowExitPopup(false);
    return null;
  }

  return (
    <InspectionSelectionScreen
      handleNewInspectionPress={onNewInspectionPress}
      handleNavigation={handleNavigation}
      isLoading={isLoading}
      showExitPopup={showExitPopup}
      onExitPress={onExitPress}
      onExitCancelPress={onExitCancelPress}
    />
  );
};

export default InspectionSelectionContainer;
