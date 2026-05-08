import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StatusBar, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CardWrapper, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { ROUTES } from '../../../Navigation/ROUTES';
import { fetchFuelEvent, fetchFuelVehicles } from '../../../Store/Actions';
import { styles } from './styles';

const VEHICLE_EMOJI = { van: '🚐', truck: '🚚', sedan: '🚗', 'dvir-truck': '🚚', 'regular-truck': '🚚' };

const ConfirmFuelVehicleScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { vehicles, vehiclesLoading } = useSelector(state => state.fuel);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const canConfirm = useMemo(() => !!selectedVehicle, [selectedVehicle]);
  const progressPips = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    dispatch(fetchFuelVehicles());
  }, []);

  console.log('selectedVehicle',vehicles)

  useEffect(() => {
    if (vehicles?.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0]);
    }
  }, [vehicles, selectedVehicle]);

  const ConfirmVehicle = async () => {
    setIsConfirming(true);
    try {
      // navigation.navigate(ROUTES.FUEL_LOCATION_CONFIRM, { vehicle: selectedVehicle });
      const body = {
        vehicleId: selectedVehicle?.id,
      };
      await dispatch(fetchFuelEvent(body));
      setIsConfirming(false);
      navigation.navigate(ROUTES.FUEL_LOCATION_CONFIRM, { vehicle: selectedVehicle });
    } catch (error) {
      console.error('Confirm vehicle failed:', error);
      setIsConfirming(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.blueHeaderContainer}>
        <LogoHeader />
        <View style={styles.flowHeader}>
          <AppText style={styles.stepText}>Step 1 of 6 · Vehicle</AppText>
          <AppText style={styles.title}>Confirm your vehicle</AppText>
          <AppText style={styles.subtitle}>Auto-filled from your last shift</AppText>
          <View style={styles.progressTrack}>
            {progressPips.map(index => (
              <View key={index} style={[styles.progressPip, index === 0 && styles.progressPipDone]} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <View style={styles.contentContainer}>
          {vehiclesLoading ? (
            <CardWrapper style={[styles.vehicleCard, styles.vehicleCardCenter]}>
              <ActivityIndicator size="small" color="#1E56A0" />
              <AppText style={styles.vehicleMeta}>Loading vehicles...</AppText>
            </CardWrapper>
          ) : selectedVehicle ? (
            <CardWrapper style={styles.vehicleCard}>
              <View style={styles.vehicleTopRow}>
                <View style={styles.vehicleEmojiWrap}>
                  <AppText style={styles.vehicleEmoji}>
                    {VEHICLE_EMOJI[selectedVehicle?.vehicleType] || '🚗'}
                  </AppText>
                </View>
                <View style={styles.vehicleTextWrap}>
                  <AppText style={styles.vehicleName}>
                    {selectedVehicle?.companyName || selectedVehicle?.licensePlateNumber}
                  </AppText>
                  <AppText style={styles.vehicleMeta}>Plate: {selectedVehicle?.licensePlateNumber}</AppText>
                </View>
              </View>
              <View style={styles.chipsRow}>
                {selectedVehicle?.vehicleType ? (
                  <AppText style={styles.chip}>{selectedVehicle.vehicleType}</AppText>
                ) : null}
                {selectedVehicle?.vin ? (
                  <AppText style={styles.chip}>VIN: {selectedVehicle.vin}</AppText>
                ) : null}
              </View>
            </CardWrapper>
          ) : (
            <CardWrapper style={[styles.vehicleCard, styles.vehicleCardCenter]}>
              <AppText style={styles.vehicleMeta}>No vehicles found</AppText>
            </CardWrapper>
          )}

          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => setShowVehicleModal(true)}
            activeOpacity={0.8}
            disabled={vehiclesLoading || vehicles?.length === 0}>
            <AppText style={styles.ghostButtonText}>Different vehicle</AppText>
          </TouchableOpacity>

          <PrimaryGradientButton
            text="Confirm vehicle"
            buttonStyle={styles.ctaButton}
            disabled={isConfirming}
            buttonDisabled={!canConfirm || vehiclesLoading}
            onPress={ConfirmVehicle}
          />
        </View>
      </View>

      <Modal visible={showVehicleModal} transparent animationType="fade" onRequestClose={() => setShowVehicleModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Choose a different vehicle</AppText>
            <AppText style={styles.modalSub}>Select one option and confirm.</AppText>
            <FlatList
              data={vehicles}
              keyExtractor={(item, index) => item?.id ?? index.toString()}
              style={styles.vehicleSelectionList}
              showsVerticalScrollIndicator
              renderItem={({ item }) => {
                const isSelected = selectedVehicle?.vin === item.vin;
                return (
                  <Pressable
                    style={[styles.vehicleOptionRow, isSelected && styles.vehicleOptionRowSelected]}
                    onPress={() => setSelectedVehicle(item)}>
                    <View style={styles.radioOuter}>{isSelected ? <View style={styles.radioInner} /> : null}</View>
                    <View style={styles.vehicleOptionTextWrap}>
                      <AppText style={styles.vehicleOptionTitle}>
                        {item.companyName || item.licensePlateNumber}
                      </AppText>
                      <AppText style={styles.vehicleOptionMeta}>{item.licensePlateNumber}</AppText>
                    </View>
                  </Pressable>
                );
              }}
            />
            <PrimaryGradientButton text="Use selected vehicle" buttonStyle={styles.ctaButton} onPress={() => setShowVehicleModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmFuelVehicleScreen;
