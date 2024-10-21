import {Types} from '../Types';

const {
  GET_INSPECTION_IN_PROGRESS,
  REMOVE_INSPECTION_IN_PROGRESS,
  CLEAR_INSPECTION_IN_PROGRESS,
} = Types;

export const fetch_InspectionInProgress = inspectionInProgress => ({
  type: GET_INSPECTION_IN_PROGRESS,
  payload: inspectionInProgress,
});
export const removeInspectionInProgress = inspectionsInProgress => ({
  type: REMOVE_INSPECTION_IN_PROGRESS,
  payload: inspectionsInProgress,
});

export const clearInspectionInProgress = () => ({
  type: CLEAR_INSPECTION_IN_PROGRESS,
});
