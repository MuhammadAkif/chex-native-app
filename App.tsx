import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import 'react-native-devsettings';
import SplashScreen from 'react-native-splash-screen';

import Navigation from './src/Navigation/index';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {Types} from './src/Store/Types';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    SplashScreen.hide();
    dispatch({type: Types.CLEAR_NEW_INSPECTION});
    hasCameraAndMicrophoneAllowed().then();
    return () => {
      dispatch({type: Types.CLEAR_NEW_INSPECTION});
    };
  }, []);

  return <Navigation />;
}

export default App;
