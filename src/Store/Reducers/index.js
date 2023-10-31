import {combineReducers} from 'redux';

import authReducer from './AuthReducer';
import newInspectionReducer from './NewInspectionReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  newInspection: newInspectionReducer,
});

export default rootReducer;
