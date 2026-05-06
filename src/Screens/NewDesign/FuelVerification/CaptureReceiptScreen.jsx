import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { CardWrapper, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { styles } from './styles';

const DUMMY_RECEIPT_RESPONSE = {
  gallons: '12.4 gal',
  price: '$4.21',
  total: '$52.20',
  merchant: 'Shell #4471',
};

const CaptureReceiptScreen = () => {
  const progressPips = [0, 1, 2, 3, 4, 5];
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState('');
  const [showDummyResult, setShowDummyResult] = useState(false);

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

      Alert.alert('Camera permission required', 'Please allow camera access to capture receipt.');
    };

    initPermission();
  }, []);

  const handleCapture = async () => {
    if (capturedImageUri) {
      setCapturedImageUri('');
      setShowDummyResult(false);
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

    if (!cameraRef.current) {
      return;
    }

    try {
      const photo = await cameraRef.current.takePhoto({ flash: 'off' });
      const normalizedUri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
      setCapturedImageUri(normalizedUri);
      setShowDummyResult(true);
    } catch (error) {
      Alert.alert('Capture failed', 'Could not capture receipt image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.blueHeaderContainer}>
        <LogoHeader />
        <View style={styles.flowHeader}>
          <AppText style={styles.stepText}>Step 4 of 6 · Receipt</AppText>
          <AppText style={styles.title}>Capture receipt</AppText>
          <AppText style={styles.subtitle}>Photograph the receipt after fueling</AppText>
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

          {!showDummyResult ? (
            <TouchableOpacity style={styles.ghostButton} onPress={handleCapture} activeOpacity={0.8}>
              <AppText style={styles.ghostButtonText}>Capture receipt image</AppText>
            </TouchableOpacity>
          ) : null}

          {showDummyResult ? (
            <CardWrapper style={styles.odometerResultCard}>
              <AppText style={styles.modalTitle}>Receipt data</AppText>
              <View style={styles.odometerResultRow}>
                <AppText style={styles.vehicleMeta}>Gallons</AppText>
                <AppText style={styles.vehicleName}>{DUMMY_RECEIPT_RESPONSE.gallons}</AppText>
              </View>
              <View style={styles.odometerResultRow}>
                <AppText style={styles.vehicleMeta}>Price</AppText>
                <AppText style={styles.vehicleName}>{DUMMY_RECEIPT_RESPONSE.price}</AppText>
              </View>
              <View style={styles.odometerResultRow}>
                <AppText style={styles.vehicleMeta}>Total</AppText>
                <AppText style={styles.vehicleName}>{DUMMY_RECEIPT_RESPONSE.total}</AppText>
              </View>
              <View style={styles.odometerResultRow}>
                <AppText style={styles.vehicleMeta}>Merchant</AppText>
                <AppText style={styles.vehicleName}>{DUMMY_RECEIPT_RESPONSE.merchant}</AppText>
              </View>
            </CardWrapper>
          ) : null}

          <PrimaryGradientButton text="Continue" buttonStyle={styles.ctaButton} buttonDisabled={!showDummyResult} onPress={() => {}} />

          <TouchableOpacity style={styles.ghostButton} activeOpacity={0.8} onPress={() => {}}>
            <AppText style={styles.ghostButtonText}>No receipt available</AppText>
          </TouchableOpacity>

          {showDummyResult ? (
            <TouchableOpacity style={styles.ghostButton} onPress={handleCapture} activeOpacity={0.8}>
              <AppText style={styles.ghostButtonText}>Retake photo</AppText>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
};

export default CaptureReceiptScreen;
