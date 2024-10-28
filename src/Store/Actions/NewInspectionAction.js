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
export const fileDetails = payload => ({
  type: FILE_DETAILS,
  payload: payload,
});
export const clearNewInspection = () => ({type: CLEAR_NEW_INSPECTION});
export const clearTires = () => ({type: CLEAR_TIRES});
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
export const setLicensePlateNumber = plateNumber => ({
  type: LICENSE_PLATE_NUMBER,
  payload: plateNumber,
});
export const clearInspectionImages = () => ({
  type: CLEAR_INSPECTION_IMAGES,
});
export const setCompanyId = companyId => ({
  type: COMPANY_ID,
  payload: companyId,
});
