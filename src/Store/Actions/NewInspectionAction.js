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
export function NumberPlateSelectedAction(NP) {
  //pass data using api
  console.log(NP);
}
