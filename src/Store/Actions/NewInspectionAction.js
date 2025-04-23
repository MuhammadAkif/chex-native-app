import {Types} from '../Types';
import {
  extractLicensePlateAI,
  getInspectionDetails,
} from '../../services/inspection';
import {uploadInProgressMediaToStore} from '../../Utils';

const {
  UPDATE_VEHICLE_IMAGE,
  REMOVE_IMAGE,
  SELECTED_INSPECTION_ID,
  IS_LICENSE_PLATE_UPLOADED,
  CATEGORY_VARIANT,
  FILE_DETAILS,
  SKIP_LEFT,
  SKIP_LEFT_CORNERS,
  SKIP_RIGHT,
  SKIP_RIGHT_CORNERS,
  CLEAR_NEW_INSPECTION,
  CLEAR_TIRES,
  VEHICLE_TYPE,
  LICENSE_PLATE_NUMBER,
  CLEAR_INSPECTION_IMAGES,
  COMPANY_ID,
  FLASH_MODE,
} = Types;

/**
 * Utility to structure image payload for reducer updates.
 *
 * @param {string} item - The image key (e.g., 'licensePlate').
 * @param {string} group - Group it belongs to (e.g., 'carVerificiationItems').
 * @param {string} uri - Image URI or empty string if removing.
 * @param {number} id - Image ID (or 0 if clearing).
 * @returns {object} structured payload
 */
const itemsImagePayload = (item = '', group = '', uri = '', id = 0) => {
  const itemId = `${item}ID`;
  return {group, item, itemId, uri, id};
};

/**
 * Dispatches image addition or update in Redux state.
 */
export function updateVehicleImage(group, item, uri, id) {
  return dispatch => {
    const payload = itemsImagePayload(item, group, uri, id);
    dispatch({type: UPDATE_VEHICLE_IMAGE, payload});
  };
}

/**
 * Dispatches image removal (clears URI and ID).
 */
export function removeVehicleImage(group, item) {
  return dispatch => {
    const payload = itemsImagePayload(item, group, '', 0);
    dispatch({type: REMOVE_IMAGE, payload});
  };
}

/**
 * Stores the selected inspection session ID.
 */
export const numberPlateSelected = (selectedInspectionID = null) => ({
  type: SELECTED_INSPECTION_ID,
  payload: selectedInspectionID,
});

/**
 * Flag used to determine if a license plate image was uploaded.
 */
export const updateIsLicensePlateUploaded = payload => ({
  type: IS_LICENSE_PLATE_UPLOADED,
  payload,
});

/**
 * Sets the category variant for this inspection (e.g., light vs heavy vehicle).
 */
export const categoryVariant = payload => ({
  type: CATEGORY_VARIANT,
  payload,
});

/**
 * Fetches detailed inspection data, stores files in state, and uploads in-progress media.
 *
 * This is typically used when resuming or viewing a saved inspection session.
 */
export const file_Details = inspectionId => async dispatch => {
  try {
    const response = await getInspectionDetails(inspectionId);
    const {files = {}} = response?.data || {};

    dispatch(setFileDetails(files));
    uploadInProgressMediaToStore(files, dispatch);
    dispatch(numberPlateSelected(inspectionId));
    return response;
  } catch (error) {
    console.error('Inspection details getting error:', error);
    throw error;
  }
};

/**
 * Stores detailed file metadata (used by review or resumption flows).
 */
export const setFileDetails = files => ({
  type: FILE_DETAILS,
  payload: files,
});

/**
 * Clears the entire new inspection state (used on reset or logout).
 */
export const clearNewInspection = () => ({type: CLEAR_NEW_INSPECTION});

/**
 * Clears only tire-related image data.
 */
export const clear_Tires = () => ({type: CLEAR_TIRES});

/**
 * Flags for skipping image capture steps in the flow (per side/corner).
 */
export const skipLeft = shouldSkip => ({type: SKIP_LEFT, payload: shouldSkip});
export const skipLeftCorners = shouldSkip => ({
  type: SKIP_LEFT_CORNERS,
  payload: shouldSkip,
});
export const skipRight = shouldSkip => ({
  type: SKIP_RIGHT,
  payload: shouldSkip,
});
export const skipRightCorners = shouldSkip => ({
  type: SKIP_RIGHT_CORNERS,
  payload: shouldSkip,
});

/**
 * Sets the vehicle type (used to branch logic/UI flow).
 * e.g., 'existing' for registered vehicles, 'new' for unregistered ones.
 */
export const setVehicleType = vehicleType => ({
  type: VEHICLE_TYPE,
  payload: vehicleType,
});

/**
 * Uses AI service to extract license plate number from an uploaded image.
 */
export const setLicensePlateNumber = image_url => async dispatch => {
  try {
    const response = await extractLicensePlateAI(image_url);
    const {plateNumber = null} = response?.data || {};

    dispatch({
      type: LICENSE_PLATE_NUMBER,
      payload: plateNumber,
    });
  } catch (error) {
    console.error('Setting license plate error:', error);
    throw error;
  }
};

/**
 * Clears all captured image fields (interior, exterior, tires, etc).
 */
export const clearInspectionImages = () => ({
  type: CLEAR_INSPECTION_IMAGES,
});

/**
 * Sets the company ID associated with the inspection.
 */
export const setCompanyId = companyId => ({
  type: COMPANY_ID,
  payload: companyId,
});

/**
 * Controls the flash mode for the in-app camera (e.g., 'on', 'off', 'auto').
 */
export const setFlashMode = (mode = 'off') => ({
  type: FLASH_MODE,
  payload: mode,
});
