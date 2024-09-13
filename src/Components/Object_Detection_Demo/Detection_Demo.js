import React, {useEffect, useRef, useState} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
  AppState,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useFrameProcessor} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {BackArrow} from '../../Assets/Icons';
import {PHYSICAL_DEVICES} from '../../Constants';
import {colors, PreviewStyles} from '../../Assets/Styles';
import {LoadingIndicator} from '../index';
import {Canvas, Rect} from '@shopify/react-native-skia';
import RNFetchBlob from 'rn-fetch-blob';
import {useRunOnJS} from 'react-native-worklets-core';
import {isNotEmpty} from '../../Utils';

const Detection_Demo = ({navigation}) => {
  const isFocused = useIsFocused();
  const cameraRef = useRef();
  const lastProcessTimeRef = useRef(true);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [noDetectionFrames, setNoDetectionFrames] = useState(0);
  const [isImageURL, setIsImageURL] = useState('');
  const [isImageFile, setIsImageFile] = useState({});
  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {physicalDevices: PHYSICAL_DEVICES});
  const format = useCameraFormat(device, [
    {videoResolution: {width: 640, height: 480}},
    {fps: 30},
  ]);
  const ngrok = 'https://1c18-119-155-5-115.ngrok-free.app/';

  useEffect(() => {
    if (noDetectionFrames > 10) {
      setDetectedObjects([]);
      setNoDetectionFrames(0);
    }
  }, [noDetectionFrames]);
  useEffect(() => {
    let timeoutId = null;
    if (!lastProcessTimeRef.current) {
      timeoutId = setTimeout(() => {
        lastProcessTimeRef.current = true;
      }, 5000);
    }
    return clearTimeout(timeoutId);
  }, [lastProcessTimeRef]);

  const uploadFrame = async (preSignedUrl, file, mime) => {
    const shouldProceed =
      isNotEmpty(preSignedUrl) && isNotEmpty(file) && isNotEmpty(mime);
    if (!shouldProceed) {
      return;
    }
    const path = 'file://' + file.path;
    const formData = new FormData();
    formData.append('file', {
      uri: path,
      name: 'myFile.jpg',
      type: mime,
    });
    RNFetchBlob.fetch(
      'POST',
      preSignedUrl,
      {'Content-Type': mime, Connection: 'close'},
      RNFetchBlob.wrap(path),
    )
      .then(() => {
        console.log('uploaded successfully');
      })
      .catch(error => {
        console.log({error});
      })
      .finally(() => (lastProcessTimeRef.current = true));
  };

  // Function to convert base64 image to a file and upload to backend
  const sendBase64AsFile = async base64Frame => {
    try {
      // Step 1: Save base64 image as a temporary file
      const filePath = `${
        RNFetchBlob.fs.dirs.CacheDir
      }/frame_${Date.now()}.jpeg`;
      await RNFetchBlob.fs.writeFile(filePath, base64Frame, 'base64');

      // Step 2: Upload the file to backend
      await uploadFrame(
        'https://your-backend-url.com/upload',
        filePath,
        'image/jpeg',
      );
    } catch (error) {
      console.error('Error sending frame as file:', error);
    }
  };
  const handleLogic = useRunOnJS(() => {
    handleCaptureNowPress().then();
  }, []);
  const onFrameProcessed = async base64String => {
    const formData = new FormData();
    formData.append('file', {
      uri: 'data:image/jpeg;base64,' + base64String,
      type: 'image/jpeg',
      name: 'frame.jpg',
    });

    try {
      const response = await fetch('https://your-backend-server/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        console.log('File uploaded successfully!');
      } else {
        console.error('File upload failed:', response.status);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    if (lastProcessTimeRef.current) {
      lastProcessTimeRef.current = false;
      handleLogic().then();
    }
  }, []);
  async function handleCaptureNowPress() {
    if (cameraRef.current) {
      await cameraRef?.current?.takePhoto().then(res => {
        const filePath = 'file://' + res.path;
        const extension = res.path.split('.').pop();
        console.log({res});
        // setIsImageFile(res);
        // setIsImageURL(filePath);
        handleImageUpload(res, extension).then();
      });
    }
  }
  async function handleImageUpload(file, extension) {
    // let extension = isImageFile.path.split('.')[2];
    const mime = 'image/' + extension;
    await uploadFrame(ngrok, file, mime).then();
  }

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
                color="transparent"
                strokeWidth={2}
                strokeColor="green"
              />
            ))}
          </Canvas>
        </>
      ) : (
        <LoadingIndicator />
      )}
      <StatusBar barStyle="light-content" />
    </View>
  );
};

