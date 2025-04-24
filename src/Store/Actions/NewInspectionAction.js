import {Types} from '../Types';
import {
  ai_Mileage_Extraction,
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
  SET_REQUIRED,
  BATCH_UPDATE_VEHICLE_IMAGES,
  SET_MILEAGE,
  SET_FEEDBACK,
  SET_MILEAGE_VISIBLE,
  SET_PLATE_NUMBER_VISIBLE,
  SET_TRIGGER_TIRE_STATUS_CHECK,
  SET_MILEAGE_MESSAGE,
  SET_IMAGE_DIMENSIONS,
  FLASH_MODE,
} = Types;

/**
 * Utility to structure image payload for reducer updates.
 *
 * @param {string} item - The image key (e.g., 'licensePlate').
 * @param {string} group - Group it belongs to (e.g., 'carVerificiationItems').
 * @param {string} uri - Image URI or empty string if removing.
 * @param {number} id - Image ID (or 0 if clearing).
 * @returns {object} structured payload for image updates
 */
const itemsImagePayload = (item = '', group = '', uri = '', id = 0) => {
  const itemId = `${item}ID`;
  return {group, item, itemId, uri, id};
};

/**
 * Dispatches image addition or update in Redux state.
 *
 * @param {string} group - State key for image group
 * @param {string} item - Specific image item key
 * @param {string} uri - URI of the image to add
 * @param {number} id - Backend ID for the image
 * @returns {Function} Thunk function
 */
export function updateVehicleImage(group, item, uri, id) {
  return dispatch => {
    const payload = itemsImagePayload(item, group, uri, id);

    dispatch({
      type: UPDATE_VEHICLE_IMAGE,
      payload,
    });
  };
}

/**
 * Dispatches image removal (clears URI and ID).
 *
 * @param {string} group - State key for image group
 * @param {string} item - Specific image item key to remove
 * @returns {Function} Thunk function
 */
export function removeVehicleImage(group, item) {
  return dispatch => {
    const payload = itemsImagePayload(item, group, '', 0);

    dispatch({type: REMOVE_IMAGE, payload: payload});
  };
}

/**
 * Stores the selected inspection session ID.
 *
 * @param {(string|number|null)} selectedInspectionID - ID of the selected inspection session
 * @returns {{ type: string, payload: (string|number|null) }}
 */
export const numberPlateSelected = (selectedInspectionID = null) => ({
  type: SELECTED_INSPECTION_ID,
  payload: selectedInspectionID,
});

/**
 * Flag used to determine if a license plate image was uploaded.
 *
 * @param {boolean} payload - Upload status flag
 * @returns {{ type: string, payload: boolean }}
 */
export const updateIsLicensePlateUploaded = payload => ({
  type: IS_LICENSE_PLATE_UPLOADED,
  payload: payload,
});

/**
 * Sets the category variant for this inspection (e.g., light vs heavy vehicle).
 *
 * @param {number} payload - Variant code
 * @returns {{ type: string, payload: number }}
 */
export const categoryVariant = payload => ({
  type: CATEGORY_VARIANT,
  payload: payload,
});

/**
 * Fetches detailed inspection data, stores files in state, and uploads in-progress media.
 *
 * This action is typically used when resuming or viewing a saved inspection session.
 *
 * @param {(string|number)} inspectionId - ID of the inspection session to fetch
 * @returns {Function} Thunk function returning the API response promise
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
 *
 * @param {object} files - File metadata object
 * @returns {{ type: string, payload: object }}
 */
export const setFileDetails = files => ({
  type: FILE_DETAILS,
  payload: files,
});

/**
 * Clears the entire new inspection state (used on reset or logout).
 *
 * @returns {{ type: string }}
 */
export const clearNewInspection = () => ({type: CLEAR_NEW_INSPECTION});

/**
 * Clears only tire-related image data.
 *
 * @returns {{ type: string }}
 */
export const clear_Tires = () => ({type: CLEAR_TIRES});

/**
 * Toggles skipping left-side exterior inspection section.
 *
 * @param {boolean} shouldSkip - true to skip, false to include
 * @returns {{ type: string, payload: boolean }}
 */
export const skipLeft = shouldSkip => ({
  type: SKIP_LEFT,
  payload: shouldSkip,
});

/**
 * Toggles skipping left corner shots of the vehicle.
 *
 * @param {boolean} shouldSkip - true to skip, false to include
 * @returns {{ type: string, payload: boolean }}
 */
export const skipLeftCorners = shouldSkip => ({
  type: SKIP_LEFT_CORNERS,
  payload: shouldSkip,
});

/**
 * Toggles skipping right-side exterior inspection section.
 *
 * @param {boolean} shouldSkip - true to skip, false to include
 * @returns {{ type: string, payload: boolean }}
 */
export const skipRight = shouldSkip => ({
  type: SKIP_RIGHT,
  payload: shouldSkip,
});

/**
 * Toggles skipping right corner shots of the vehicle.
 *
 * @param {boolean} shouldSkip - true to skip, false to include
 * @returns {{ type: string, payload: boolean }}
 */
