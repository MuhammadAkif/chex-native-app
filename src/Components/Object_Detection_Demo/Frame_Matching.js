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
// import {
//   Camera,
//   useCameraDevice,
//   useCameraFormat,
// } from 'react-native-vision-camera';
// import {useFrameProcessor} from 'react-native-vision-camera';
// import {useIsFocused} from '@react-navigation/native';
// import {useResizePlugin} from 'vision-camera-resize-plugin';
// import {useRunOnJS} from 'react-native-worklets-core';
// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-react-native';
// import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native';
// import {Asset} from 'expo-asset';
//
// import {BackArrow} from '../../Assets/Icons';
// import {PHYSICAL_DEVICES} from '../../Constants';
// import {colors, PreviewStyles} from '../../Assets/Styles';
// import {CameraFooter, LoadingIndicator} from '../index';
// import {Canvas, Rect, Image, useImage} from '@shopify/react-native-skia';
// import {IMAGES} from '../../Assets/Images';
//
// const Frame_Matching = ({navigation}) => {
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
//   const [isModelReady, setIsModelReady] = useState(false);
//   const [matchScore, setMatchScore] = useState(0);
//   const [boxColor, setBoxColor] = useState('black');
//   const [model, setModel] = useState(null);
//   const image = useImage(IMAGES.match_frame);
//
//   // Reference image tensor
//   const [referenceImageTensor, setReferenceImageTensor] = useState(null);
//
//   useEffect(() => {
//     const setupTensorFlow = async () => {
//       await tf.ready();
//
//       // Load MobileNet model from local assets
//       const modelJSON = require('../../assets/model/model.json');
//       const modelWeights = require('../../assets/model/group1-shard1of1.bin');
//       const loadedModel = await tf.loadLayersModel(
//         bundleResourceIO(modelJSON, modelWeights),
//       );
//       setModel(loadedModel);
//       setIsModelReady(true);
//
//       // Load and process reference PNG image
//       const referenceImage = Asset.fromModule(IMAGES.match_frame);
//       await referenceImage.downloadAsync();
//       const imageUri = referenceImage.localUri || referenceImage.uri;
//       const response = await fetch(imageUri);
//       const imageData = await response.arrayBuffer();
//       const imageTensor = decodeJpeg(new Uint8Array(imageData));
//       const processedTensor = await preprocessImage(imageTensor);
//       setReferenceImageTensor(processedTensor);
//     };
//
//     setupTensorFlow().catch(error =>
//       console.error('Error setting up TensorFlow:', error),
//     );
//   }, []);
//   const preprocessImage = async imageTensor => {
//     const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
//     const normalized = resized.div(255.0);
//     const batched = normalized.expandDims(0);
//     return batched;
//   };
//
//   const compareImages = async currentImageTensor => {
//     if (!referenceImageTensor || !model) {
//       return 0;
//     }
//
//     const features1 = model.predict(referenceImageTensor);
//     const features2 = model.predict(currentImageTensor);
//
//     const similarity = tf.losses
//       .cosineDistance(features1, features2)
//       .arraySync();
//     return 1 - similarity; // Convert distance to similarity score
//   };
//   const handleOutput = useRunOnJS(
//     async imageTensor => {
//       if (!isModelReady || !referenceImageTensor) {
//         return;
//       }
//
//       const processedTensor = await preprocessImage(imageTensor);
//       const similarity = await compareImages(processedTensor);
//       setMatchScore(similarity);
//       setBoxColor(similarity > 0.8 ? 'green' : 'red');
//
//       tf.dispose([processedTensor]);
//     },
//     [isModelReady, referenceImageTensor],
//   );
//
//   const frameProcessor = useFrameProcessor(
//     frame => {
//       'worklet';
//       if (!isModelReady) {
//         return;
//       }
//
//       const imageTensor = decodeJpeg(frame.toArrayBuffer());
//       handleOutput(imageTensor);
//     },
//     [isModelReady],
//   );
//
//   // Box position and size
//   const boxSizePercentage = 80;
//   const boxSize = wp(boxSizePercentage);
//   const boxTop = hp(50) - boxSize / 2;
//   const boxLeft = wp(50) - boxSize / 2;
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
//             <Rect
//               x={boxLeft}
//               y={boxTop}
//               width={boxSize}
//               height={boxSize}
//               color={boxColor}
//               style="stroke"
//               strokeWidth={4}
//             />
//             <Image
//               image={image}
//               x={boxLeft}
//               y={boxTop}
//               width={boxSize}
//               height={boxSize}
//               opacity={0.5}
//             />
//           </Canvas>
//           <Text style={styles.matchScore}>
//             Match Score: {matchScore.toFixed(2)}
//           </Text>
//           <Text style={styles.instruction}>
//             Align the object with the frame
//           </Text>
//         </>
//       ) : (
//         <Text>Loading Camera....</Text>
//       )}
//       <CameraFooter isCamera={true} />
//       <LoadingIndicator isLoading={!isModelReady} />
//       <StatusBar
//         backgroundColor="transparent"
//         barStyle="light-content"
//         translucent={true}
//       />
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   matchScore: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     color: 'white',
//     fontSize: 18,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 10,
//   },
//   instruction: {
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
//     color: 'white',
//     fontSize: 18,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 10,
//   },
// });
//
// export default Frame_Matching;
