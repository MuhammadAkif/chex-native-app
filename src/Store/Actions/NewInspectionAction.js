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
} = Types;

const itemsImagePayload = (item = '', group = '', uri = '', id = 0) => {
  const itemId = `${item}ID`;
  return {group, item, itemId, uri, id};
};

/**
 * Creates and dispatches an action to update a vehicle image in the store.
 *
 * @param {string} group - The group or category the image belongs to (e.g., Interior, Exterior).
 * @param {string} item - The specific item type within the group (e.g., licensePlate, door).
 * @param {string} uri - The URI of the image to be uploaded.
 * @param {string} id - The unique identifier of the image.
 * @returns {function} Dispatches an action to update the vehicle image.
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

export function removeVehicleImage(group, item) {
  return dispatch => {
    const payload = itemsImagePayload(item, group, '', 0);

    dispatch({type: REMOVE_IMAGE, payload: payload});
  };
}
export const numberPlateSelected = (selectedInspectionID = null) => ({
  type: SELECTED_INSPECTION_ID,
  payload: selectedInspectionID,
});
export const updateIsLicensePlateUploaded = payload => ({
  type: IS_LICENSE_PLATE_UPLOADED,
  payload: payload,
});
export const categoryVariant = payload => ({
  type: CATEGORY_VARIANT,
  payload: payload,
});
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

export const setFileDetails = files => ({
  type: FILE_DETAILS,
  payload: files,
});

export const clearNewInspection = () => ({type: CLEAR_NEW_INSPECTION});
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
export const setVehicleType = vehicleType => ({
  type: VEHICLE_TYPE,
  payload: vehicleType,
});
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
export const clearInspectionImages = () => ({
  type: CLEAR_INSPECTION_IMAGES,
});
export const setCompanyId = companyId => ({
  type: COMPANY_ID,
  payload: companyId,
});
