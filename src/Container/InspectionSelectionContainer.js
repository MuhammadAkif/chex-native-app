import React, {useCallback, useState} from 'react';
import {BackHandler, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {InspectionSelectionScreen} from '../Screens';
import {HARDWARE_BACK_PRESS, Platforms} from '../Constants';
import {handleNewInspectionPress} from '../Utils';
import VehicleTypeModal from '../Components/VehicleTypeModal';
import { setVehicleTypeModalVisible, setCompanyId, numberPlateSelected, setSelectedVehicleKind } from '../Store/Actions';
import { createInspection } from '../services/inspection';

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
  const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);
  const [pendingInspectionId, setPendingInspectionId] = useState(null);
  const [pendingRouteName, setPendingRouteName] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);

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
    setShowVehicleTypeModal(false);
    setPendingInspectionId(null);
    setPendingRouteName(null);
    setSelectedVehicleType(null);
  }
  function hardwareBackPress() {
    if (OS === ANDROID) {
      setShowExitPopup(true);
      return true;
    }
  }

  const onNewInspectionPress = async () => {
    setIsLoading(true);
    dispatch(setCompanyId(data?.companyId));
    try {
      const response = await createInspection(data?.companyId);
      const { id = null } = response?.data || {};
      setPendingInspectionId(id);
      setPendingRouteName('INSPECTION_SELECTION');
      setShowVehicleTypeModal(true);
    } catch (err) {
      // handle error as before
      setIsLoading(false);
    }
  };

  const handleVehicleTypeSelect = (type) => {
    setSelectedVehicleType(type);
    setShowVehicleTypeModal(false);
    dispatch(setVehicleTypeModalVisible(false));
    dispatch(setSelectedVehicleKind(type.toLowerCase()));
    // After modal closes, navigate to New Inspection with vehicle type param
    if (pendingInspectionId) {
      dispatch(numberPlateSelected(pendingInspectionId));
      resetAllStates();
      navigate('NEW INSPECTION', {
        routeName: pendingRouteName,
        selectedVehicleKind: type.toLowerCase(),
      });
    }
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
    <>
      <VehicleTypeModal
        visible={showVehicleTypeModal}
        onSelect={handleVehicleTypeSelect}
      />
      <InspectionSelectionScreen
        handleNewInspectionPress={onNewInspectionPress}
        handleNavigation={handleNavigation}
        isLoading={isLoading}
        showExitPopup={showExitPopup}
        onExitPress={onExitPress}
        onExitCancelPress={onExitCancelPress}
      />
    </>
  );
};

export default InspectionSelectionContainer;
