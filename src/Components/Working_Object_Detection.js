import React, {useRef, useState, useEffect} from 'react';
import {StatusBar, View, StyleSheet, AppState, Text} from 'react-native';
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
import {Svg, Rect} from 'react-native-svg';

import {PHYSICAL_DEVICES} from '../Constants';
import {colors, PreviewStyles} from '../Assets/Styles';
import {LoadingIndicator} from './index';
import {Models} from '../Assets/AI_Models';
import {isObjectInCenter} from '../Utils';

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
  const [noDetectionFrames, setNoDetectionFrames] = useState(0);

  // Add state for center box
  const [centerBoxColor, setCenterBoxColor] = useState('white');
  const {model_One} = Models;
  const {deepGreen, white} = colors;

  // AI Model initialization
  const objectDetection = useTensorflowModel(model_One);
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  useEffect(() => {
    if (noDetectionFrames > 10) {
      setDetectedObjects([]);
      setNoDetectionFrames(0);
    }
  }, [noDetectionFrames]);

  // Helper function to check if object is in center and completely inside the frame

  // Logic to handle frame detection
  const handleOutput = useRunOnJS(output => {
    if (output.length > 0) {
      setDetectedObjects(output);
      setNoDetectionFrames(0); // Reset no detection frames

      // Check if any object is inside the center box
      const centerObject = output.find(obj => isObjectInCenter(obj));
      setCenterBoxColor(centerObject ? deepGreen : white);
    } else {
      setNoDetectionFrames(prev => prev + 1);
      setCenterBoxColor(white); // Reset box color when no objects are detected
    }
  }, []);

  // Update frameProcessor
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
      const [
        detection_boxes,
        detection_classes,
        detection_scores,
        num_detections,
      ] = outputs;

      // Collect detected objects to render bounding boxes
      const detected_Objects = [];
      for (let i = 0; i < detection_boxes.length; i += 4) {
        const confidence = detection_scores[i / 4];
        if (confidence > 0.7) {
          detected_Objects.push({
            left: detection_boxes[i],
            top: detection_boxes[i + 1],
            right: detection_boxes[i + 2],
            bottom: detection_boxes[i + 3],
          });
        }
      }

      handleOutput(detected_Objects).then();
    },
    [model],
  );

  return (
    <View style={PreviewStyles.container}>
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
          <Svg style={StyleSheet.absoluteFill}>
            {detectedObjects.map((obj, index) => (
              <Rect
                key={index}
                x={obj.left * 100 + '%'}
                y={obj.top * 100 + '%'}
                width={(obj.right - obj.left) * 100 + '%'}
                height={(obj.bottom - obj.top) * 100 + '%'}
                strokeWidth="2"
                stroke="red"
                fillOpacity="0"
              />
            ))}
            <Rect
              x="10%"
              y="25%"
              width="80%"
              height="50%"
              strokeWidth="2"
              stroke={centerBoxColor}
              fillOpacity="0"
            />
          </Svg>
        </>
      ) : (
        <Text>Loading Camera....</Text>
      )}
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
