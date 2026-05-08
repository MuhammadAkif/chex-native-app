import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useDispatch, useSelector } from 'react-redux';
import { CardWrapper, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { ROUTES } from '../../../Navigation/ROUTES';
import { updateFuelEvent } from '../../../Store/Actions';
import { styles } from './styles';

const LOCATION_TIMEOUT_MS = 15000;

const FuelLocationConfirmScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const vehicle = route?.params?.vehicle;
  const fuelEvent = useSelector(state => state?.fuel?.fuelEvent);
  const selectedVehicle = vehicle || fuelEvent?.vehicle || fuelEvent;
  const progressPips = [0, 1, 2, 3, 4, 5];

  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationAddress, setLocationAddress] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapRef = useRef(null);
  const hasFetchedAddress = useRef(false);
  const locationTimeoutRef = useRef(null);

  const defaultRegion = useMemo(
    () => ({
      latitude: 33.7701,
      longitude: -118.1937,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [],
  );

  const fetchAddress = useCallback(async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'ChexAI/1.0 (support@chex.ai)',
          },
        },
      );
      const json = await res.json();
      const { road, house_number, suburb, city, town, village, county, state } = json.address || {};
      const street = road ? `${house_number ? `${house_number} ` : ''}${road}` : '';
      const locality = suburb || city || town || village || county || '';
      const parts = [street, locality, state].filter(Boolean);
      setLocationAddress(parts.join(', ') || json.display_name || null);
    } catch {
      setLocationAddress(null);
    }
  }, []);

  const clearLocationTimeout = useCallback(() => {
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
      locationTimeoutRef.current = null;
    }
  }, []);

  const startLocationTimeout = useCallback(() => {
    clearLocationTimeout();
    locationTimeoutRef.current = setTimeout(() => {
      setIsLocating(false);
      setLocationError(true);
    }, LOCATION_TIMEOUT_MS);
  }, [clearLocationTimeout]);

  const requestLocationPermission = useCallback(async () => {
    const permissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const result = await request(permissionType);
    const granted = result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    setHasLocationPermission(granted);
    if (granted) {
      setIsLocating(true);
      setLocationError(false);
      startLocationTimeout();
    }
  }, [startLocationTimeout]);

  useEffect(() => {
    requestLocationPermission();
    return () => clearLocationTimeout();
  }, [requestLocationPermission, clearLocationTimeout]);

  const handleUserLocationChange = useCallback(
    event => {
      const coords = event?.nativeEvent?.coordinate;
      if (!coords?.latitude || !coords?.longitude) { return; }

      const { latitude, longitude } = coords;

      clearLocationTimeout();
      setUserLocation({ latitude, longitude });
      setIsLocating(false);
      setLocationError(false);

      mapRef.current?.animateToRegion(
        { latitude, longitude, latitudeDelta: 0.006, longitudeDelta: 0.006 },
        600,
      );

      if (!hasFetchedAddress.current) {
        hasFetchedAddress.current = true;
        fetchAddress(latitude, longitude);
      }
    },
    [fetchAddress, clearLocationTimeout],
  );

  const handleRetry = useCallback(() => {
    hasFetchedAddress.current = false;
    setUserLocation(null);
    setLocationAddress(null);
    setLocationError(false);
    requestLocationPermission();
  }, [requestLocationPermission]);

  const confirmLocation = async () => {
    const eventId = fuelEvent?.event?.id;
    const body = {
      currentStep: 2,
    lat: userLocation?.latitude,
    lng: userLocation?.longitude,
    stationAddress: locationAddress,
    };

    setIsSubmitting(true);
    try {
      if (eventId) {
        await dispatch(updateFuelEvent(eventId, body));
        navigation.navigate(ROUTES.CAPTURE_ODOMETER, { vehicle: selectedVehicle, location: userLocation });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Confirm location update fuel event failed:', error);
      setIsSubmitting(false);
    }
  };

  const renderLocationDetail = () => {
    if (!hasLocationPermission) {
      return (
        <AppText style={styles.cardDescription}>
          Enable location access to fetch current location
        </AppText>
      );
    }
    if (locationError) {
      return (
        <TouchableOpacity onPress={handleRetry} activeOpacity={0.7}>
          <AppText style={styles.locationRetry}>Could not get location · Tap to retry</AppText>
        </TouchableOpacity>
      );
    }
    if (isLocating) {
      return <AppText style={styles.cardDescription}>Fetching GPS location...</AppText>;
    }
    if (locationAddress) {
      return (
        <AppText style={styles.cardDescription} numberOfLines={2}>
          {locationAddress}
        </AppText>
      );
    }
    if (userLocation) {
      return <AppText style={styles.cardDescription}>Location acquired</AppText>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.blueHeaderContainer}>
        <LogoHeader />
        <View style={styles.flowHeader}>
          <AppText style={styles.stepText}>Step 2 of 6 · GPS Validation</AppText>
          <AppText style={styles.title}>Location confirmed</AppText>
          <AppText style={styles.subtitle}>Use your current location to continue</AppText>
          <View style={styles.progressTrack}>
            {progressPips.map(index => (
              <View key={index} style={[styles.progressPip, index < 2 && styles.progressPipDone]} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          <CardWrapper style={styles.card}>
            <View style={styles.locationStatusRow}>
              <View style={styles.locationIconWrap}>
                {isLocating ? (
                  <ActivityIndicator size="small" color="#1E56A0" />
                ) : (
                  <AppText style={styles.locationIcon}>📍</AppText>
                )}
              </View>
              <View style={styles.locationTextWrap}>
                <View style={styles.locationTitleRow}>
                  <AppText style={styles.cardTitle}>Current location</AppText>
                  {userLocation && !isLocating && !locationError && (
                    <AppText style={styles.gpsBadge}>GPS</AppText>
                  )}
                </View>
                {renderLocationDetail()}
              </View>
            </View>
          </CardWrapper>

          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.map}
              initialRegion={defaultRegion}
              showsUserLocation={hasLocationPermission}
              showsMyLocationButton={false}
              onUserLocationChange={handleUserLocationChange}
              onMapReady={() => console.log('[MapView] ✅ map ready')}
              onMapLoaded={() => console.log('[MapView] ✅ tiles loaded')}
            >
              {userLocation ? (
                <Marker
                  coordinate={userLocation}
                  title={locationAddress || 'Your location'}
                />
              ) : null}
            </MapView>
          </View>

          <PrimaryGradientButton
            text="Continue"
            buttonStyle={styles.ctaButton}
            disabled={isSubmitting}
            onPress={confirmLocation}
          />

          <CardWrapper style={styles.vehicleCard}>
            <AppText style={styles.vehicleName}>Vehicle selected</AppText>
            <AppText style={styles.vehicleMeta}>
              {selectedVehicle?.companyName || selectedVehicle?.licensePlateNumber || '—'}
            </AppText>
            <AppText style={styles.vehicleMeta}>
              Plate: {selectedVehicle?.licensePlateNumber || '—'}
            </AppText>
          </CardWrapper>
        </ScrollView>
      </View>
    </View>
  );
};

export default FuelLocationConfirmScreen;
