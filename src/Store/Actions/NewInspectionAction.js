import {Types} from '../Types';

const {
  UPDATE_VEHICLE_IMAGE,
  REMOVE_IMAGE,
  SELECTED_INSPECTION_ID,
  IS_LICENSE_PLATE_UPLOADED,
  CATEGORY_VARIANT,
  FILE_DETAILS,
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
