import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {
  fetchInspectionInProgress,
  deleteInspection,
  clearInspectionInProgress,
} from '../../Store/Actions';

/**
 * Custom hook to handle inspection in progress-related actions.
 *
 * This hook encapsulates the logic for fetching inspections in progress,
 * deleting an inspection, and clearing all inspections.
 *
 * @returns {{
 *   fetchInProgress: () => Promise<void>, // Fetch inspections in progress
 *   removeInspection: (inspectionId: string) => Promise<void>, // Remove a specific inspection
 *   clearInspections: () => void // Clear all inspections in progress
 * }}
 */
const useInspectionInProgressActions = () => {
  const dispatch = useDispatch();

  /**
   * Fetch inspections that are in progress.
   * This action is used to update the list of inspections in progress.
   */
  const fetchInProgress = useCallback(async () => {
    try {
      return dispatch(fetchInspectionInProgress());
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  /**
   * Remove a specific inspection by ID.
   * This action deletes the inspection and updates the Redux store.
   *
   * @param {string} inspectionId - The ID of the inspection to delete
   */
  const removeInspection = useCallback(
    async inspectionId => {
      try {
        return dispatch(deleteInspection(inspectionId));
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  /**
   * Clear all inspections from the store.
   * This action resets the state of inspections in progress.
   */
  const clearInspections = useCallback(() => {
    try {
      dispatch(clearInspectionInProgress());
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  return {
    fetchInProgress,
    removeInspection,
    clearInspections,
  };
};

export default useInspectionInProgressActions;
