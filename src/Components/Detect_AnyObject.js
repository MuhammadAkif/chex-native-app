import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  AppState,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {InferenceSession, Tensor} from 'onnxruntime-react-native';
import {colors, PreviewStyles} from '../Assets/Styles';
import {BackArrow} from '../Assets/Icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {CameraFooter} from './index';
import {useIsFocused} from '@react-navigation/native';
import {useResizePlugin} from 'vision-camera-resize-plugin';
import {PHYSICAL_DEVICES} from '../Constants';
import {useRunOnJS} from 'react-native-worklets-core';
import {Models} from '../Assets/AI_Models';
// import Canvas from 'react-native-canvas';

const Detect_AnyObject = () => {
  const isFocused = useIsFocused();
  const {resize} = useResizePlugin();
  const cameraRef = useRef();

  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {
    physicalDevices: PHYSICAL_DEVICES,
  });
  // const [session, setSession] = useState(null);
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);
  const [session, setSession] = useState(null);
  const [boxes, setBoxes] = useState([]); // To store bounding boxes
  // Load ONNX model and set up the inference session

  useEffect(() => {
    /*const loadModel = async () => {
      const modelUri = Models.model_Seven;
      const session = await InferenceSession.create(modelUri)
        // const session = await InferenceSession.create(Models.model_Six)
        .then(res => console.log({res}))
        .catch(error => console.log({error}));
      setSession(session);
    };
    loadModel().then();*/
  }, []);
  const runOnJS = useRunOnJS(output => {
    handleCameraFrame(output).then();
  }, []);
  const handleCameraFrame = async frame => {
    if (!session) {
      return;
    }
    const imageTensor = preprocessImage(frame); // Convert the frame to a tensor matching input shape
    const output = await runOnnxModel(session, imageTensor);
    const boundingBoxes = extractBoundingBoxes(output);
    console.log({boundingBoxes});
    setBoxes(boundingBoxes); // Update state with bounding boxes
  };
  // Function to preprocess image and convert to tensor
  const preprocessImage = image => {
    // Perform image preprocessing (resize, normalize, etc.) and return a Tensor
    return new Tensor(
      'float32',
      new Float32Array(image.data),
      [1, 3, 640, 640],
    ); // Example input shape
  };
  // Function to run ONNX inference
  const runOnnxModel = async (session, imageTensor) => {
    const inputName = 'images'; // Input tensor name
    const feeds = {[inputName]: imageTensor};
    // Run inference
    const output = await session.run(feeds);
    return output.output0.data; // Output tensor
  };
  // Function to extract bounding boxes from model output
  const extractBoundingBoxes = output => {
    const boxes = [];
    // Example: Iterate through output and extract bounding box coordinates
    for (let i = 0; i < output.length; i += 5) {
      const confidence = output[i + 4]; // Adjust indices based on your model's output format
      if (confidence > 0.5) {
        const [x, y, w, h] = output.slice(i, i + 4);
        boxes.push({x, y, width: w, height: h});
      }
    }
    return boxes;
  };
  // Function to draw bounding boxes on canvas
  // const drawBoundingBoxes = canvas => {
  //   if (!canvas) {
  //     return;
  //   }
  //   const ctx = canvas.getContext('2d');
  //   ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
  //   boxes.forEach(({x, y, width, height}) => {
  //     ctx.strokeStyle = 'green';
  //     ctx.lineWidth = 2;
  //     ctx.strokeRect(x, y, width, height); // Draw rectangle
  //   });
  // };
  // useEffect(() => {
  //   if (canvasRef.current) {
  //     drawBoundingBoxes(canvasRef.current);
  //   }
  // }, [boxes]);
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    runOnJS(frame).then();
    // 2. Run model with given input buffer synchronously
  }, []);
  if (device == null) {
    return <Text>Loading Camera...</Text>;
  }
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
export default Detect_AnyObject;
