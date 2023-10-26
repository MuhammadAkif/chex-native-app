import {combineReducers} from 'redux';

import newInspectionReducer from './NewInspectionReducer';

const rootReducer = combineReducers({
  newInspection: newInspectionReducer,
});

export default rootReducer;
