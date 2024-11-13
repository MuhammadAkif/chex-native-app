import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {useCameraPermissions} from '../../hooks/useCameraPermissions';
import {useCameraCapture} from '../../hooks/useCameraCapture';
import {CameraFooter, CameraHeader} from '../index';
import {fallBack} from '../../Utils';
import {colors} from '../../Assets/Styles';

const {cobaltBlueMedium} = colors;

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
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const hasPermission = useCameraPermissions();
  const appState = useRef(AppState.currentState);
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
    const photo = await capturePhoto();
    onCapture(photo);
  };

  /**
   * Toggles video recording.
   * Starts or stops recording based on the current recording state and calls respective callback functions.
   */
  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording(onRecordingSuccess, onRecordingError);
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
    onError(error);
  };

  if (!device) {
    return <Text style={styles.centerText}>Loading Camera...</Text>;
  }
  if (!hasPermission) {
    return <Text style={styles.centerText}>Camera permission required.</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraHeader onClose={onBackPress} />
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && appState.current === 'active'}
        format={format}
        photo
        video
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
  },
  centerText: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: cobaltBlueMedium,
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
});

export default CameraView;
