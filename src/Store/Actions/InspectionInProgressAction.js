import {Types} from '../Types';
import {store} from '../index';
import {fetchAllInspections, removeInspection} from '../../services/inspection';
import {showToast} from './UIActions';

const {
  GET_INSPECTION_IN_PROGRESS,
  REMOVE_INSPECTION,
  CLEAR_INSPECTION_IN_PROGRESS,
} = Types;

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

export const clearInspectionInProgress = () => ({
  type: CLEAR_INSPECTION_IN_PROGRESS,
});
