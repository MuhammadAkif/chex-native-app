import React, {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Alert, BackHandler, Platform} from 'react-native';

import {WelcomeScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {HARDWARE_BACK_PRESS, Platforms} from '../Constants';

const {SIGN_IN} = ROUTES;
const {OS} = Platform;
const {ANDROID} = Platforms;

const WelcomeContainer = ({navigation}) => {
  const {navigate} = navigation;

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        HARDWARE_BACK_PRESS,
        handle_Hardware_Back_Press,
      );
      return () => backHandler.remove();
    }, []),
  );

  function handle_Hardware_Back_Press() {
    if (OS === ANDROID) {
      Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    }
  }

  const handleSignInPress = () => navigate(SIGN_IN);

  return <WelcomeScreen handleSignInPress={handleSignInPress} />;
};

export default WelcomeContainer;
