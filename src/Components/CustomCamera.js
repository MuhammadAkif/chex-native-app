import React, {useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';

import {CameraPreview, CameraView} from './index';
import {HARDWARE_BACK_PRESS} from '../Constants';
import {fallBack} from '../Utils';

const CustomCamera = ({
  onCapture,
  onBackPress,
  onNextPress,
  onRetryPress,
  displayFrame = false,
  onFramePress = fallBack,
  RightIcon,
  children,
}) => {
  const [capturedMedia, setCapturedMedia] = useState(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      HARDWARE_BACK_PRESS,
      onHardwareBackPress,
    );
    return () => backHandler.remove();
  }, [capturedMedia]);

  function onHardwareBackPress() {
    if (capturedMedia) {
      onRetry();
      return true;
    }
    return false;
  }

  const onMediaCapture = (media = {}) => {
    media.uri = `file://${media.path}`;
    onCapture(media);
    setCapturedMedia(media);
  };

  const onBack = () => {
    onBackPress();
  };

  const onRetry = () => {
    setCapturedMedia(null);
    onRetryPress();
  };

  const onNext = () => {
    onNextPress();
  };

  if (capturedMedia) {
    return (
      <CameraPreview
        onRetryPress={onRetry}
        onNextPress={onNext}
        image_url={capturedMedia.uri}
        onBackPress={onBack}
      />
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <CameraView
        onCapture={onMediaCapture}
        onBackPress={onBack}
        displayFrame={displayFrame}
        onFramePress={onFramePress}
        RightIcon={RightIcon}>
        {children}
      </CameraView>
    </View>
  );
};

export default CustomCamera;
