import React, {useCallback} from 'react';

import {WelcomeScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {useFocusEffect} from '@react-navigation/native';
import {Alert, BackHandler, Platform} from 'react-native';
import {ANDROID, HARDWARE_BACK_PRESS} from '../Constants';

const {SIGN_IN} = ROUTES;

const WelcomeContainer = ({navigation}) => {
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
    if (Platform.OS === ANDROID) {
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

  const handleSignInPress = () => navigation.navigate(SIGN_IN);

  return <WelcomeScreen handleSignInPress={handleSignInPress} />;
};

export default WelcomeContainer;
