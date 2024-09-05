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

  const objectDetection = useTensorflowModel(Models.model_Twelve);
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  const [detectedObjects, setDetectedObjects] = useState([]);
  const [noDetectionFrames, setNoDetectionFrames] = useState(0);
  const [lastProcessedTime, setLastProcessedTime] = useState(0); // New state to keep track of time
  const currentTime = Date.now();

  useEffect(() => {
    if (noDetectionFrames > 10) {
      setDetectedObjects([]);
      setNoDetectionFrames(0);
    }
  }, [noDetectionFrames]);

  const handleOutput = useRunOnJS(output => {
    if (output.length > 0) {
      setDetectedObjects(output);
      setNoDetectionFrames(0); // Reset no detection frames
    } else {
      setNoDetectionFrames(prev => prev + 1);
    }
  }, []);
  const handleTimeTrack = useRunOnJS(() => {
    console.log('----------');
    console.log({currentTime, lastProcessedTime});
    console.log(currentTime - lastProcessedTime < 1000);
    if (currentTime - lastProcessedTime < 1000) {
      console.log('returning************');
      // Skip processing if the last processed frame was less than 1 second ago
      return;
    }
    console.log('running');
    setLastProcessedTime(prevState => currentTime); // Update the last processed time
  }, []);
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (model == null || currentTime - lastProcessedTime < 1000) {
        console.log('returning--------');
        return;
      }
      handleTimeTrack().then();

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
      const detected_Objects = [];

      for (let i = 0; i < detection_boxes.length; i += 4) {
        const confidence = detection_scores[i / 4];
        if (confidence > 0.5) {
          console.log('Matched!!');
          console.log({confidence});
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
    [model, lastProcessedTime], // Add lastProcessedTime to dependencies
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

// import React, {useRef, useState, useEffect} from 'react';
// import {
//   StatusBar,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   AppState,
//   Text,
// } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {useTensorflowModel} from 'react-native-fast-tflite';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraFormat,
// } from 'react-native-vision-camera';
// import {useFrameProcessor} from 'react-native-vision-camera';
// import {useIsFocused} from '@react-navigation/native';
// import {useResizePlugin} from 'vision-camera-resize-plugin';
// import {useRunOnJS} from 'react-native-worklets-core';
// import {Canvas, Rect} from '@shopify/react-native-skia';
//
// import {BackArrow} from '../Assets/Icons';
// import {PHYSICAL_DEVICES} from '../Constants';
// import {colors, PreviewStyles} from '../Assets/Styles';
// import {CameraFooter, LoadingIndicator} from './index';
// import {Models} from '../Assets/AI_Models';
//
// const Detection_License = ({navigation}) => {
//   const isFocused = useIsFocused();
//   const {resize} = useResizePlugin();
//   const cameraRef = useRef();
//   const appState = useRef(AppState.currentState);
//   const device = useCameraDevice('back', {physicalDevices: PHYSICAL_DEVICES});
//   const format = useCameraFormat(device, [
//     {videoResolution: {width: 320, height: 320}},
//     {photoResolution: {width: 320, height: 320}},
//   ]);
//
//   const objectDetection = useTensorflowModel(Models.model_Twelve);
//
//   const model =
//     objectDetection.state === 'loaded' ? objectDetection.model : undefined;
//
//   const [detectedObjects, setDetectedObjects] = useState([]);
//   const [noDetectionFrames, setNoDetectionFrames] = useState(0);
//
//   useEffect(() => {
//     if (noDetectionFrames > 10) {
//       setDetectedObjects([]);
//       setNoDetectionFrames(0);
//     }
//   }, [noDetectionFrames]);
//   const handleOutput = useRunOnJS(output => {
//     if (output.length > 0) {
//       setDetectedObjects(output);
//       setNoDetectionFrames(0); // Reset no detection frames
//     } else {
//       setNoDetectionFrames(prev => prev + 1);
//     }
//   }, []);
//
//   const frameProcessor = useFrameProcessor(
//     frame => {
//       'worklet';
//       if (model == null) {
//         return;
//       }
//
//       const resized = resize(frame, {
//         scale: {
//           width: 320,
//           height: 320,
//         },
//         pixelFormat: 'rgb',
//         dataType: 'uint8',
//       });
//
//       const outputs = model.runSync([resized]);
//       const [
//         detection_scores,
//         detection_boxes,
//         detection_classes,
//         num_detections,
//       ] = outputs;
//       const detected_Objects = [];
//
//       for (let i = 0; i < detection_boxes.length; i += 4) {
//         const confidence = detection_scores[i / 4];
//         if (confidence > 0.5) {
//           console.log('Matched!!');
//           console.log({confidence});
//           const left = detection_boxes[i];
//           const top = detection_boxes[i + 1];
//           const right = detection_boxes[i + 2];
//           const bottom = detection_boxes[i + 3];
//
//           detected_Objects.push({
//             left,
//             top,
//             width: right - left,
//             height: bottom - top,
//           });
//         }
//       }
//
//       handleOutput(detected_Objects).then();
//     },
//     [model],
//   );
//
//   return (
//     <View style={PreviewStyles.container}>
//       <View style={PreviewStyles.headerContainer}>
//         <TouchableOpacity>
//           <BackArrow height={hp('8%')} width={wp('8%')} color={colors.white} />
//         </TouchableOpacity>
//       </View>
//       {device ? (
//         <>
//           <Camera
//             ref={cameraRef}
//             style={StyleSheet.absoluteFill}
//             device={device}
//             frameProcessor={frameProcessor}
//             photo={true}
//             audio={false}
//             enableDepthData={true}
//             isActive={isFocused && appState.current === 'active'}
//             enableZoomGesture={true}
//             includeBase64={true}
//             format={format}
//           />
//           <Canvas style={StyleSheet.absoluteFill}>
//             {detectedObjects.map((box, index) => (
//               <Rect
//                 key={index}
//                 x={wp(`${box.left * 100}%`)}
//                 y={hp(`${box.top * 100}%`)}
//                 width={wp(`${box.width * 100}%`)}
//                 height={hp(`${box.height * 100}%`)}
//                 color="red"
//                 style="stroke"
//                 strokeWidth={2}
//               />
//             ))}
//           </Canvas>
//         </>
//       ) : (
//         <Text>Loading Camera....</Text>
//       )}
//       <CameraFooter isCamera={true} />
//       <LoadingIndicator isLoading={objectDetection.state === 'loading'} />
//       <StatusBar
//         backgroundColor="transparent"
//         barStyle="light-content"
//         translucent={true}
//       />
//     </View>
//   );
// };
//
// export default Detection_License;

// import React, {useRef, useState, useEffect} from 'react';
// import {
//   StatusBar,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   AppState,
//   Text,
//   Dimensions,
// } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {useTensorflowModel} from 'react-native-fast-tflite';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraFormat,
// } from 'react-native-vision-camera';
// import {useFrameProcessor} from 'react-native-vision-camera';
// import {useIsFocused} from '@react-navigation/native';
// import {useResizePlugin} from 'vision-camera-resize-plugin';
// import {useRunOnJS} from 'react-native-worklets-core';
//
// import {BackArrow} from '../Assets/Icons';
// import {PHYSICAL_DEVICES} from '../Constants';
// import {colors, PreviewStyles} from '../Assets/Styles';
// import {CameraFooter, LoadingIndicator} from './index';
// import {Models} from '../Assets/AI_Models';
// import {Canvas, Rect} from '@shopify/react-native-skia';
//
// const Detection_License = ({navigation}) => {
//   const isFocused = useIsFocused();
//   const {resize} = useResizePlugin();
//   const cameraRef = useRef();
//   const appState = useRef(AppState.currentState);
//   const device = useCameraDevice('back', {physicalDevices: PHYSICAL_DEVICES});
//   const format = useCameraFormat(device, [
//     {videoResolution: {width: 1280, height: 720}},
//     {fps: 30},
//   ]);
//
//   // AI Model initialization
//   // const objectDetection = useTensorflowModel(Models.model_One);
//   const objectDetection = useTensorflowModel(Models.model_Twelve);
//
//   // AI Model initialization status check
//   const model =
//     objectDetection.state === 'loaded' ? objectDetection.model : undefined;
//
//   // State to manage detected objects
//   const [detectedObjects, setDetectedObjects] = useState([]);
//   const [noDetectionFrames, setNoDetectionFrames] = useState(0);
//
//   useEffect(() => {
//     if (noDetectionFrames > 10) {
//       setDetectedObjects([]);
//       setNoDetectionFrames(0);
//     }
//   }, [noDetectionFrames]);
//   // Logic to handle frame detection
//   const handleOutput = useRunOnJS(output => {
//     if (output.length > 0) {
//       setDetectedObjects(output);
//       setNoDetectionFrames(0); // Reset no detection frames
//     } else {
//       setNoDetectionFrames(prev => prev + 1);
//     }
//   }, []);
//
//   // const frameProcessor = useFrameProcessor(
//   //   frame => {
//   //     'worklet';
//   //     if (model == null) {
//   //       return;
//   //     }
//   //
//   //     // Resize frame to match the model's input dimensions
//   //     const resized = resize(frame, {
//   //       scale: {
//   //         width: 320,
//   //         height: 320,
//   //       },
//   //       pixelFormat: 'rgb',
//   //       dataType: 'float32',
//   //     });
//   //     // Run model with the resized input buffer synchronously
//   //     const outputs = model.runSync([resized]);
//   //     console.log('Is Array: ', Array.isArray(outputs));
//   //     console.log('Length of output: ', outputs.length);
//   //     console.log('Array element type at 0 index: ', typeof outputs[0]);
//   //     console.log(
//   //       'Length of Array element type at 0 index: ',
//   //       Object.keys(outputs[0]).length,
//   //     );
//   //     // Assuming outputs[0] is an object containing the tensor data
//   //     const tensorData = outputs[0]; // The tensor data
//   //     const tensorArray = Object.values(tensorData).flat(); // Flatten the tensor data into a single array
//   //
//   //     // Reshape tensorArray to [1, 6300, 85]
//   //     const detections = [];
//   //     for (let i = 0; i < 6300; i++) {
//   //       const startIndex = i * 85;
//   //       const endIndex = startIndex + 85;
//   //       const detection = tensorArray.slice(startIndex, endIndex);
//   //
//   //       const bbox = detection.slice(0, 4); // Bounding box coordinates
//   //       const confidence = detection[4]; // Confidence score
//   //       const classProbabilities = detection.slice(5); // Class probabilities
//   //
//   //       if (confidence > 0.7) {
//   //         // Filter by confidence threshold
//   //         const [ymin, xmin, ymax, xmax] = bbox;
//   //
//   //         detections.push({
//   //           left: xmin,
//   //           top: ymin,
//   //           width: xmax - xmin,
//   //           height: ymax - ymin,
//   //         });
//   //       }
//   //     }
//   //
//   //     // Update state with detected objects if any are found
//   //     handleOutput(detections).then();
//   //   },
//   //   [model],
//   // );
//   let showOutput = true;
//   const printOutPut = useRunOnJS(output => {
//     if (showOutput) {
//       console.log({output});
//       showOutput = false;
//     }
//   }, []);
//   const frameProcessor = useFrameProcessor(
//     frame => {
//       'worklet';
//       if (model == null) {
//         return;
//       }
//
//       // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
//       const resized = resize(frame, {
//         scale: {
//           width: 192,
//           height: 192,
//         },
//         pixelFormat: 'rgb',
//         dataType: 'uint8',
//       });
//
//       // 2. Run model with given input buffer synchronously
//       const outputs = model.runSync([resized]);
//       // const [
//       //   detection_boxes,
//       //   detection_classes,
//       //   detection_scores,
//       //   num_detections,
//       // ] = outputs;
//       const [
//         detection_scores,
//         detection_boxes,
//         detection_classes,
//         num_detections,
//       ] = outputs;
//       console.log({
//         num_detections,
//         detection_boxes,
//         detection_classes,
//         detection_scores,
//       });
//       // console.log({detection_boxes, detection_scores});
//       // Collect detected objects to render bounding boxes
//       const detected_Objects = [];
//
//       for (let i = 0; i < detection_boxes.length; i += 4) {
//         const confidence = detection_scores[i / 4];
//         console.log({confidence});
//         if (confidence > 0.7) {
//           console.log('Matched!!');
//           const left = detection_boxes[i];
//           const top = detection_boxes[i + 1];
//           const right = detection_boxes[i + 2];
//           const bottom = detection_boxes[i + 3];
//           // console.log({detection_boxes, detection_scores});
//
//           // Save detected object details
//           detected_Objects.push({
//             left,
//             top,
//             width: right - left,
//             height: bottom - top,
//           });
//         }
//       }
//
//       // Update state with detected objects if any are found
//       handleOutput(detected_Objects).then();
//     },
//     [model],
//   );
//
//   return (
//     <View style={PreviewStyles.container}>
//       <View style={PreviewStyles.headerContainer}>
//         <TouchableOpacity>
//           <BackArrow height={hp('8%')} width={wp('8%')} color={colors.white} />
//         </TouchableOpacity>
//       </View>
//       {device ? (
//         <>
//           <Camera
//             ref={cameraRef}
//             style={StyleSheet.absoluteFill}
//             device={device}
//             frameProcessor={frameProcessor}
//             photo={true}
//             audio={false}
//             enableDepthData={true}
//             isActive={isFocused && appState.current === 'active'}
//             enableZoomGesture={true}
//             includeBase64={true}
//             format={format}
//           />
//           <Canvas style={StyleSheet.absoluteFill}>
//             {detectedObjects.map((box, index) => (
//               <Rect
//                 key={index}
//                 x={wp(`${box.left * 100}%`)}
//                 y={hp(`${box.top * 100}%`)}
//                 width={wp(`${box.width * 100}%`)}
//                 height={hp(`${box.height * 100}%`)}
//                 color="red"
//                 style="stroke"
//                 strokeWidth={2}
//               />
//             ))}
//           </Canvas>
//         </>
//       ) : (
//         <Text>Loading Camera....</Text>
//       )}
//       <CameraFooter isCamera={true} />
//       <LoadingIndicator isLoading={objectDetection.state === 'loading'} />
//       <StatusBar
//         backgroundColor="transparent"
//         barStyle="light-content"
//         translucent={true}
//       />
//     </View>
//   );
// };
//
// export default Detection_License;
