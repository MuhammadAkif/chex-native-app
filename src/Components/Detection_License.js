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
import {CameraFooter, LoadingIndicator} from './index';
import {Models} from '../Assets/AI_Models';
import {useRunOnJS} from 'react-native-worklets-core';

const Detection_License = ({navigation}) => {
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
  // const objectDetection = useTensorflowModel(Models.model_One);
  //This model is for detecting license plate
  const objectDetection = useTensorflowModel(Models.model_Three);

  //AI Model initialization status check
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  let show = true;
  const sayHello = useRunOnJS(output => {
    if (show) {
      const length = output[0];
      console.log({length});
      show = false;
    }
  }, []);
  //This processor is for license plate detecting
  /*const license_frameProcessor = useFrameProcessor(
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
        console.log(Array.isArray(resized));

        // 2. Run the model with the properly formatted input buffer synchronously
        const outputs = model?.runSync([resized]);

        if (outputs?.length > 0) {
          const outputTensor = outputs[0];

          // Convert the output to a format where we can find the max value
          const outputEntries = Object.entries(outputTensor);
          if (outputEntries?.length > 0) {
            // Find the entry with the highest probability
            const [maxIndex, maxProbability] = outputEntries?.reduce(
              (maxEntry, currentEntry) =>
                currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry,
            );

            console.log(`Predicted class index: ${maxIndex}`);
            console.log(`Confidence: ${maxProbability}`);
          }
        } else {
          console.log('No outputs returned from the model.');
        }
      } catch (error) {
        console.error('Frame Processor Error:', error);
      }
    },
    [model],
  );*/
  const license_frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (model == null) {
        console.error('Model is not loaded.');
        return;
      }
      // Resize the frame to 640x640 and convert to float32
      // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
      const resized = resize(frame, {
        scale: {
          width: 190,
          height: 190,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
      });

      // 2. Run model with given input buffer synchronously
      const outputs = model.runSync([resized]);
      sayHello(outputs).then();
      /* // 3. Interpret outputs accordingly
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
          }
        }*/
    },
    [model],
  );
  return (
    <View style={PreviewStyles.container}>
      <LoadingIndicator isLoading={objectDetection.state === 'loading'} />
      {device ? (
        <>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            frameProcessor={license_frameProcessor}
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
export default Detection_License;
