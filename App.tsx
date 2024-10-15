import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import 'react-native-devsettings';
// main branch backup
import Navigation from './src/Navigation/index';
import {hasCameraAndMicrophoneAllowed} from './src/Utils';
import {Types} from './src/Store/Types';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({type: Types.CLEAR_NEW_INSPECTION});
    hasCameraAndMicrophoneAllowed().then();
    return () => {
      console.log('cleaning store');
      dispatch({type: Types.CLEAR_NEW_INSPECTION});
    };
  }, []);

  return <Navigation />;
}

export default App;
