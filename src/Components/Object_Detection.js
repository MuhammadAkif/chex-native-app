import React, {useRef, useState, useEffect} from 'react';
import {useTensorflowModel} from 'react-native-fast-tflite';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useFrameProcessor} from 'react-native-vision-camera';
import {PHYSICAL_DEVICES} from '../Constants';
import {useIsFocused} from '@react-navigation/native';
import {colors, PreviewStyles} from '../Assets/Styles';
import FastImage from 'react-native-fast-image';
import {
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
  AppState,
} from 'react-native';
import {BackArrow} from '../Assets/Icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {CameraFooter} from './index';
import {useResizePlugin} from 'vision-camera-resize-plugin';

const Object_Detection = ({navigation}) => {
  const isFocused = useIsFocused();
  const {resize} = useResizePlugin();
  const cameraRef = useRef();
  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {
    physicalDevices: PHYSICAL_DEVICES,
  });
  const [isImageFile, setIsImageFile] = useState({});
  const [isImageURL, setIsImageURL] = useState('');
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);
  const objectDetection = useTensorflowModel(
    require('object_detection.tflite'),
  );
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (model == null) {
        return;
      }

      // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
      const resized = resize(frame, {
        scale: {
          width: 192,
          height: 192,
        },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      });

      // 2. Run model with given input buffer synchronously
      const outputs = model.runSync([resized]);

      // 3. Interpret outputs accordingly
      const detection_boxes = outputs[0];
      const detection_classes = outputs[1];
      const detection_scores = outputs[2];
      const num_detections = outputs[3];
      console.log(`Detected ${num_detections[0]} objects!`);

      for (let i = 0; i < detection_boxes.length; i += 4) {
        const confidence = detection_scores[i / 4];
        if (confidence > 0.7) {
          // 4. Draw a red box around the detected object!
          const left = detection_boxes[i];
          const top = detection_boxes[i + 1];
          const right = detection_boxes[i + 2];
          const bottom = detection_boxes[i + 3];
          const rect = SkRect.Make(left, top, right, bottom);
          canvas.drawRect(rect, SkColors.Red);
        }
      }
    },
    [model],
  );
  const handleCaptureNowPress = async () => {
    if (cameraRef.current) {
      let file = await cameraRef?.current?.takePhoto();
      const filePath = `file://${file.path}`;
      setIsImageFile(file);
      setIsImageURL(filePath);
      // const result = await fetch(filePath);
      // const data = await result.blob();
    }
  };
  function resetAllStates() {
    setIsImageURL('');
    setIsImageFile({});
  }
  const handleNavigationBackPress = () => navigation.goBack();

  return (
    // <Camera frameProcessor={frameProcessor} {...otherProps} />
    <View style={PreviewStyles.container}>
      {isImageURL ? (
        <FastImage
          priority={'normal'}
          resizeMode={'stretch'}
          style={[StyleSheet.absoluteFill, {borderRadius: 25}]}
          source={{uri: isImageURL}}
        />
      ) : (
        // selectedCamera &&
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          photo={true}
          audio={false}
          isActive={isFocused && appState.current === 'active'}
          enableZoomGesture={true}
          includeBase64={true}
          format={format}
        />
      )}
      <View style={PreviewStyles.headerContainer}>
        <TouchableOpacity onPress={handleNavigationBackPress}>
          <BackArrow height={hp('8%')} width={wp('8%')} color={colors.white} />
        </TouchableOpacity>
      </View>
      <CameraFooter
        isCamera={true}
        // handleSwitchCamera={handleSwitchCamera}
        handleCaptureNowPress={handleCaptureNowPress}
      />
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
    </View>
  );
};

export default Object_Detection;
