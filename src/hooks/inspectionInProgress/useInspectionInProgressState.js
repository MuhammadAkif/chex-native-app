import {useSelector} from 'react-redux';

/**
 * Custom hook to access inspection-related state from the Redux store.
 *
 * @returns {{
 *   inspectionsInProgress: Array, // List of inspections that are in progress
 * }}
 */
const useInspectionInProgressState = () => {
  const inspectionInProgress = useSelector(
    state => state.inspectionInProgress.inspectionInProgress,
  );

  return {
    inspectionInProgress,
  };
};

export default useInspectionInProgressState;
