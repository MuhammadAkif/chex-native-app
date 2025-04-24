import {createStore, applyMiddleware} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunkMiddleware from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';

import rootReducer from './Reducers';

/**
 *
 * @type {{storage: AsyncStorageStatic, key: string}}
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunkMiddleware));
const persistor = persistStore(store);

export {store, persistor};