export default Detection_Demo;

// import React, {useEffect, useRef, useState} from 'react';
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
// import {BackArrow} from '../../Assets/Icons';
// import {PHYSICAL_DEVICES} from '../../Constants';
// import {colors, PreviewStyles} from '../../Assets/Styles';
// import {CameraFooter, LoadingIndicator} from '../index';
// import {Models} from '../../Assets/AI_Models';
// import {Canvas, Rect} from '@shopify/react-native-skia';
// import {useRunOnJS} from 'react-native-worklets-core';
// // NMS Utility Function
// const nonMaxSuppression = (boxes, scores, threshold) => {
//   const indices = [];
//   let sortedIndices = scores
//     .map((score, i) => [score, i])
//     .sort((a, b) => b[0] - a[0])
//     .map(item => item[1]);
//   while (sortedIndices.length > 0) {
//     const current = sortedIndices.shift();
//     indices.push(current);
//     sortedIndices = sortedIndices.filter(i => {
//       const x1 = Math.max(boxes[current][0], boxes[i][0]);
//       const y1 = Math.max(boxes[current][1], boxes[i][1]);
//       const x2 = Math.min(boxes[current][2], boxes[i][2]);
//       const y2 = Math.min(boxes[current][3], boxes[i][3]);
//       const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
//       const union =
//         (boxes[current][2] - boxes[current][0]) *
//           (boxes[current][3] - boxes[current][1]) +
//         (boxes[i][2] - boxes[i][0]) * (boxes[i][3] - boxes[i][1]) -
//         intersection;
//       const iou = intersection / union;
//       return iou <= threshold;
//     });
//   }
//   return indices;
// };
// const Detection_Demo = ({navigation}) => {
//   const isFocused = useIsFocused();
//   const {resize} = useResizePlugin();
//   const cameraRef = useRef();
//   const lastProcessTimeRef = useRef(Date.now());
//   const [detectedObjects, setDetectedObjects] = useState([]);
//   const [noDetectionFrames, setNoDetectionFrames] = useState(0);
//   const appState = useRef(AppState.currentState);
//   const device = useCameraDevice('back', {physicalDevices: PHYSICAL_DEVICES});
//   const format = useCameraFormat(device, [
//     {videoResolution: {width: 640, height: 480}},
//     {fps: 30},
//   ]);
//   const objectDetection = useTensorflowModel(Models.model_Three);
//   const model =
//     objectDetection.state === 'loaded' ? objectDetection.model : undefined;
//   const handleOutput = useRunOnJS(output => {
//     console.log(output.length);
//     // console.log('Processed Output:', output); // Debugging log
//     if (output.length > 0) {
//       console.log('starting...');
//       postProcessDetections(output[0]);
//       setNoDetectionFrames(0); // Reset no detection frames
//     } else {
//       setNoDetectionFrames(prev => prev + 1);
//     }
//   }, []);
//   useEffect(() => {
//     if (noDetectionFrames > 10) {
//       setDetectedObjects([]);
//       setNoDetectionFrames(0);
//     }
//   }, [noDetectionFrames]);
//   const postProcessDetections = outputObject => {
//     const outputArray = Object.keys(outputObject)
//       .map(key => ({key: parseInt(key), value: outputObject[key]}))
//       .sort((a, b) => a.key - b.key) // Sort by numeric key order
//       .map(item => item.value); // Extract the values as an array
//     // The output array is structured as [boxes (4 * N), scores (N), classes (N), num_detections (1)]
//     const numDetections = outputArray[outputArray.length - 1];
//     const numBoxes = Math.round(numDetections);
//     const detectionBoxes = [];
//     const detectionScores = [];
//     const detectionClasses = [];
//     console.log('Starting pre processing');
//     for (let i = 0; i < numBoxes; i++) {
//       const box = [
//         outputArray[i * 4], // xmin
//         outputArray[i * 4 + 1], // ymin
//         outputArray[i * 4 + 2], // xmax
//         outputArray[i * 4 + 3], // ymax
//       ];
//       detectionBoxes.push(box);
//
//       const score = outputArray[numBoxes * 4 + i];
//       const classIndex = outputArray[numBoxes * 5 + i];
//       detectionScores.push(score);
//       detectionClasses.push(classIndex);
//       // Debugging logs for each detection
//       console.log(`Detection ${i.length}:`);
//       console.log(`  Box: ${box.length}`);
//       console.log(`  Confidence: ${score.length}`);
//       console.log(`  Class: ${classIndex.length}`);
//     }
//     // Filter detections based on a confidence threshold
//     const confidenceThreshold = 0.5;
//     const filteredDetections = [];
//     for (let i = 0; i < numBoxes; i++) {
//       const score = detectionScores[i];
//       if (score > confidenceThreshold) {
//         const [xmin, ymin, xmax, ymax] = detectionBoxes[i];
//         const classIndex = detectionClasses[i];
//         filteredDetections.push({
//           left: xmin,
//           top: ymin,
//           width: xmax - xmin,
//           height: ymax - ymin,
//           classIndex: classIndex,
//           confidence: score,
//         });
//       }
//     }
//     // Debugging log for filtered detections
//     console.log('Filtered Detections:', filteredDetections);
//     // Apply Non-Maximum Suppression (NMS)
//     const nmsDetections = applyNMS(filteredDetections);
//
//     // Debugging log for NMS detections
//     console.log('NMS Detections:', nmsDetections);
//     // Update state with detected objects after NMS
//     setDetectedObjects(nmsDetections);
//   };
//   const applyNMS = detections => {
//     // Assuming boxes are in the format [xmin, ymin, xmax, ymax]
//     return nonMaxSuppression(
//       detections.map(d => [d.left, d.top, d.left + d.width, d.top + d.height]),
//       detections.map(d => d.confidence),
//       0.5,
//     ).map(index => detections[index]);
//   };
//   const frameProcessor = useFrameProcessor(
//     frame => {
//       'worklet';
//       if (model == null) {
//         return;
//       }
//       const currentTime = Date.now();
//       if (currentTime - lastProcessTimeRef.current < 1000) {
//         return; // Skip processing if less than 1 second has passed
//       }
//       lastProcessTimeRef.current = currentTime;
//       const resized = resize(frame, {
//         scale: {
//           width: 640,
//           height: 640,
//         },
//         pixelFormat: 'rgb',
//         dataType: 'float32',
//       });
//       try {
//         const outputs = model.runSync([resized]);
//         // console.log('Model Outputs:', outputs); // Debugging log
//         handleOutput(outputs);
//       } catch (error) {
//         console.error('Error during inference:', error); // Debugging log
//       }
//     },
//     [model],
//   );
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
//                 color="transparent"
//                 strokeWidth={2}
//                 strokeColor="green"
//               />
//             ))}
//           </Canvas>
//         </>
//       ) : (
//         <LoadingIndicator />
//       )}
//       <StatusBar barStyle="light-content" />
//     </View>
//   );
// };
// export default Detection_Demo;
