import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CardWrapper, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { ROUTES } from '../../../Navigation/ROUTES';
import { fetchFuelEvent, fetchFuelVehicles } from '../../../Store/Actions';
import { styles } from './styles';

const VEHICLE_EMOJI = { van: '🚐', truck: '🚚', sedan: '🚗', 'dvir-truck': '🚚', 'regular-truck': '🚚' };

const ConfirmFuelVehicleScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { vehicles, vehiclesLoading } = useSelector(state => state.fuel);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const canConfirm = useMemo(() => !!selectedVehicle, [selectedVehicle]);
  const filteredVehicles = useMemo(() => {
    const normalizedQuery = vehicleSearchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return vehicles || [];
    }

    return (vehicles || []).filter(vehicle =>
      vehicle?.licensePlateNumber?.toLowerCase().includes(normalizedQuery)
    );
  }, [vehicleSearchQuery, vehicles]);
  const progressPips = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    dispatch(fetchFuelVehicles());
  }, [dispatch]);

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
          <AppText style={styles.stepText}>{t('fuelVerification.stepVehicle')}</AppText>
          <AppText style={styles.title}>{t('fuelVerification.confirmVehicleTitle')}</AppText>
          <AppText style={styles.subtitle}>{t('fuelVerification.confirmVehicleSubtitle')}</AppText>
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
              <AppText style={styles.vehicleMeta}>{t('fuelVerification.loadingVehicles')}</AppText>
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
                  <AppText style={styles.vehicleMeta}>{t('fuelVerification.plate')}: {selectedVehicle?.licensePlateNumber}</AppText>
                </View>
              </View>
              <View style={styles.chipsRow}>
                {selectedVehicle?.vehicleType ? (
                  <AppText style={styles.chip}>{selectedVehicle.vehicleType}</AppText>
                ) : null}
                {selectedVehicle?.vin ? (
                  <AppText style={styles.chip}>{t('fuelVerification.vin')}: {selectedVehicle.vin}</AppText>
                ) : null}
              </View>
            </CardWrapper>
          ) : (
            <CardWrapper style={[styles.vehicleCard, styles.vehicleCardCenter]}>
              <AppText style={styles.vehicleMeta}>{t('fuelVerification.noVehiclesFound')}</AppText>
            </CardWrapper>
          )}

          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => setShowVehicleModal(true)}
            activeOpacity={0.8}
            disabled={vehiclesLoading || vehicles?.length === 0}>
            <AppText style={styles.ghostButtonText}>{t('fuelVerification.differentVehicle')}</AppText>
          </TouchableOpacity>

          <PrimaryGradientButton
            text={t('fuelVerification.confirmVehicleButton')}
            buttonStyle={styles.ctaButton}
            disabled={isConfirming}
            buttonDisabled={!canConfirm || vehiclesLoading}
            onPress={ConfirmVehicle}
          />
        </View>
      </View>

      <Modal
        visible={showVehicleModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowVehicleModal(false);
          setVehicleSearchQuery('');
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>{t('fuelVerification.chooseDifferentVehicle')}</AppText>
            <AppText style={styles.modalSub}>{t('fuelVerification.selectOneOptionAndConfirm')}</AppText>
            <TextInput
              value={vehicleSearchQuery}
              onChangeText={setVehicleSearchQuery}
              placeholder={t('fuelVerification.searchByPlateNumber')}
              placeholderTextColor="#9CA3AF"
              autoCorrect={false}
              autoCapitalize="characters"
              style={styles.modalSearchInput}
            />
            <FlatList
              data={filteredVehicles}
              keyExtractor={(item, index) => item?.id ?? index.toString()}
              style={styles.vehicleSelectionList}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.vehicleCardCenter}>
                  <AppText style={styles.vehicleMeta}>{t('fuelVerification.noVehiclesFound')}</AppText>
                </View>
              }
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
            <PrimaryGradientButton
              text={t('fuelVerification.useSelectedVehicle')}
              buttonStyle={styles.ctaButton}
              onPress={() => {
                setShowVehicleModal(false);
                setVehicleSearchQuery('');
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmFuelVehicleScreen;
