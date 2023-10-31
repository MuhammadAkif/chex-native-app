import {Types} from '../Types';

export function UpdateCarVerificationItemURI(item, uri) {
  let payload = {item: item, uri: uri};
  return dispatch =>
    dispatch({type: Types.CAR_VERIFICATION_ITEMS, payload: payload});
}
export function UpdateExteriorItemURI(item, uri) {
  let payload = {item: item, uri: uri};
  return dispatch =>
    dispatch({
      type: Types.EXTERIOR_ITEMS,
      payload: payload,
    });
}
export function UpdateTiresItemURI(item, uri) {
  let payload = {item: item, uri: uri};
  return dispatch =>
    dispatch({
      type: Types.TIRES,
      payload: payload,
    });
}
export function RemoveCarVerificationItemURI(item) {
  let payload = {item: item, uri: ''};
  return dispatch =>
    dispatch({type: Types.REMOVE_CAR_VERIFICATION_ITEM_URI, payload: payload});
}
export function RemoveExteriorItemURI(item) {
  let payload = {item: item, uri: ''};
  return dispatch =>
    dispatch({
      type: Types.REMOVE_EXTERIOR_ITEM_URI,
      payload: payload,
    });
}
export function RemoveTiresItemURI(item) {
  let payload = {item: item, uri: ''};
  return dispatch =>
    dispatch({
      type: Types.REMOVE_TIRES_ITEM_URI,
      payload: payload,
    });
}
export function NumberPlateSelectedAction(NP) {
  //pass data using api
  console.log(NP);
};
