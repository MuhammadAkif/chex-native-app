import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

import {CompletedInspectionScreen} from '../Screens';
import {HARDWARE_BACK_PRESS} from '../Constants';
import {ROUTES, TABS} from '../Navigation/ROUTES';
import {useBoolean} from '../hooks';
import {useDispatch} from 'react-redux';
import {clearNewInspection, hideToast, setRequired} from '../Store/Actions';

const CompletedInspectionContainer = ({navigation}) => {
  const {canGoBack, navigate} = navigation;
  const {value: boxVisible, setTrue, setFalse, reset, toggle} = useBoolean(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, handle_Hardware_Back_Press);
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    return resetAllStates;
  }, []);

  const handleHomePress = () => {
    dispatch(clearNewInspection());
    dispatch(setRequired());
    dispatch(hideToast());

    navigation.navigate(ROUTES.TABS, {name: TABS.HOME});
  };

  function handle_Hardware_Back_Press() {
    if (canGoBack()) {
      // CLEAR INSPECTION STATES OF REDUX
      dispatch(clearNewInspection());
      dispatch(setRequired());
      dispatch(hideToast());

      navigation.navigate(ROUTES.TABS, {name: TABS.HOME});

      return true;
    }
    return false;
  }
  function resetAllStates() {
    reset();
  }
  return <CompletedInspectionScreen boxVisible={boxVisible} onHomePress={handleHomePress} />;
};

export default CompletedInspectionContainer;
