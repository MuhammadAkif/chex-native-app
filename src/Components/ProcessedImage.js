import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {
  CvCamera,
  Mat,
  RNCv,
  CvType,
  CvSize,
  ColorConv,
  CvPoint,
  CvScalar,
} from 'react-native-opencv3';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import downloadAssetSource from 'react-native-opencv3/downloadAssetSource';
import FastImage from 'react-native-fast-image';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import * as RNFS from 'react-native-fs';

import {IMAGES} from '../Assets/Images';
import {isNotEmpty} from '../Utils';

const fileName = {
  android: 'file://',
  ios: '',
};

const ProcessedImage = () => {
  const cameraRef = useRef(null);
  const [state, setState] = useState({});
  let circlesImageUri = resolveAssetSource(IMAGES.frame).uri;

  if (isNotEmpty(state?.destImageUri)) {
    circlesImageUri = fileName[Platform.OS] + state?.destImageUri;
  }
  useEffect(() => {
    componentDidMount().then();
  }, []);
  const componentDidMount = async () => {
    const newImagePath =
      RNFS.DocumentDirectoryPath + '/Billiard-balls-table-circles.jpg';

    const interMat = await new Mat().init();
    const circlesMat = await new Mat().init();

    let overlayMat;
    if (Platform.OS === 'ios') {
      overlayMat = await new Mat(1600, 1280, CvType.CV_8UC4).init();
    } else {
      overlayMat = await new Mat(1280, 1600, CvType.CV_8UC4).init();
    }

    const sourceuri = resolveAssetSource(IMAGES.frame).uri;
    const sourceFile = await downloadAssetSource(sourceuri);
    const srcMat = await RNCv.imageToMat(sourceFile);
    const gaussianKernelSize = new CvSize(9, 9);

    RNCv.invokeMethod('cvtColor', {
      p1: srcMat,
      p2: interMat,
      p3: ColorConv.COLOR_BGR2GRAY,
    });
    RNCv.invokeMethod('GaussianBlur', {
      p1: interMat,
      p2: interMat,
      p3: gaussianKernelSize,
      p4: 2,
      p5: 2,
    });
    RNCv.invokeMethod('HoughCircles', {
      p1: interMat,
      p2: circlesMat,
      p3: 3,
      p4: 2,
      p5: 100,
      p6: 100,
      p7: 90,
      p8: 1,
      p9: 130,
    });

    const scalar1 = new CvScalar(255, 0, 255, 255);
    const scalar2 = new CvScalar(255, 255, 0, 255);

    const circles = await RNCv.getMatData(circlesMat, 0, 0);

    for (let i = 0; i < circles.length; i += 3) {
      const center = new CvPoint(
        Math.round(circles[i]),
        Math.round(circles[i + 1]),
      );
      const radius = Math.round(circles[i + 2]);
      RNCv.invokeMethod('circle', {
        p1: overlayMat,
        p2: center,
        p3: 3,
        p4: scalar1,
        p5: 12,
        p6: 8,
        p7: 0,
      });
      RNCv.invokeMethod('circle', {
        p1: overlayMat,
        p2: center,
        p3: radius,
        p4: scalar2,
        p5: 24,
        p6: 8,
        p7: 0,
      });
    }

    RNCv.invokeMethod('addWeighted', {
      p1: srcMat,
      p2: 1.0,
      p3: overlayMat,
      p4: 1.0,
      p5: 0.0,
      p6: srcMat,
    });
    const {uri, width, height} = await RNCv.matToImage(srcMat, newImagePath);

    RNCv.deleteMat(overlayMat);
    RNCv.deleteMat(interMat);
    RNCv.deleteMat(circlesMat);

    setState({...state, destImageUri: uri});
  };

  return (
    <View style={styles.container}>
      <CvCamera
        ref={cameraRef}
        style={styles.camera}
        // onFrame={overlaySprite}
        overlay={styles.overlay}
      />
      <FastImage
        source={{uri: `${circlesImageUri}`}}
        // source={IMAGES.frame}
        style={StyleSheet.absoluteFillObject}
        resizeMode={'contain'}
      />
      <Text style={styles.text}>Detecting...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  text: {
    position: 'absolute',
    bottom: 10,
    color: 'white',
    fontSize: 18,
  },
  imageOverlay: {
    height: '40%',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    width: 100, // Same as sprite width
    height: 100, // Same as sprite height
    top: '10%',
    left: '10%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
    borderColor: '#00FF00',
    borderWidth: 2,
    borderRadius: 8,
  },
  sprite: {
    position: 'absolute',
    width: 100, // Adjust as needed
    height: 100, // Adjust as needed
    top: '10%',
    left: '10%',
    backgroundColor: 'red',
  },
  textContainer: {
    backgroundColor: Colors.red,
  },
});
export default ProcessedImage;
