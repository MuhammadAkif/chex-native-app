import {combineReducers} from 'redux';

import authReducer from './AuthReducer';
import newInspectionReducer from './NewInspectionReducer';
import inspectionReviewedReducer from './InspecetionReviewedReducer';
import inspectionInProgressReducer from './InspectionInProgressReducer';
import UIReducer from './UIReducer';
import fuelReducer from './fuelReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  newInspection: newInspectionReducer,
  inspectionReviewed: inspectionReviewedReducer,
  inspectionInProgress: inspectionInProgressReducer,
  ui: UIReducer,
  fuel: fuelReducer,
});

export default rootReducer;
