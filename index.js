/**
 * @format
 */
import React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from './App';
import {name as appName} from './app.json';
import {persistor, store} from './src/Store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardProvider} from 'react-native-keyboard-controller';

const InitializeRedux = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <PersistGate persistor={persistor}>
        <KeyboardProvider navigationBarTranslucent>
          <App />
        </KeyboardProvider>
      </PersistGate>
    </SafeAreaProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => InitializeRedux);
