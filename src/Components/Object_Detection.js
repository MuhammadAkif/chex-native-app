// import React, {useRef, useEffect, useState} from 'react';
// import {useTensorflowModel} from 'react-native-fast-tflite';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraFormat,
// } from 'react-native-vision-camera';
// import {useFrameProcessor} from 'react-native-vision-camera';
// import {useIsFocused} from '@react-navigation/native';
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
// import {useResizePlugin} from 'vision-camera-resize-plugin';
// import {BackArrow} from '../Assets/Icons';
// import {PHYSICAL_DEVICES} from '../Constants';
// import {colors, PreviewStyles} from '../Assets/Styles';
// import {CameraFooter} from './index';
// import {useCanvasRef} from '@shopify/react-native-skia';
// import {Models} from '../Assets/AI_Models';
// import LoadingIndicator from './LoadingIndicator';
// const Object_Detection = ({navigation}) => {
//   const isFocused = useIsFocused();
//   const {resize} = useResizePlugin();
//   const cameraRef = useRef();
//   const [boundingBoxes, setBoundingBoxes] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const appState = useRef(AppState.currentState);
//   const device = useCameraDevice('back', {
//     physicalDevices: PHYSICAL_DEVICES,
//   });
//   const format = useCameraFormat(device, [
//     {videoResolution: {width: 1280, height: 720}},
//     {fps: 1},
//   ]);
//   // AI Model initialization
//   const objectDetection = useTensorflowModel(Models.model_Three);
//   const model =
//     objectDetection.state === 'loaded' ? objectDetection.model : undefined;
//   const frameProcessor = useFrameProcessor(
//     async frame => {
//       'worklet';
//       console.log('i am starting');
//       if (model === null) {
//         return;
//       }
//       // setIsProcessing(true);
//       try {
//         const resized = resize(frame, {
//           scale: {
//             width: 640,
//             height: 640,
//           },
//           pixelFormat: 'rgb',
//           dataType: 'float32',
//         });
//         // if (!resized) {
//         //   console.error('Resized frame is undefined or not valid.');
//         //   setIsProcessing(false);
//         //   return;
//         // }
//         const outputs = model.runSync([resized]);
//         console.log('i have output', {outputs});
//         // if (!outputs || !Array.isArray(outputs) || outputs.length === 0) {
//         //   console.error(
//         //     'Model outputs are not in the expected format:',
//         //     outputs,
//         //   );
//         //   setIsProcessing(false);
//         //   return;
//         // }
//         const detection_boxes = outputs[0];
//         const parsedBoxes = [];
//         const numElementsPerDetection = 5; // x, y, w, h, confidence
//         for (
//           let i = 0;
//           i < detection_boxes.length;
//           i += numElementsPerDetection
//         ) {
//           const [x, y, w, h, confidence] = detection_boxes.slice(
//             i,
//             i + numElementsPerDetection,
//           );
//           if (confidence > 0.7) {
//             parsedBoxes.push({x, y, w, h});
//             console.log('I have found match!!');
//           }
//         }
//         // setBoundingBoxes(parsedBoxes);
//       } catch (error) {
//         console.error('Frame Processor Error:', error);
//       } finally {
//         // setIsProcessing(false);
//       }
//     },
//     [model],
//   );
//   const renderBoundingBoxes = () => {
//     return boundingBoxes.map((box, index) => (
//       <View
//         key={index}
//         style={{
//           position: 'absolute',
//           left: box.x * wp('100%'), // Adjust these multipliers according to your screen and model
//           top: box.y * hp('100%'),
//           width: box.w * wp('100%'),
//           height: box.h * hp('100%'),
//           borderColor: 'red',
//           borderWidth: 2,
//         }}
//       />
//     ));
//   };
//   return (
//     <View style={PreviewStyles.container}>
//       <LoadingIndicator isLoading={objectDetection.state === 'loading'} />
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
//             format={format}
//           />
//           {renderBoundingBoxes()}
//         </>
//       ) : (
//         <Text>Loading Camera....</Text>
//       )}
//       <View style={PreviewStyles.headerContainer}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <BackArrow height={hp('8%')} width={wp('8%')} color={colors.white} />
//         </TouchableOpacity>
//       </View>
//       <CameraFooter isCamera={true} />
//       <StatusBar
//         backgroundColor="transparent"
//         barStyle="light-content"
//         translucent={true}
//       />
//     </View>
//   );
// };
// export default Object_Detection;
import React, {useRef, useEffect, useState} from 'react';
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
  Dimensions,
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
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {
    physicalDevices: PHYSICAL_DEVICES,
  });
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 1},
  ]);
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  // AI Model initialization
  const objectDetection = useTensorflowModel(Models.model_Three);
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;
  const frameProcessor = useFrameProcessor(
    async frame => {
      'worklet';
      if (!model || isProcessing) {
        return;
      }
      setIsProcessing(true);
      try {
        const resized = resize(frame, {
          scale: {
            width: 640,
            height: 640,
          },
          pixelFormat: 'rgb',
          dataType: 'float32',
        });
        if (!resized) {
          console.error('Resized frame is undefined or not valid.');
          setIsProcessing(false);
          return;
        }
        const outputs = model.runSync([resized]);
        if (!outputs || !Array.isArray(outputs) || outputs.length === 0) {
          console.error(
            'Model outputs are not in the expected format:',
            outputs,
          );
          setIsProcessing(false);
          return;
        }
        const detection_boxes = outputs[0];
        const parsedBoxes = [];
        const numElementsPerDetection = 5; // x, y, w, h, confidence
        for (
          let i = 0;
          i < detection_boxes.length;
          i += numElementsPerDetection
        ) {
          const [x, y, w, h, confidence] = detection_boxes.slice(
            i,
            i + numElementsPerDetection,
          );
          if (confidence > 0.7) {
            const left = x * screenWidth;
            const top = y * screenHeight;
            const boxWidth = w * screenWidth;
            const boxHeight = h * screenHeight;
            parsedBoxes.push({
              left,
              top,
              width: boxWidth,
              height: boxHeight,
            });
          }
        }
        setBoundingBoxes(parsedBoxes);
      } catch (error) {
        console.error('Frame Processor Error:', error);
      } finally {
        setIsProcessing(false);
      }
    },
    [model, isProcessing, screenWidth, screenHeight],
  );
  const renderBoundingBoxes = () => {
    return boundingBoxes.map((box, index) => (
      <View
        key={index}
        style={{
          position: 'absolute',
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          borderColor: 'red',
          borderWidth: 2,
        }}
      />
    ));
  };
  return (
    <View style={PreviewStyles.container}>
      <LoadingIndicator isLoading={objectDetection.state === 'loading'} />
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
            format={format}
          />
          {renderBoundingBoxes()}
        </>
      ) : (
        <Text>Loading Camera....</Text>
      )}
      <View style={PreviewStyles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
