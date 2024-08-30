import React, {useRef} from 'react';
import {useTensorflowModel} from 'react-native-fast-tflite';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useFrameProcessor} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
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
import {useResizePlugin} from 'vision-camera-resize-plugin';

import {BackArrow} from '../Assets/Icons';
import {PHYSICAL_DEVICES} from '../Constants';
import {colors, PreviewStyles} from '../Assets/Styles';
import {CameraFooter} from './index';
import {Models} from '../Assets/AI_Models';
import LoadingIndicator from './LoadingIndicator';

const Object_Detection = ({navigation}) => {
  const isFocused = useIsFocused();
  const {resize} = useResizePlugin();
  const cameraRef = useRef();

  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {
    physicalDevices: PHYSICAL_DEVICES,
  });
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);

  //AI Model initialization
  //This is working, it detects any object
  const objectDetection = useTensorflowModel(Models.model_One);
  //This model is for detecting license plate
  // const objectDetection = useTensorflowModel(Models.model_Three);

  //AI Model initialization status check
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  //This processor is for license plate detecting
  const license_frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (model == null) {
        console.error('Model is not loaded.');
        return;
      }
      try {
        const resized = resize(frame, {
          scale: {
            width: 640,
            height: 640,
          },
          pixelFormat: 'rgb',
          dataType: 'float32',
        });

        // 2. Run the model with the properly formatted input buffer synchronously
        const outputs = model?.runSync([resized]);
        console.log('length:: ', outputs[0]);

        let detection_boxes = outputs[0];

        // Convert detection_boxes to an array if it's an object
        if (detection_boxes && typeof detection_boxes === 'object') {
          detection_boxes = Object.values(detection_boxes);
        }

        if (!Array.isArray(detection_boxes)) {
          console.error(
            'detection_boxes is not properly formatted:',
            detection_boxes,
          );
          return;
        }

        // console.log('Parsed detection_boxes:', detection_boxes.slice(0, 20));

        // Interpret parsed detection_boxes
        const numElementsPerDetection = 5; // Adjust if necessary: x, y, w, h, confidence

        // const numDetections = detection_boxes.length / numElementsPerDetection;
        // console.log(`Detected ${numDetections} potential objects.`);
        const confidence = Object.values(outputs[0]);
        // Parse detection boxes and confidence scores
        for (
          let i = 0;
          i < detection_boxes.length;
          i += numElementsPerDetection
        ) {
          // const [left, top, right, bottom, confidence] = detection_boxes.slice(
          //   i,
          //   i + numElementsPerDetection,
          // );

          if (confidence > 0.7) {
            console.log('Matches!!!');
          }
        }
      } catch (error) {
        console.error('Frame Processor Error:', error);
      }
    },
    [model],
  );

  //This frame processor is working to detect any object model
  const object_frameProcessor_Working = useFrameProcessor(
    frame => {
      'worklet';
      if (model == null) {
        return;
      }
      const resized = resize(frame, {
        scale: {
          width: 192,
          height: 192,
        },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      });

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
          console.log('Matched!!!');
          const left = detection_boxes[i];
          const top = detection_boxes[i + 1];
          const right = detection_boxes[i + 2];
          const bottom = detection_boxes[i + 3];
        }
      }
    },
    [model],
  );
  /*const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (model == null) {
        return;
      }

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
      const {length} = outputs;
      console.log('length: ', outputs[2]);

      // 3. Interpret outputs accordingly
      const detection_boxes = outputs[0];
      const detection_scores = outputs[2];
      const num_detections = outputs[3];
      // console.log(`Detected ${num_detections[0]} objects!`);

      // Prepare an array to hold detected rectangles
      const rects = [];

      for (let i = 0; i < detection_boxes.length; i += 4) {
        const confidence = detection_scores[i / 4];
        if (confidence > 0.7) {
          // Extract the box coordinates
          const left = detection_boxes[i];
          const top = detection_boxes[i + 1];
          const right = detection_boxes[i + 2];
          const bottom = detection_boxes[i + 3];

          // Push the rect coordinates to the array
          // rects.push({left, top, width: right - left, height: bottom - top});
          console.log('I am matched !!!');
        }
      }

      // Update the detected rectangles state
      // runOnJS(() => handleUpdate(rects));
    },
    [model],
  );*/

  return (
    <View style={PreviewStyles.container}>
      <LoadingIndicator isLoading={objectDetection.state === 'loading'} />
      {device ? (
        <>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            frameProcessor={object_frameProcessor_Working}
            photo={true}
            audio={false}
            enableDepthData={true}
            isActive={isFocused && appState.current === 'active'}
            enableZoomGesture={true}
            includeBase64={true}
            format={format}
          />
        </>
      ) : (
        <Text>Loading Camera....</Text>
      )}
      <View style={PreviewStyles.headerContainer}>
        <TouchableOpacity>
          <BackArrow height={hp('8%')} width={wp('8%')} color={colors.white} />
        </TouchableOpacity>
      </View>
      <CameraFooter isCamera={true} />
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
    </View>
  );
};
export default Object_Detection;
