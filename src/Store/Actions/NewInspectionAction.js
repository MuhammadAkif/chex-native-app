import {VEHICLE_TYPES} from '../../Constants';
import {ROUTES} from '../../Navigation/ROUTES';
import {ai_Mileage_Extraction, extractLicensePlateAI, getInspectionDetails} from '../../services/inspection';
import {uploadInProgressMediaToStore} from '../../Utils';
import {Types} from '../Types';

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
  SET_VEHICLE_TYPE_MODAL_VISIBLE,
  SET_SELECTED_VEHICLE_KIND,
} = Types;

const itemsImagePayload = (item = '', group = '', uri = '', id = 0) => {
  const itemId = `${item}ID`;
  return {group, item, itemId, uri, id};
};
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
    const {files = {}, vehicleType} = response?.data || {};

    dispatch(setSelectedVehicleKind(vehicleType));

    if (vehicleType == VEHICLE_TYPES.TRUCK) {
      dispatch(numberPlateSelected(inspectionId));
    } else {
      uploadInProgressMediaToStore(files, dispatch);
      dispatch(setFileDetails(files));
    }

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
export const setVehicleTypeModalVisible = (visible = false) => ({
  type: SET_VEHICLE_TYPE_MODAL_VISIBLE,
  payload: visible,
});
export const setSelectedVehicleKind = kind => ({
  type: SET_SELECTED_VEHICLE_KIND,
  payload: kind,
});
