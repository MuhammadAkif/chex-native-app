import React, {useEffect, useRef, useState} from 'react';
import {AppState, StatusBar, StyleSheet, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';

import {colors, PreviewStyles} from '../Assets/Styles';
import {BackArrow} from '../Assets/Icons';
import {CameraFooter, CameraPreview} from '../Components';
import {ROUTES} from '../Navigation/ROUTES';
import {
  updateCarVerificationItemURI,
  updateExteriorItemURI,
  updateTiresItemURI,
} from '../Store/Actions';

const CameraContainer = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const cameraRef = useRef();
  const appState = useRef(AppState.currentState);
  const devices = useCameraDevices('wide-angle-camera');
  const [device, setDevice] = useState();
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [isImageURL, setIsImageURL] = useState('');
  const {title, type} = route.params;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      setIsImageURL('');
    };
  }, []);

  useEffect(() => {
    if (isBackCamera) {
      setDevice(devices.back);
    } else {
      setDevice(devices.front);
    }
  }, [isBackCamera, devices]);

  const handleNavigationBackPress = () => navigation.goBack();
  const handleSwitchCamera = () => setIsBackCamera(!isBackCamera);
  const handleCaptureNowPress = async () => {
    if (cameraRef.current) {
      const file = await cameraRef?.current?.takePhoto();
      setIsImageURL(`file://${file.path}`);
      const result = await fetch(`file://${file.path}`);
      // const data = await result.blob();
    }
  };
  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // includeBase64: true,
    })
      .then(image => {
        console.log(image);
        setIsImageURL(image?.sourceURL);
      })
      .catch(error => console.log(error.code));
  };
  const handleRetryPress = () => setIsImageURL('');
  const handleNextPress = () => {
    title === 'CarVerification'
      ? dispatch(updateCarVerificationItemURI(type, isImageURL))
      : title === 'Exterior'
      ? dispatch(updateExteriorItemURI(type, isImageURL))
      : dispatch(updateTiresItemURI(type, isImageURL));
    navigation.navigate(ROUTES.NEW_INSPECTION);
  };

  return (
    <>
      {isImageURL ? (
        <CameraPreview
          handleNavigationBackPress={handleNavigationBackPress}
          handleRetryPress={handleRetryPress}
          handleNextPress={handleNextPress}
          isImageURL={isImageURL}
        />
      ) : (
        <View style={PreviewStyles.container}>
          {isImageURL ? (
            <FastImage
              priority={'normal'}
              resizeMode={'stretch'}
              style={[StyleSheet.absoluteFill, {borderRadius: 25}]}
              source={{uri: isImageURL}}
            />
          ) : (
            device && (
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                photo={true}
                audio={false}
                isActive={isFocused && appState.current === 'active'}
                enableZoomGesture={true}
              />
            )
          )}
          <View style={PreviewStyles.headerContainer}>
            <BackArrow
              height={hp('8%')}
              width={wp('8%')}
              color={colors.white}
              onPress={handleNavigationBackPress}
            />
          </View>
          <CameraFooter
            isCamera={true}
            handleSwitchCamera={handleSwitchCamera}
            handleCaptureNowPress={handleCaptureNowPress}
            openPhotoLibrary={handleImagePicker}
          />
        </View>
      )}
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
    </>
  );
};

export default CameraContainer;
