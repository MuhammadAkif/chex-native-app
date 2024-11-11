import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';

import {useCameraPermissions} from '../../hooks/useCameraPermissions';
import {useCameraCapture} from '../../hooks/useCameraCapture';
import {CameraFooter, CameraHeader} from '../index';
import {fallBack} from '../../Utils';

const CameraView = ({
  onCapture,
  onBackPress,
  displayFrame = false,
  onFramePress = fallBack,
  RightIcon,
}) => {
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const hasPermission = useCameraPermissions();
  const appState = useRef(AppState.currentState);
  const {capturePhoto, switchCamera, device, format} =
    useCameraCapture(cameraRef);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onTakePhoto = async () => {
    const photo = await capturePhoto();
    onCapture(photo);
  };

  if (!device) {
    return <Text>Loading Camera...</Text>;
  }
  if (!hasPermission) {
    return <Text>Camera permission required.</Text>;
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
  },
});

export default CameraView;
