import {useSelector} from 'react-redux';

/**
 * Custom hook to access inspection review-related state from the Redux store.
 *
 * This hook allows components to read reviewed inspection data, typically used
 * to display results filtered by review status.
 *
 * @returns {{
 *   inspectionReviewed: Array<any>  // Array of reviewed inspection records
 * }}
 *
 * Example usage:
 *
 * const { inspectionReviewed } = useInspectionReviewedState();
 * if (inspectionReviewed.length === 0) {
 *   // Handle no inspections case
 * }
 */
const useInspectionReviewedState = () => {
  const {inspectionReviewed} = useSelector(state => state.inspectionReviewed);
  return {inspectionReviewed};
};

export default useInspectionReviewedState;
