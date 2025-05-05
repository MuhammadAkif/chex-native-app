import {combineReducers} from 'redux';

import authReducer from './AuthReducer';
import newInspectionReducer from './NewInspectionReducer';
import inspectionReviewedReducer from './InspecetionReviewedReducer';
import inspectionInProgressReducer from './InspectionInProgressReducer';
import UIReducer from './UIReducer';
import crashDetectionReducer from './CrashDetectionReducer';
import appStateReducer from './appStateReducer';
import deviceReducer from './DeviceReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  newInspection: newInspectionReducer,
  inspectionReviewed: inspectionReviewedReducer,
  inspectionInProgress: inspectionInProgressReducer,
  ui: UIReducer,
  crashDetection: crashDetectionReducer,
  appState: appStateReducer,
  device: deviceReducer,
});

export default rootReducer;
