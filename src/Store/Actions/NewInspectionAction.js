import {Types} from '../Types';

export function updateCarVerificationItemURI(item, uri) {
  let payload = {item: item, uri: uri};
  return dispatch =>
    dispatch({type: Types.CAR_VERIFICATION_ITEMS, payload: payload});
}
export function updateExteriorItemURI(item, uri) {
  let payload = {item: item, uri: uri};
  return dispatch =>
    dispatch({
      type: Types.EXTERIOR_ITEMS,
      payload: payload,
    });
}
export function updateTiresItemURI(item, uri) {
  let payload = {item: item, uri: uri};
  return dispatch =>
    dispatch({
      type: Types.TIRES,
      payload: payload,
    });
}
export function removeCarVerificationItemURI(item) {
  let payload = {item: item, uri: ''};
  return dispatch =>
    dispatch({type: Types.REMOVE_CAR_VERIFICATION_ITEM_URI, payload: payload});
}
export function removeExteriorItemURI(item) {
  let payload = {item: item, uri: ''};
  return dispatch =>
    dispatch({
      type: Types.REMOVE_EXTERIOR_ITEM_URI,
      payload: payload,
    });
}
export function removeTiresItemURI(item) {
  let payload = {item: item, uri: ''};
  return dispatch =>
    dispatch({
      type: Types.REMOVE_TIRES_ITEM_URI,
      payload: payload,
    });
}
