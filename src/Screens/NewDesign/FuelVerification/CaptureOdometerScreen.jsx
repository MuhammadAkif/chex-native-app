import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useDispatch, useSelector } from 'react-redux';
import { CardWrapper, LogoHeader, PrimaryGradientButton } from '../../../Components';
import AppText from '../../../Components/text';
import { S3_BUCKET_BASEURL } from '../../../Constants';
import { ROUTES } from '../../../Navigation/ROUTES';
import { getMileage } from '../../../Store/Actions';
import { fixImageOrientation, getSignedUrl } from '../../../Utils';
import { styles } from './styles';
import { updateFuelEvent } from '../../../Store/Actions';

const CaptureOdometerScreen = ({ navigation, route }) => {
  const progressPips = [0, 1, 2, 3, 4, 5];
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');
  const dispatch = useDispatch();

  const {
    user: { token, data },
  } = useSelector(state => state.auth);
  const { selectedInspectionID, variant } = useSelector(state => state.newInspection);
  const mileage = useSelector(state => state.newInspection.mileage);
  const fuelEvent = useSelector(state => state.fuel?.fuelEvent);

  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState('');
  const [capturedS3Key, setCapturedS3Key] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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
      Alert.alert('Camera permission required', 'Please allow camera access to capture odometer.');
    };
    initPermission();
  }, []);

  const handleUploadError = () => {
    setIsUploading(false);
    setProgress(0);
    Alert.alert('Upload failed', 'Could not upload odometer image. Please try again.');
  };

  console.log('fuelEvent', fuelEvent);

  const handleResponse = async (key) => {
    const body = {
      odometerReading: 44450
    }
    await dispatch(updateFuelEvent(fuelEvent?.id, body));
    // const imageUrl = `${S3_BUCKET_BASEURL}${key}`;
    // setCapturedS3Key(key);
    // dispatch(getMileage(imageUrl)).catch(() => {});
    setShowResult(true);
    setIsUploading(false);
    // const body = {
    //   odometerReading: 44444
    // }
    // await dispatch(updateFuelEvent(fuelEvent?.event?.id, body));
  };

  const handleCapture = async () => {
    if (capturedImageUri) {
      setCapturedImageUri('');
      setCapturedS3Key('');
      setShowResult(false);
      setProgress(0);
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
      setIsUploading(true);

      const extension = photo.path.split('.').pop() || 'jpeg';
      const mime = `image/${extension}`;
      const normalizedPath = Platform.OS === 'ios' ? await fixImageOrientation(photo.path) : photo.path;

      await getSignedUrl(
        token,
        mime,
        normalizedPath,
        setProgress,
        handleResponse,
        handleUploadError,
        dispatch,
        fuelEvent?.event?.id || selectedInspectionID,
        'odometer',
        variant || 0,
        'app',
        data?.companyId,
        'CarVerification'
      );
    } catch (error) {
      setIsUploading(false);
      Alert.alert('Capture failed', 'Could not capture odometer image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.blueHeaderContainer}>
        <LogoHeader />
        <View style={styles.flowHeader}>
          <AppText style={styles.stepText}>Step 3 of 6 · Odometer</AppText>
          <AppText style={styles.title}>Capture odometer</AppText>
          <AppText style={styles.subtitle}>Point camera at the odometer display</AppText>
          <View style={styles.progressTrack}>
            {progressPips.map(index => (
              <View key={index} style={[styles.progressPip, index < 3 && styles.progressPipDone]} />
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

          {isUploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="small" color="#1D4ED8" />
              <AppText style={styles.uploadingText}>Uploading… {progress}%</AppText>
            </View>
          ) : null}

          {!showResult && !isUploading ? (
            <TouchableOpacity style={styles.ghostButton} onPress={handleCapture} activeOpacity={0.8}>
              <AppText style={styles.ghostButtonText}>Capture odometer image</AppText>
            </TouchableOpacity>
          ) : null}

          {showResult ? (
            <CardWrapper style={styles.odometerResultCard}>
              <AppText style={styles.modalTitle}>Odometer reading</AppText>
              <View style={styles.odometerResultRow}>
                <AppText style={styles.vehicleMeta}>Current</AppText>
                <AppText style={styles.odometerMiles}>{fuelEvent?.odometerReading || mileage || 'N/A'}</AppText>
              </View>
              <View style={styles.odometerResultRow}>
                <AppText style={styles.vehicleMeta}>Last recorded</AppText>
                <AppText style={styles.odometerMiles}>{fuelEvent?.odometerLastRecorded || 'N/A'}</AppText>
              </View>
              <View style={[styles.odometerResultRow, styles.odometerResultRowLast]}>
                <AppText style={styles.vehicleMeta}>Miles since last fill</AppText>
                <AppText style={styles.odometerMiles}>{fuelEvent?.milesSinceLastFill || 'N/A'}</AppText>
              </View>
            </CardWrapper>
          ) : null}

          <PrimaryGradientButton
            text="Continue"
            buttonStyle={styles.ctaButton}
            buttonDisabled={!showResult || isUploading}
            onPress={() =>
              navigation.navigate(ROUTES.PRE_FUEL_GAUGE, {
                vehicle: route?.params?.vehicle,
                location: route?.params?.location,
                odometerImage: capturedImageUri,
                odometerMileage: mileage,
                odometerS3Key: capturedS3Key,
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

export default CaptureOdometerScreen;
