import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NativeModules } from 'react-native';

const { OpenCVCamera } = NativeModules;

const OpenCVCameraComponent = () => {
  const [cameraStarted, setCameraStarted] = useState(false);

  const startCamera = async () => {
    try {
      await OpenCVCamera.startCamera();
      setCameraStarted(true);
    } catch (error) {
      console.error('Failed to start camera:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!cameraStarted && (
        <Button title="Start Camera" onPress={startCamera} />
      )}
      {cameraStarted && (
        <Text>OpenCV Camera is running</Text>
      )}
    </View>
  );
};

export default OpenCVCameraComponent;