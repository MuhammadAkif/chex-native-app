import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, AppState, Alert, Linking} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {useCameraPermissions} from '../../hooks/useCameraPermissions';
import {useCameraCapture} from '../../hooks/useCameraCapture';
import {CameraFooter, CameraHeader, PrimaryGradientButton} from '../index';
import {fallBack} from '../../Utils';
import {colors} from '../../Assets/Styles';
import {getErrorMessage} from '../../Utils/helpers';
import {RESULTS} from 'react-native-permissions';
import {
  useNewInspectionState,
  useNewInspectionActions,
} from '../../hooks/newInspection';

const {white, cobaltBlueMedium} = colors;

/**
 * CameraView component renders the camera with controls and handles
 * photo and video capture functionality.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onCapture - Callback function to handle captured photo or video.
 * @param {Function} props.onBackPress - Callback function for the back button press.
 * @param {boolean} [props.displayFrame=false] - Flag to show the camera frame.
 * @param {Function} [props.onFramePress=fallBack] - Callback when the frame is pressed.
 * @param {React.Element} [props.RightIcon] - Icon to be displayed on the right side.
 * @param {Function} [props.onError=fallBack] - Callback function to handle errors during recording.
 * @returns {JSX.Element} The rendered camera view with capture controls.
 */
const CameraView = ({
  onCapture,
  onBackPress,
  displayFrame = false,
  onFramePress = fallBack,
  RightIcon,
  onError = fallBack,
  children,
}) => {
  const {flashMode} = useNewInspectionState();
  const {setFlash} = useNewInspectionActions();
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const hasPermission = useCameraPermissions();
  const appState = useRef(AppState.currentState);
  const [cameraError, setCameraError] = useState('');

  const {
    capturePhoto,
    switchCamera,
    startRecording,
    stopRecording,
    isRecording,
    device,
    format,
  } = useCameraCapture(cameraRef);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      if (nextAppState === 'active') {
        // Reset camera error when app becomes active
        setCameraError('');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * Handles taking a photo.
   * Invokes the capturePhoto function from useCameraCapture hook and calls onCapture with the photo data.
   */
  const onTakePhoto = async () => {
    try {
      if (!cameraRef.current) {
        throw new Error('Camera not initialized');
      }
      const photo = await capturePhoto({flash: flashMode});
      if (!photo) {
        throw new Error('Failed to capture photo');
      }
      onCapture(photo);
    } catch (error) {
      handleCameraError(error, 'Error capturing photo');
    }
  };

  /**
   * Toggles video recording.
   * Starts or stops recording based on the current recording state and calls respective callback functions.
   */
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        await stopRecording();
      } else {
        await startRecording(onRecordingSuccess, onRecordingError);
      }
    } catch (error) {
      handleCameraError(error, 'Error during recording');
    }
  };

  /**
   * Callback when recording is successful.
   * @param {Object} video - The recorded video data.
   */
  const onRecordingSuccess = video => {
    onCapture(video);
  };

  /**
   * Callback when an error occurs during recording.
   * @param {Error} error - The error object.
   */
  const onRecordingError = error => {
    handleCameraError(error, 'Recording error');
  };

  /**
   * Handles camera-related errors by showing an alert and calling the error callback.
   * @param {Error} error - The error object
   * @param {string} context - Context where the error occurred
   */
  const handleCameraError = (error, context) => {
    const errorMessage = getErrorMessage(error?.code);
    setCameraError(errorMessage);
    Alert.alert(
      'Camera Error',
      errorMessage,
      [
        {
          text: 'Retry',
          onPress: () => setCameraError(''),
        },
        {
          text: 'Close',
          onPress: onBackPress,
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
    onError(error);
  };

  const on_Error = useCallback(error => {
    handleCameraError(error, 'Camera capture error');
  }, []);

  const handleSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  const onFlashModeChange = mode => {
    if (flashMode !== mode) {
      setFlash(mode);
    }
  };

  // Handle device initialization errors
  if (!device) {
    return (
      <Text style={styles.centerText}>
        {cameraError || 'Camera initialization failed. Please try again.'}
      </Text>
    );
  }

  // Handle permission errors
  if (hasPermission === RESULTS.BLOCKED) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Text style={styles.centerText}>
          Camera permission is required. Please enable it in your device
          settings.
        </Text>
        <PrimaryGradientButton
          text={'Open Settings'}
          onPress={handleSettings}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraHeader
        onClose={onBackPress}
        onFlashModeChange={onFlashModeChange}
        flashMode={flashMode}
      />
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && appState.current === 'active'}
        format={format}
        photo
        video
        onError={on_Error}
        enableHighQualityPhotos={true}
      />
      {children}
      <CameraFooter
        isCamera={true}
        handleSwitchCamera={switchCamera}
        handleCaptureNowPress={onTakePhoto}
        onRightIconPress={onFramePress}
        displayFrame={displayFrame}
        RightIcon={RightIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: cobaltBlueMedium,
    rowGap: hp('1%'),
  },
  centerText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: cobaltBlueMedium,
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: white,
    paddingHorizontal: wp('3%'),
  },
});

export default CameraView;
