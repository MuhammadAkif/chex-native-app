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

    dispatch({
      type: UPDATE_VEHICLE_IMAGE,
      payload,
    });
  };
}

/**
 * Dispatches image removal (clears URI and ID).
 */
export function removeVehicleImage(group, item) {
  return dispatch => {
    const payload = itemsImagePayload(item, group, '', 0);

    dispatch({type: REMOVE_IMAGE, payload: payload});
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
  payload: payload,
});

/**
 * Sets the category variant for this inspection (e.g., light vs heavy vehicle).
 */
export const categoryVariant = payload => ({
  type: CATEGORY_VARIANT,
  payload: payload,
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
/*export const clear_Tires = fileIds => async dispatch => {
  try {
    await clearTires(fileIds);
    dispatch({type: CLEAR_TIRES});
  } catch (error) {
    console.error('Remove Tires  error:', error);
    throw error;
  }
};*/
export const skipLeft = shouldSkip => ({
  type: SKIP_LEFT,
  payload: shouldSkip,
});
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
export const setRequired = (required = null) => ({
  type: SET_REQUIRED,
  payload: required,
});
export const batchUpdateVehicleImages = updates => ({
  type: BATCH_UPDATE_VEHICLE_IMAGES,
  payload: updates,
});

export const setMileage = (mileage = '') => ({
  type: SET_MILEAGE,
  payload: mileage,
});
export const setMileageMessage = (message = '') => ({
  type: SET_MILEAGE_MESSAGE,
  payload: message,
});
export const getMileage =
  (image_url = '') =>
  async dispatch => {
    try {
      const response = await ai_Mileage_Extraction(image_url);
      const {mileage = ''} = response?.data || {};

      // const mileage_ = removeAlphabets(mileage);

      dispatch(setMileage(mileage));
    } catch (error) {
      dispatch(setMileage(''));
      console.error('Setting extraction odometer error:', error);
      throw error;
    }
  };
export const setFeedback = (feedback = '') => ({
  type: SET_FEEDBACK,
  payload: feedback,
});
export const setMileageVisible = (mileage_visible = false) => ({
  type: SET_MILEAGE_VISIBLE,
  payload: mileage_visible,
});
export const setPlateNumberVisible = (plateNumber_visible = false) => ({
  type: SET_PLATE_NUMBER_VISIBLE,
  payload: plateNumber_visible,
});
export const setTriggerTireStatusCheck = (checkTireStatus = false) => ({
  type: SET_TRIGGER_TIRE_STATUS_CHECK,
  payload: checkTireStatus,
});
export const setImageDimensions = (dimensions = null) => ({
  type: SET_IMAGE_DIMENSIONS,
  payload: dimensions,
});

/**
 * Controls the flash mode for the in-app camera (e.g., 'on', 'off', 'auto').
 */
export const setFlashMode = (mode = 'off') => ({
  type: FLASH_MODE,
  payload: mode,
});
