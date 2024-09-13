import React, {useRef, useState, useEffect} from 'react';
import {StatusBar, View, StyleSheet, AppState, Text} from 'react-native';
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
import {Canvas, Rect} from '@shopify/react-native-skia';

import {PHYSICAL_DEVICES} from '../../Constants';
import {PreviewStyles} from '../../Assets/Styles';
import {LoadingIndicator} from '../index';
import {Models} from '../../Assets/AI_Models';

const YoloV8_Model = ({navigation}) => {
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

  // AI Model initialization
  const objectDetection = useTensorflowModel(Models.model_Three);
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  useEffect(() => {
    if (noDetectionFrames > 10) {
      setDetectedObjects([]);
      setNoDetectionFrames(0);
    }
  }, [noDetectionFrames]);

  // Logic to handle frame detection
  const handleOutput = useRunOnJS(output => {
    if (output.length > 0) {
      setDetectedObjects(output);
      setNoDetectionFrames(0); // Reset no detection frames
    } else {
      setNoDetectionFrames(prev => prev + 1);
    }
  }, []);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (model == null) {
        return;
      }

      // 1. Resize frame to 640x640x3 for YOLOv8
      const resized = resize(frame, {
        scale: {
          width: 640,
          height: 640,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
      });

      // 2. Run model with given input buffer synchronously
      const outputs = model.runSync([resized]);

      // 3. Interpret YOLOv8 output
      const detections = outputs[0]; // Single object with ~535500 entries
      const detected_Objects = [];

      const num_boxes = 8400; // YOLOv8 typically outputs 8400 boxes
      const box_data_length = 64; // 4 for box coordinates, 60 for class probabilities

      for (let i = 0; i < num_boxes; i++) {
        const base_index = i * box_data_length;

        // Extract box coordinates
        const x = detections[base_index.toString()];
        const y = detections[(base_index + 1).toString()];
        const w = detections[(base_index + 2).toString()];
        const h = detections[(base_index + 3).toString()];

        // Find the maximum class probability
        let max_class_prob = 0;
        for (let j = 4; j < box_data_length; j++) {
          const class_prob = detections[(base_index + j).toString()];
          if (class_prob > max_class_prob) {
            max_class_prob = class_prob;
          }
        }

        // Use the maximum class probability as confidence
        if (max_class_prob > 0.5) {
          // Adjust threshold as needed
          console.log('Detected object:', {
            x,
            y,
            w,
            h,
            confidence: max_class_prob,
          });
          detected_Objects.push({
            left: x,
            top: y,
            width: w,
            height: h,
            confidence: max_class_prob,
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
      <LoadingIndicator isLoading={objectDetection.state === 'loading'} />
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
    </View>
  );
};

export default YoloV8_Model;
