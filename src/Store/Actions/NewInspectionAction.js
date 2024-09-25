import {Types} from '../Types';

export function UpdateCarVerificationItemURI(item, uri, id) {
  let payload = {item: item, uri: uri, id: id};
  return dispatch =>
    dispatch({type: Types.CAR_VERIFICATION_ITEMS, payload: payload});
}
export function UpdateExteriorItemURI(item, uri, id) {
  let payload = {item: item, uri: uri, id: id};
  return dispatch =>
    dispatch({
      type: Types.EXTERIOR_ITEMS,
      payload: payload,
    });
}
export function UpdateTiresItemURI(item, uri, id) {
  let payload = {item: item, uri: uri, id: id};
  return dispatch =>
    dispatch({
      type: Types.TIRES,
      payload: payload,
    });
}
export function RemoveCarVerificationItemURI(item) {
  let payload = {item: item, uri: '', id: 0};
  return dispatch =>
    dispatch({type: Types.REMOVE_CAR_VERIFICATION_ITEM_URI, payload: payload});
}
export function RemoveExteriorItemURI(item) {
  let payload = {item: item, uri: '', id: 0};
  return dispatch =>
    dispatch({
      type: Types.REMOVE_EXTERIOR_ITEM_URI,
      payload: payload,
    });
}
export function RemoveTiresItemURI(item) {
  let payload = {item: item, uri: '', id: 0};
  return dispatch =>
    dispatch({
      type: Types.REMOVE_TIRES_ITEM_URI,
      payload: payload,
    });
}
export function NumberPlateSelectedAction(selectedInspectionID) {
  let payload = {selectedInspectionID: selectedInspectionID};
  return dispatch =>
    dispatch({
      type: Types.SELECTED_INSPECTION_ID,
      payload: payload,
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
