import {useState} from 'react';
import {useCameraDevice, useCameraFormat} from 'react-native-vision-camera';
import {Dimensions} from 'react-native';

import {PHYSICAL_DEVICES, SWITCH_CAMERA} from '../Constants';

const {height, width} = Dimensions.get('window');

export const useCameraCapture = cameraRef => {
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back');

  const device = useCameraDevice(cameraPosition, {
    physicalDevices: PHYSICAL_DEVICES,
  });
  const format = useCameraFormat(device, [
    {videoResolution: {width: width, height: height}},
    {fps: 60},
  ]);

  const capturePhoto = async () => {
    if (cameraRef.current) {
      return await cameraRef.current.takePhoto();
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      await cameraRef.current.startRecording();
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      setIsRecording(false);
      return await cameraRef.current.stopRecording();
    }
  };

  const switchCamera = () => {
    setCameraPosition(SWITCH_CAMERA[cameraPosition === 'back']);
  };

  return {
    capturePhoto,
    startRecording,
    stopRecording,
    isRecording,
    switchCamera,
    device,
    format,
  };
};
