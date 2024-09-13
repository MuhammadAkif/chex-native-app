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

import {PHYSICAL_DEVICES} from '../../Constants';
import {PreviewStyles} from '../../Assets/Styles';
import {LoadingIndicator} from '../index';
import {Models} from '../../Assets/AI_Models';

const License_Plate_Detection = ({navigation}) => {
  const isFocused = useIsFocused();
  const {resize} = useResizePlugin();
  const cameraRef = useRef();
  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {physicalDevices: PHYSICAL_DEVICES});

  // State to manage detected objects and box color
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [noDetectionFrames, setNoDetectionFrames] = useState(0);
  const [frameSize, setFrameSize] = useState({
    height: 320,
    width: 320,
  });

  // Add state for center box
  const {model_One, model_Two, model_Three} = Models;

  const objectDetection = useTensorflowModel(model_Two);
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : null;
  const format = useCameraFormat(device, [
    {videoResolution: {width: frameSize.width, height: frameSize.height}},
    {fps: 30},
  ]);
  useEffect(() => {
    if (model) {
      const [_, height, width, __] = model?.inputs[0].shape;
      setFrameSize({height: height, width: width});
    }
  }, [model]);

  useEffect(() => {
    if (noDetectionFrames > 10) {
      setDetectedObjects([]);
      setNoDetectionFrames(0);
    }
  }, [noDetectionFrames]);

  // Logic to handle frame detection
  const handleOutput = useRunOnJS((output = null) => {
    const processedBoxes = postProcess(output[0]);
    if (processedBoxes.length > 0) {
      setDetectedObjects(processedBoxes);
      setNoDetectionFrames(0);
    } else {
      setNoDetectionFrames(prev => prev + 1);
    }
  }, []);

  // Update frameProcessor
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (model == null) {
        return;
      }

      // 1. Resize frame (already done)
      const resized = resize(frame, {
        scale: {
          width: frameSize.width,
          height: frameSize.height,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
      });

      // 2. Run model with given input buffer synchronously
      const outputs = model.runSync([resized]);

      handleOutput(outputs).then();
    },
    [model],
  );

  // Post-processing function
  function postProcess(output = null) {
    const CONFIDENCE_THRESHOLD = 0.3;
    const IOU_THRESHOLD = 0.5;
    const NUM_CLASSES = 1; // Adjust based on your model
    const NUM_BOXES = Object.keys(output).length / (5 + NUM_CLASSES);

    let boxes = [];
    for (let i = 0; i < NUM_BOXES; i++) {
      const baseIndex = i * (5 + NUM_CLASSES);
      const confidence = output[baseIndex + 4];
      if (confidence > CONFIDENCE_THRESHOLD) {
        console.log('Matches!!!');
        const cx = output[baseIndex];
        const cy = output[baseIndex + 1];
        const w = output[baseIndex + 2];
        const h = output[baseIndex + 3];
        const x1 = cx - w / 2;
        const y1 = cy - h / 2;
        const x2 = cx + w / 2;
        const y2 = cy + h / 2;

        if (
          x1 >= 0 &&
          x1 <= 1 &&
          y1 >= 0 &&
          y1 <= 1 &&
          x2 >= 0 &&
          x2 <= 1 &&
          y2 >= 0 &&
          y2 <= 1
        ) {
          boxes.push({x1, y1, x2, y2, confidence});
        }
      }
    }

    // Apply Non-Maximum Suppression (NMS)
    return applyNMS(boxes, IOU_THRESHOLD);
  }

  // Non-Maximum Suppression function
  const applyNMS = (boxes, iouThreshold) => {
    'worklet';
    boxes.sort((a, b) => b.confidence - a.confidence);
    const selectedBoxes = [];

    while (boxes.length > 0) {
      const firstBox = boxes.shift();
      selectedBoxes.push(firstBox);

      boxes = boxes.filter(box => calculateIoU(firstBox, box) < iouThreshold);
    }

    return selectedBoxes;
  };

  // IoU calculation function
  const calculateIoU = (box1, box2) => {
    'worklet';
    const x1 = Math.max(box1.x1, box2.x1);
    const y1 = Math.max(box1.y1, box2.y1);
    const x2 = Math.min(box1.x2, box2.x2);
    const y2 = Math.min(box1.y2, box2.y2);
    const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const box1Area = (box1.x2 - box1.x1) * (box1.y2 - box1.y1);
    const box2Area = (box2.x2 - box2.x1) * (box2.y2 - box2.y1);
    return intersectionArea / (box1Area + box2Area - intersectionArea);
  };

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
                x={obj.x1 * 100 + '%'}
                y={obj.y1 * 100 + '%'}
                width={(obj.x2 - obj.x1) * 100 + '%'}
                height={(obj.y2 - obj.y1) * 100 + '%'}
                strokeWidth="2"
                stroke="red"
                fillOpacity="0"
              />
            ))}
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

export default License_Plate_Detection;
