import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Car} from '../../Assets/Icons';
import {SecondaryButton} from '../index';
import styles from './styles';
import {fallBack} from '../../Utils';
import AvailableVehiclesModal from './AvailableVehiclesModal';
import {colors} from '../../Assets/Styles';
import {connectDevice, getUserVehiclesList} from '../../services/device';
import {useAuthActions} from '../../hooks/auth';
import {useAuthState, useSafetyTagInitializer} from '../../hooks';
import {useUIActions} from '../../hooks/UI';
import {useDeviceActions} from '../../hooks/device';

const {royalBlue} = colors;

const RenderDevices = ({item: vehicle, onPress}) => (
  <View style={styles.deviceList}>
    <View style={styles.listIconContainer}>
      <Car height={hp('3%')} width={wp('4%')} color={royalBlue} />
    </View>
    <Text
      style={styles.deviceListText}
      numberOfLines={1}
      ellipsizeMode={'tail'}>
      {vehicle?.licensePlateNumber}
    </Text>
    <SecondaryButton
      text={'Select'}
      onPress={() => onPress(vehicle?.id)}
      textStyle={[styles.cancelTextStyle, styles.connectText]}
      buttonStyle={[styles.cancelButton, styles.connectButton]}
    />
  </View>
);

const AvailableVehicles = ({
  onSelectPress = fallBack,
  onCancelPress = fallBack,
  isVisible,
  deviceAddress,
}) => {
  const {setVehiclesList} = useAuthActions();
  const {vehicles} = useAuthState();
  const {toggleLoading} = useUIActions();
  const {setVehicleID, setUserDeviceDetails} = useDeviceActions();
  const {connectToSelectedDevice} = useSafetyTagInitializer();
  const [availableVehiclesState, setAvailableVehiclesState] = useState({
    isVisible: false,
    data: [],
  });
  useEffect(() => {
    if (availableVehiclesState?.isVisible) {
      toggleLoading(true);
      (async () => {
        try {
          const {data} = await getUserVehiclesList();
          setVehiclesList(data);
        } catch (error) {
          throw error;
        } finally {
          toggleLoading(false);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (availableVehiclesState?.isVisible !== isVisible) {
      setAvailableVehiclesState(prevState => ({
        ...prevState,
        isVisible: isVisible,
      }));
    }
  }, [isVisible]);

  const toggleVisibility = () => {
    setAvailableVehiclesState(prevState => ({
      ...prevState,
      isVisible: !prevState.isVisible,
    }));
  };

  const handleSelectPress = async vehicle_id => {
    onSelectPress(vehicle_id);
    setVehicleID(vehicle_id);
    try {
      const {data} = await connectDevice(vehicle_id, deviceAddress);
      await connectToSelectedDevice(deviceAddress);
      setUserDeviceDetails(data);
    } catch (error) {
      throw error;
    }
    toggleVisibility();
  };

  const handleCancelPress = () => {
    onCancelPress();
    toggleVisibility();
  };

  return (
    <AvailableVehiclesModal
      visible={availableVehiclesState.isVisible}
      RenderDevices={RenderDevices}
      onSelectPress={handleSelectPress}
      onCancelPress={handleCancelPress}
      data={vehicles}
    />
  );
};

export default AvailableVehicles;
