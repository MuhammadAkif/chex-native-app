import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text, View, Modal} from 'react-native';
import {modalStyle} from '../Assets/Styles';
import {VEHICLE_TYPES, VEHICLE_TYPE_DISPLAY_NAMES} from '../Constants';
import VehicleTypeButton from './VehicleTypeButton';
import PrimaryGradientButton from './PrimaryGradientButton';

const {modalOuterContainer, container, modalContainer, header, body, button, yesText} = modalStyle;

const buttonSpacing = {marginVertical: 6};

const VehicleTypeModal = ({visible, onSelect, loadingState}) => {
  const isAnyButtonLoading = loadingState.isLoading;
  const currentLoadingVehicleType = loadingState.vehicleType;

  // Memoize button data to prevent unnecessary re-renders
  const buttonData = useMemo(
    () => [
      {
        type: VEHICLE_TYPES.VAN,
        displayName: VEHICLE_TYPE_DISPLAY_NAMES[VEHICLE_TYPES.VAN],
      },
      {
        type: VEHICLE_TYPES.SEDAN,
        displayName: VEHICLE_TYPE_DISPLAY_NAMES[VEHICLE_TYPES.SEDAN],
      },
      {
        type: VEHICLE_TYPES.TRUCK,
        displayName: VEHICLE_TYPE_DISPLAY_NAMES[VEHICLE_TYPES.TRUCK],
      },
      {
        type: VEHICLE_TYPES.OTHER,
        displayName: VEHICLE_TYPE_DISPLAY_NAMES[VEHICLE_TYPES.OTHER],
      },
    ],
    [],
  );

  // Memoize event handlers to prevent unnecessary re-renders
  const handleButtonPress = useCallback(
    vehicleType => {
      if (!isAnyButtonLoading) {
        onSelect(vehicleType);
      }
    },
    [isAnyButtonLoading, onSelect],
  );

  const getButtonLoadingState = useCallback(
    vehicleType => {
      return currentLoadingVehicleType === vehicleType && isAnyButtonLoading;
    },
    [currentLoadingVehicleType, isAnyButtonLoading],
  );

  return (
    <Modal animationType="slide" statusBarTranslucent={true} transparent={true} visible={visible}>
      <View style={container}>
        <View style={modalContainer}>
          <Text style={header}>Select Vehicle Type</Text>
          <Text style={body}>Please choose the type of vehicle for this inspection.</Text>
          <View style={styles.buttonContainer}>
            {buttonData.map(({type, displayName}) => (
              <VehicleTypeButton
                key={type}
                text={displayName}
                buttonStyle={[button, buttonSpacing, styles.buttonStyle]}
                textStyle={yesText}
                onPress={() => handleButtonPress(displayName)}
                isLoading={getButtonLoadingState(type)}
                isDisabled={isAnyButtonLoading}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    width: '80%',
    paddingVertical: 10,
  },
  buttonStyle: {width: '100%', alignSelf: 'center'},
});

export default VehicleTypeModal;
