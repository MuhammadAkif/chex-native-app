import {Types} from '../Types';

export function UpdateVehicleImages(group, item, uri, id) {
  const item_Id = item + 'ID';
  let payload = {group: group, item: item, item_Id: item_Id, uri: uri, id: id};
  return dispatch => dispatch({type: Types.ITEMS_IMAGES, payload: payload});
}
export function RemoveVehicleImages(group, item) {
  const item_Id = item + 'ID';
  let payload = {group: group, item: item, item_Id: item_Id, uri: '', id: 0};
  return dispatch => dispatch({type: Types.REMOVE_IMAGES, payload: payload});
}
export function NumberPlateSelectedAction(selectedInspectionID = null) {
  return dispatch =>
    dispatch({
      type: Types.SELECTED_INSPECTION_ID,
      payload: selectedInspectionID,
    });
}
export function Update_Is_License_Plate_Uploaded(payload) {
  return dispatch =>
    dispatch({
      type: Types.IS_LICENSE_PLATE_UPLOADED,
      payload: payload,
    });
}
export function Category_Variant(payload) {
  return dispatch =>
    dispatch({
      type: Types.CATEGORY_VARIANT,
      payload: payload,
    });
}
export function File_Details(payload) {
  return dispatch =>
    dispatch({
      type: Types.FILE_DETAILS,
      payload: payload,
    });
}
