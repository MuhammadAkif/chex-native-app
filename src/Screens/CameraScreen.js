import React, {forwardRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Camera} from 'react-native-vision-camera';

import {colors} from '../Assets/Styles';

const CameraScreen = forwardRef(
  ({isFocused, device, handleCaptureNowPress}, cameraRef) => {
    return (
      <View style={styles.container}>
        {device && (
          <Camera
            ref={cameraRef}
            style={[StyleSheet.absoluteFill, {borderRadius: 25}]}
            device={device}
            video={false}
            photo={true}
            audio={false}
            isActive={isFocused}
            enableZoomGesture={true}
          />
        )}
        <Text style={styles.captureText} onPress={handleCaptureNowPress}>
          Hello
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  captureText: {
    color: colors.white,
    fontSize: 30,
  },
});

export default CameraScreen;
