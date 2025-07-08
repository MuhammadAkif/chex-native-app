/**
 * @format
 */
import React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import notifee, { EventType } from '@notifee/react-native';

import App from './App';
import {name as appName} from './app.json';
import {persistor, store} from './src/Store';

const InitializeRedux = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => InitializeRedux);

// Register background handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.ACTION_PRESS && pressAction.id === 'accept') {
    // Handle accept action
    console.log('User accepted');
  }

  if (type === EventType.ACTION_PRESS && pressAction.id === 'reject') {
    // Handle reject action
    console.log('User rejected');
  }
});
