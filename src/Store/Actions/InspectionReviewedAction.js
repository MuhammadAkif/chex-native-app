import {Types} from '../Types';
import {handle_Session_Expired} from '../../Utils';
import {fetchAllInspections} from '../../services/inspection';
import {INSPECTION_STATUSES} from '../../Constants';

const {GET_INSPECTION_REVIEWED, CLEAR_INSPECTION_REVIEWED} = Types;

export const fetchInspectionReviewed = () => async dispatch => {
  try {
    const {data: allInspections} = await fetchAllInspections(
      INSPECTION_STATUSES,
    );

    dispatch({
      type: GET_INSPECTION_REVIEWED,
      payload: allInspections,
    });
  } catch (error) {
    console.error('Fetching All Inspections error: ', error);
    const {statusCode = null} = error?.response?.data || {};

    if (statusCode === 401) {
      handle_Session_Expired(statusCode, dispatch);
    }
    throw error;
  }
};

export const clearInspectionReviewed = () => ({
  type: CLEAR_INSPECTION_REVIEWED,
});
