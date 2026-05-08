import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { CardWrapper, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { ROUTES } from '../../../Navigation/ROUTES';
import { styles } from './styles';

const DUMMY_FUEL_GAUGE = {
  preFuelLevel: '~18% · 4.5 gal remaining',
  expectedFillToFull: '~20.5 gal max',
};

const PreFuelGaugeScreen = ({ navigation, route }) => {
  const progressPips = [0, 1, 2, 3, 4, 5];
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const initPermission = async () => {
      const permission = await Camera.getCameraPermissionStatus();
      if (permission === 'granted') {
        setHasPermission(true);
        return;
      }
      const requested = await Camera.requestCameraPermission();
      if (requested === 'granted') {
        setHasPermission(true);
        return;
      }
      Alert.alert('Camera permission required', 'Please allow camera access to capture the fuel gauge.');
    };
    initPermission();
  }, []);

  const handleCapture = async () => {
    if (capturedImageUri) {
      setCapturedImageUri('');
      setShowResult(false);
      return;
    }

    if (!hasPermission) {
      const requested = await Camera.requestCameraPermission();
      if (requested !== 'granted') {
        Alert.alert('Camera permission required', 'Please allow camera access to continue.');
        return;
      }
      setHasPermission(true);
    }

    if (!cameraRef.current) { return; }

    try {
      const photo = await cameraRef.current.takePhoto({ flash: 'off' });
      const normalizedUri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
      setCapturedImageUri(normalizedUri);
      setShowResult(true);
    } catch (error) {
      Alert.alert('Capture failed', 'Could not capture fuel gauge image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.blueHeaderContainer}>
        <LogoHeader />
        <View style={styles.flowHeader}>
          <AppText style={styles.stepText}>Step 4 of 6 · Fuel Gauge (Before)</AppText>
          <AppText style={styles.title}>Pre-fuel gauge</AppText>
          <AppText style={styles.subtitle}>Photograph gauge before pumping</AppText>
          <View style={styles.progressTrack}>
            {progressPips.map(index => (
              <View key={index} style={[styles.progressPip, index < 4 && styles.progressPipDone]} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          <View style={styles.odometerCameraWrap}>
            {!capturedImageUri && hasPermission && device ? (
              <Camera ref={cameraRef} style={styles.odometerCameraPreview} device={device} isActive photo />
            ) : capturedImageUri ? (
              <Image source={{ uri: capturedImageUri }} style={styles.odometerCapturedImage} />
            ) : (
              <View style={styles.odometerPlaceholder}>
                <AppText style={styles.cardDescription}>Camera unavailable. Please allow camera permission.</AppText>
              </View>
            )}
          </View>

          {!showResult ? (
            <TouchableOpacity style={styles.ghostButton} onPress={handleCapture} activeOpacity={0.8}>
              <AppText style={styles.ghostButtonText}>Capture fuel gauge</AppText>
            </TouchableOpacity>
          ) : null}

          {showResult ? (
            <CardWrapper style={styles.odometerResultCard}>
              <AppText style={styles.modalTitle}>Fuel gauge reading</AppText>
              <View style={styles.odometerResultRow}>
                <AppText style={styles.vehicleMeta}>Pre-fuel level</AppText>
                <AppText style={styles.vehicleName}>{DUMMY_FUEL_GAUGE.preFuelLevel}</AppText>
              </View>
              <View style={[styles.odometerResultRow, { borderBottomWidth: 0 }]}>
                <AppText style={styles.vehicleMeta}>Expected fill to full</AppText>
                <AppText style={styles.vehicleName}>{DUMMY_FUEL_GAUGE.expectedFillToFull}</AppText>
              </View>
            </CardWrapper>
          ) : null}

          <PrimaryGradientButton
            text="Gauge captured — go pump"
            buttonStyle={styles.ctaButton}
            buttonDisabled={!showResult}
            onPress={() =>
              navigation.navigate(ROUTES.CAPTURE_RECEIPT, {
                vehicle: route?.params?.vehicle,
                location: route?.params?.location,
                odometerImage: route?.params?.odometerImage,
                odometerMileage: route?.params?.odometerMileage,
                odometerS3Key: route?.params?.odometerS3Key,
                preFuelGaugeImage: capturedImageUri,
              })
            }
          />

          {showResult ? (
            <TouchableOpacity style={styles.ghostButton} onPress={handleCapture} activeOpacity={0.8}>
              <AppText style={styles.ghostButtonText}>Retake photo</AppText>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
};

export default PreFuelGaugeScreen;
