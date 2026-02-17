import React, {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Alert, BackHandler, Platform} from 'react-native';

import {WelcomeScreen} from '../Screens';
import {ROUTES} from '../Navigation/ROUTES';
import {HARDWARE_BACK_PRESS, Platforms} from '../Constants';
import {useTranslation} from 'react-i18next';

const {SIGN_IN} = ROUTES;
const {OS} = Platform;
const {ANDROID} = Platforms;

const WelcomeContainer = ({navigation}) => {
  const {t} = useTranslation();
  const {navigate} = navigation;

  const handle_Hardware_Back_Press = useCallback(() => {
    if (OS === ANDROID) {
      Alert.alert(t('exitApp.title'), t('exitApp.message'), [
        {
          text: t('exitApp.button.cancel'),
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: t('exitApp.button.yes'),
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(HARDWARE_BACK_PRESS, handle_Hardware_Back_Press);
      return () => backHandler.remove();
    }, [handle_Hardware_Back_Press])
  );

  const handleSignInPress = () => navigate(SIGN_IN);

  return <WelcomeScreen handleSignInPress={handleSignInPress} />;
};

export default WelcomeContainer;
