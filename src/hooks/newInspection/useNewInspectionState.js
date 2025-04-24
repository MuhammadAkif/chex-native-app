import {useSelector} from 'react-redux';

/**
 * Custom hook to access the new inspection state from Redux.
 *
 * This hook exposes the entire new inspection state slice, which includes:
 * - Captured images for different vehicle sections
 * - Inspection metadata (e.g., selected ID, company ID)
 * - UI control flags (e.g., skip sections, flash mode)
 *
 * Business Rules:
 * - `vehicle_Type` controls flow (e.g., 'existing' vs. 'new' vehicles).
 * - Skips are used to conditionally render parts of the inspection UI.
 *
 * @returns {object} The full inspection state object.
 */
const useNewInspectionState = () => {
  return useSelector(state => state.newInspection);
};

export default useNewInspectionState;
