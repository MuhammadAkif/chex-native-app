import { combineReducers } from 'redux';

import authReducer from './AuthReducer';
import newInspectionReducer from './NewInspectionReducer';
import inspectionReviewedReducer from './InspecetionReviewedReducer';
import inspectionInProgressReducer from './InspectionInProgressReducer';
import UIReducer from './UIReducer';
import uploadReducer from './UploadReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  newInspection: newInspectionReducer,
  inspectionReviewed: inspectionReviewedReducer,
  inspectionInProgress: inspectionInProgressReducer,
  ui: UIReducer,
  uploads: uploadReducer,
});

export default rootReducer;
