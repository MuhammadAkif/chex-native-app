import {combineReducers} from 'redux';

import authReducer from './AuthReducer';
import inspectionReviewedReducer from './InspecetionReviewedReducer';
import inspectionInProgressReducer from './InspectionInProgressReducer';
import newInspectionReducer from './NewInspectionReducer';
import UIReducer from './UIReducer';
import tripReducer from './tripReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  newInspection: newInspectionReducer,
  inspectionReviewed: inspectionReviewedReducer,
  inspectionInProgress: inspectionInProgressReducer,
  ui: UIReducer,
  trip: tripReducer,
});

export default rootReducer;
