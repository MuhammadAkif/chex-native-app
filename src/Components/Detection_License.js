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
import {Canvas, Rect} from '@shopify/react-native-skia';

import {BackArrow} from '../Assets/Icons';
import {PHYSICAL_DEVICES} from '../Constants';
import {colors, PreviewStyles} from '../Assets/Styles';
import {CameraFooter, LoadingIndicator} from './index';
import {Models} from '../Assets/AI_Models';

const Detection_License = ({navigation}) => {
  const isFocused = useIsFocused();
  const {resize} = useResizePlugin();
  const cameraRef = useRef();
  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {physicalDevices: PHYSICAL_DEVICES});
  const format = useCameraFormat(device, [
    {videoResolution: {width: 320, height: 320}},
    {photoResolution: {width: 320, height: 320}},
  ]);
  const [model, setModel] = useState(null);
  // const objectDetection = useTensorflowModel(Models.model_Five);
  // const objectDetection = useTensorflowModel(Models.model_Five, 'android-gpu');
  // or
  //   const objectDetection = await loadTensorflowModel(Models.model_Five, 'nnapi')

  const [detectedObjects, setDetectedObjects] = useState([]);
  const [noDetectionFrames, setNoDetectionFrames] = useState(0);
  const lastTimeRef = useRef(0);
  async function initialModel() {
    const objectDetection = await loadTensorflowModel(
      Models.model_Five,
      'nnapi',
    );
    console.log({objectDetection});
    setModel(objectDetection);
  }

  useEffect(() => {
    initialModel();
  }, []);

  useEffect(() => {
    if (noDetectionFrames > 10) {
      setDetectedObjects([]);
      setNoDetectionFrames(0);
    }
  }, [noDetectionFrames]);

  const handleOutput = useRunOnJS((output = []) => {
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
        console.log('model is null');

        return;
      }
      let detected_Objects = [];

      const currentTime = Date.now();
      if (currentTime - lastTimeRef.current < 1000) {
        handleOutput().then();
        // Skip processing if less than 1 second has passed
        detected_Objects = [];
        return;
      }
      lastTimeRef.current = currentTime;

      console.log('running!!');
      const resized = resize(frame, {
        scale: {
          width: 320,
          height: 320,
        },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      });

      const outputs = model.runSync([resized]);
      const [
        detection_scores,
        detection_boxes,
        detection_classes,
        num_detections,
      ] = outputs;

      for (let i = 0; i < detection_boxes.length; i += 4) {
        const confidence = detection_scores[i / 4];
        if (confidence > 0.6) {
          console.log('Matched!!');
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

export default Detection_License;
