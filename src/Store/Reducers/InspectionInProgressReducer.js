import {Types} from '../Types';

const initialState = {
  inspectionInProgress: [],
};
const inspectionInProgressReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_INSPECTION_IN_PROGRESS:
      return (state.inspectionInProgress = action.payload.inspectionInProgress);
    case Types.CLEAR_INSPECTION_IN_PROGRESS:
      return (state = initialState);
    default:
      return state;
  }
};

export default inspectionInProgressReducer;
