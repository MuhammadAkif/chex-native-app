import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
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
import {useRunOnJS} from 'react-native-worklets-core';
import {Models} from '../Assets/AI_Models';
import {InferenceSession} from 'onnxruntime-react-native';

const Detection_ONXX = ({navigation}) => {
  const isFocused = useIsFocused();
  const {resize} = useResizePlugin();
  const cameraRef = useRef();
  const [session, setSession] = useState(null);

  const appState = useRef(AppState.currentState);
  const device = useCameraDevice('back', {
    physicalDevices: PHYSICAL_DEVICES,
  });
  // const [session, setSession] = useState(null);
  const format = useCameraFormat(device, [
    {videoResolution: {width: 1280, height: 720}},
    {fps: 30},
  ]);
  useEffect(() => {
    initializeModel().then();
  }, []);
  async function initializeModel() {
    const model = await InferenceSession.create('Models.model_Seven')
      .then(res => {
        console.log({res});
        session(model);
      })
      .catch(error => console.log({error}));
  }
  /* let show = true;
  const runOnJS = useRunOnJS(output => {
    processImage(output).then();
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const resized = resize(frame, {
      scale: {
        width: 640,
        height: 640,
      },
      pixelFormat: 'rgb',
      dataType: 'float32',
    });

    runOnJS(resized).then();
  }, []);
  const processImage = async resizedImageData => {
    try {
      if (session === null) {
        console.log('Session is null');
        return;
      }
      const input = {images: resizedImageData};
      const output = await session.run(input);
      console.log('Detected Objects: ', output);
    } catch (error) {
      console.error('Error in model inference: ', error);
    }
  };*/

  return (
    <View style={PreviewStyles.container}>
      {device ? (
        <>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            // frameProcessor={frameProcessor}
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
export default Detection_ONXX;
