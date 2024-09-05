import React, {useRef, useState, useEffect} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
  AppState,
  Text,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useTensorflowModel} from 'react-native-fast-tflite';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useFrameProcessor} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {useResizePlugin} from 'vision-camera-resize-plugin';
import {useRunOnJS} from 'react-native-worklets-core';

import {BackArrow} from '../Assets/Icons';
import {PHYSICAL_DEVICES} from '../Constants';
import {colors, PreviewStyles} from '../Assets/Styles';
import {CameraFooter, LoadingIndicator} from './index';
import {Models} from '../Assets/AI_Models';
import {Canvas, Rect} from '@shopify/react-native-skia';

const Working_Object_Detection = ({navigation}) => {
  const isFocused = useIsFocused();
  const {resize} = useResizePlugin();
  const cameraRef = useRef();
  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {physicalDevices: PHYSICAL_DEVICES});
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);
  // State to manage detected objects and box color
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [boxColor, setBoxColor] = useState('black');
  const [noDetectionFrames, setNoDetectionFrames] = useState(0);

  // AI Model initialization
  const objectDetection = useTensorflowModel(Models.model_One);
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  // Box position and size
  const boxSizePercentage = 90;
  const boxSize = wp(boxSizePercentage);
  const boxTop = hp(50) - boxSize / 2;
  const boxLeft = wp(50) - boxSize / 2;

  useEffect(() => {
    if (noDetectionFrames > 10) {
      setDetectedObjects([]);
      setNoDetectionFrames(0);
    }
  }, [noDetectionFrames]);

  // Check for object overlap with the box
  const checkOverlap = objects => {
    for (const obj of objects) {
      if (
        obj.left < boxLeft + boxSize &&
        obj.left + obj.width > boxLeft &&
        obj.top < boxTop + boxSize &&
        obj.top + obj.height > boxTop
      ) {
        setBoxColor('red');
        return;
      }
    }
    setBoxColor('black');
  };

  // Logic to handle frame detection
  const handleOutput = useRunOnJS(output => {
    if (output.length > 0) {
      setDetectedObjects(output);
      checkOverlap(output);
      setNoDetectionFrames(0); // Reset no detection frames
    } else {
      setNoDetectionFrames(prev => prev + 1);
      setBoxColor('black'); // Reset box color when no objects are detected
    }
  }, []);

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

      // Collect detected objects to render bounding boxes
      const detected_Objects = [];
      for (let i = 0; i < detection_boxes.length; i += 4) {
        const confidence = detection_scores[i / 4];
        if (confidence > 0.7) {
          const left = detection_boxes[i];
          const top = detection_boxes[i + 1];
          const right = detection_boxes[i + 2];
          const bottom = detection_boxes[i + 3];

          detected_Objects.push({
            left,
            top,
            width: right - left,
            height: bottom - top,
          });
        }
      }

      // Update state with detected objects if any are found
      handleOutput(detected_Objects).then();
    },
    [model],
  );

  return (
    <View style={PreviewStyles.container}>
      <View style={PreviewStyles.headerContainer}>
        <TouchableOpacity>
          <BackArrow height={hp('8%')} width={wp('8%')} color={colors.white} />
        </TouchableOpacity>
      </View>
      {device ? (
        <>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            frameProcessor={frameProcessor}
            photo={true}
            audio={false}
            enableDepthData={true}
            isActive={isFocused && appState.current === 'active'}
            enableZoomGesture={true}
            includeBase64={true}
            format={format}
          />
          <Canvas style={StyleSheet.absoluteFill}>
            <Rect
              x={boxLeft}
              y={boxTop}
              width={boxSize}
              height={boxSize}
              color={boxColor}
              style="stroke"
              strokeWidth={2}
            />
            {detectedObjects.map((box, index) => (
              <Rect
                key={index}
                x={wp(`${box.left * 100}%`)}
                y={hp(`${box.top * 100}%`)}
                width={wp(`${box.width * 100}%`)}
                height={hp(`${box.height * 100}%`)}
                color="red"
                style="stroke"
                strokeWidth={2}
              />
            ))}
          </Canvas>
        </>
      ) : (
        <Text>Loading Camera....</Text>
      )}
      <CameraFooter isCamera={true} />
      <LoadingIndicator isLoading={objectDetection.state === 'loading'} />
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
    </View>
  );
};

export default Working_Object_Detection;
