import {Types} from '../Types';

const initialState = {
  carVerificationItems: {
    licensePlate: '',
    odometer: '',
  },
  exteriorItems: {
    exteriorLeft: '',
    exteriorRight: '',
    exteriorFront: '',
    exteriorRear: '',
  },
  tires: {
    leftFrontTire: '',
    leftRearTire: '',
    rightFrontTire: '',
    rightRearTire: '',
  },
};

const newInspectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.CAR_VERIFICATION_ITEMS:
      return {
        ...state,
        carVerificationItems: {
          ...state.carVerificationItems,
          [action.payload.item]: action.payload.uri,
        },
      };
    case Types.EXTERIOR_ITEMS:
      return {
        ...state,
        exteriorItems: {
          ...state.exteriorItems,
          [action.payload.item]: action.payload.uri,
        },
      };
    case Types.TIRES:
      return {
        ...state,
        tires: {
          ...state.tires,
          [action.payload.item]: action.payload.uri,
        },
      };
    case Types.REMOVE_CAR_VERIFICATION_ITEM_URI:
      return {
        ...state,
        carVerificationItems: {
          ...state.carVerificationItems,
          [action.payload.item]: action.payload.uri,
        },
      };
    case Types.REMOVE_EXTERIOR_ITEM_URI:
      return {
        ...state,
        exteriorItems: {
          ...state.exteriorItems,
          [action.payload.item]: action.payload.uri,
        },
      };
    case Types.REMOVE_TIRES_ITEM_URI:
      return {
        ...state,
        tires: {
          ...state.tires,
          [action.payload.item]: action.payload.uri,
        },
      };
    case Types.CLEAR_NEW_INSPECTION:
      return initialState;
    default:
      return state;
  }
};

export default newInspectionReducer;