export const skipRightCorners = shouldSkip => ({
  type: SKIP_RIGHT_CORNERS,
  payload: shouldSkip,
});

/**
 * Sets the vehicle type (used to branch logic/UI flow).
 * e.g., 'existing' for registered vehicles, 'new' for unregistered ones.
 *
 * @param {string} vehicleType - The type of vehicle ('existing'|'new')
 * @returns {{ type: string, payload: string }}
 */
export const setVehicleType = vehicleType => ({
  type: VEHICLE_TYPE,
  payload: vehicleType,
});

/**
 * Uses AI service to extract license plate number from an uploaded image.
 *
 * @param {string} image_url - URI of the license plate image
 * @returns {Function} Thunk function
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
 *
 * @returns {{ type: string }}
 */
export const clearInspectionImages = () => ({
  type: CLEAR_INSPECTION_IMAGES,
});

/**
 * Sets the company ID associated with the inspection.
 *
 * @param {(string|number)} companyId - Identifier for the company
 * @returns {{ type: string, payload: (string|number) }}
 */
export const setCompanyId = companyId => ({
  type: COMPANY_ID,
  payload: companyId,
});

/**
 * Specifies validation rules for required files in the inspection.
 *
 * @param {object|null} required - Rules describing which files are mandatory
 * @returns {{ type: string, payload: object|null }}
 */
export const setRequired = (required = null) => ({
  type: SET_REQUIRED,
  payload: required,
});

/**
 * Batch updates multiple vehicle images in one action.
 *
 * @param {Array<{group: string, item: string, uri: string, id: number}>} updates - Array of image updates
 * @returns {{ type: string, payload: Array }}
 */
export const batchUpdateVehicleImages = updates => ({
  type: BATCH_UPDATE_VEHICLE_IMAGES,
  payload: updates,
});

/**
 * Updates the extracted mileage string in the inspection state.
 *
 * @param {string} mileage - The mileage value extracted by OCR or AI
 * @returns {{ type: string, payload: string }}
 */
export const setMileage = (mileage = '') => ({
  type: SET_MILEAGE,
  payload: mileage,
});

/**
 * Updates the validation or informational message for mileage.
 *
 * @param {string} message - Message describing mileage validation or errors
 * @returns {{ type: string, payload: string }}
 */
export const setMileageMessage = (message = '') => ({
  type: SET_MILEAGE_MESSAGE,
  payload: message,
});

/**
 * Extracts mileage from an image using AI and dispatches the result.
 *
 * @param {string} image_url - URI of the odometer image
 * @returns {Function} Thunk function returning a promise
 */
export const getMileage =
  (image_url = '') =>
  async dispatch => {
    try {
      const response = await ai_Mileage_Extraction(image_url);
      const {mileage = ''} = response?.data || {};

      dispatch(setMileage(mileage));
    } catch (error) {
      dispatch(setMileage(''));
      console.error('Setting extraction odometer error:', error);
      throw error;
    }
  };

/**
 * Updates user-provided feedback in the inspection state.
 *
 * @param {string} feedback - Feedback text entered by the user
 * @returns {{ type: string, payload: string }}
 */
export const setFeedback = (feedback = '') => ({
  type: SET_FEEDBACK,
  payload: feedback,
});

/**
 * Toggles visibility of the mileage input field in the UI.
 *
 * @param {boolean} mileage_visible - true to show, false to hide
 * @returns {{ type: string, payload: boolean }}
 */
export const setMileageVisible = (mileage_visible = false) => ({
  type: SET_MILEAGE_VISIBLE,
  payload: mileage_visible,
});

/**
 * Toggles visibility of the license plate number input in the UI.
 *
 * @param {boolean} plateNumber_visible - true to show, false to hide
 * @returns {{ type: string, payload: boolean }}
 */
export const setPlateNumberVisible = (plateNumber_visible = false) => ({
  type: SET_PLATE_NUMBER_VISIBLE,
  payload: plateNumber_visible,
});

/**
 * Triggers a check of the tire status based on uploaded tire photos.
 *
 * @param {boolean} checkTireStatus - true to initiate check, false otherwise
 * @returns {{ type: string, payload: boolean }}
 */
export const setTriggerTireStatusCheck = (checkTireStatus = false) => ({
  type: SET_TRIGGER_TIRE_STATUS_CHECK,
  payload: checkTireStatus,
});

/**
 * Stores captured image dimensions for layout or validation purposes.
 *
 * @param {{width:number,height:number}|null} dimensions - Object with width and height or null
 * @returns {{ type: string, payload: object|null }}
 */
export const setImageDimensions = (dimensions = null) => ({
  type: SET_IMAGE_DIMENSIONS,
  payload: dimensions,
});

/**
 * Controls the flash mode for the in-app camera (e.g., 'on', 'off', 'auto').
 *
 * @param {string} mode - Flash mode setting
 * @returns {{ type: string, payload: string }}
 */
export const setFlashMode = (mode = 'off') => ({
  type: FLASH_MODE,
  payload: mode,
});
