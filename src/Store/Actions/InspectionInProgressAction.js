import {Types} from '../Types';
import {store} from '../index';
import {fetchAllInspections, removeInspection} from '../../services/inspection';
import {showToast} from './UIActions';

const {
  GET_INSPECTION_IN_PROGRESS,
  REMOVE_INSPECTION,
  CLEAR_INSPECTION_IN_PROGRESS,
} = Types;

/**
 * Fetches all inspections that are currently in progress and updates the Redux store.
 *
 * This action makes an API call to fetch inspections marked as "IN_PROGRESS" and dispatches
 * the result to the store.
 *
 * @returns {function(*): Promise<void>} - A thunk action that dispatches the result to Redux store
 */
export const fetchInspectionInProgress = () => async dispatch => {
  try {
    const {data: inspections} = await fetchAllInspections('IN_PROGRESS');

    dispatch({
      type: GET_INSPECTION_IN_PROGRESS,
      payload: inspections || [],
    });
  } catch (error) {
    console.error('Fetch in progress inspections error: ', error);
    throw error;
  }
};

/**
 * Deletes an inspection and updates the Redux store accordingly.
 *
 * This action removes an inspection from the list of "in-progress" inspections and updates
 * the state after making a successful API call to delete the inspection.
 *
 * @param {string} inspectionId - The ID of the inspection to delete
 * @returns {function(*): Promise<void>} - A thunk action that dispatches the updated inspections list
 */
export const deleteInspection = inspectionId => async dispatch => {
  const {inspectionInProgress} = store.getState().inspectionInProgress;

  let updatedInspections = inspectionInProgress.filter(
    item => item.id !== inspectionId,
  );

  try {
    await removeInspection(inspectionId);

    dispatch({
      type: REMOVE_INSPECTION,
      payload: updatedInspections || [],
    });
    dispatch(showToast('Inspection has been deleted!', 'success'));
  } catch (error) {
    console.error('Inspection remove error: ', error);
    throw error;
  }
};

/**
 * Clears all inspections from the Redux store.
 *
 * This action resets the state of "inspections in progress" by dispatching
 * the `CLEAR_INSPECTION_IN_PROGRESS` action.
 *
 * @returns {{type: string}} - The action object to reset the state
 */
export const clearInspectionInProgress = () => ({
  type: CLEAR_INSPECTION_IN_PROGRESS,
});
