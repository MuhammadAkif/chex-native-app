import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {
  fetchInspectionReviewed,
  clearInspectionReviewed,
} from '../../Store/Actions';

/**
 * Custom hook to provide inspection review-related action dispatchers.
 *
 * This hook exposes methods to fetch and clear reviewed inspections via Redux actions.
 *
 * Business Rule Note:
 * - `loadReviewedInspections` returns a Promise so the UI can respond to loading or error states.
 *
 * @returns {{
 *   loadReviewedInspections: () => Promise<void>,
 *   resetReviewedInspections: () => void
 * }}
 */
const useInspectionReviewedActions = () => {
  const dispatch = useDispatch();

  /**
   * Fetch reviewed inspections via an async Redux thunk.
   * Useful for initial load or on-demand refresh.
   */
  const loadReviewedInspections = useCallback(() => {
    return dispatch(fetchInspectionReviewed());
  }, [dispatch]);

  /**
   * Clears the reviewed inspection state.
   * Typically used on user logout or navigation reset.
   */
  const resetReviewedInspections = useCallback(() => {
    dispatch(clearInspectionReviewed());
  }, [dispatch]);

  return {
    loadReviewedInspections,
    resetReviewedInspections,
  };
};

export default useInspectionReviewedActions;
