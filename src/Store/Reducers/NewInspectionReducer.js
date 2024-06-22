import {Types} from '../Types';

const initialState = {
  carVerificationItems: {
    licensePlate: '',
    licensePlateID: '',
    odometer: '',
    odometerID: '',
  },
  exteriorItems: {
    exteriorLeft: '',
    exteriorLeftID: '',
    exteriorRight: '',
    exteriorRightID: '',
    exteriorFront: '',
    exteriorFrontID: '',
    exteriorRear: '',
    exteriorRearID: '',
  },
  tires: {
    leftFrontTire: '',
    leftFrontTireID: '',
    leftRearTire: '',
    leftRearTireID: '',
    rightFrontTire: '',
    rightFrontTireID: '',
    rightRearTire: '',
    rightRearTireID: '',
  },
  selectedInspectionID: null,
  company_ID: null,
  plateNumber: null,
  isVehicleDetailVisible: false,
};

const newInspectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.CAR_VERIFICATION_ITEMS:
      return {
        ...state,
        carVerificationItems: {
          ...state.carVerificationItems,
          [action.payload.item]: action.payload.uri,
          [`${action.payload.item}ID`]: action.payload.id,
        },
      };
    case Types.EXTERIOR_ITEMS:
      return {
        ...state,
        exteriorItems: {
          ...state.exteriorItems,
          [action.payload.item]: action.payload.uri,
          [`${action.payload.item}ID`]: action.payload.id,
        },
      };
    case Types.TIRES:
      return {
        ...state,
        tires: {
          ...state.tires,
          [action.payload.item]: action.payload.uri,
          [`${action.payload.item}ID`]: action.payload.id,
        },
      };
    case Types.REMOVE_CAR_VERIFICATION_ITEM_URI:
      return {
        ...state,
        carVerificationItems: {
          ...state.carVerificationItems,
          [action.payload.item]: action.payload.uri,
          [`${action.payload.item}ID`]: action.payload.id,
        },
      };
    case Types.REMOVE_EXTERIOR_ITEM_URI:
      return {
        ...state,
        exteriorItems: {
          ...state.exteriorItems,
          [action.payload.item]: action.payload.uri,
          [`${action.payload.item}ID`]: action.payload.id,
        },
      };
    case Types.REMOVE_TIRES_ITEM_URI:
      return {
        ...state,
        tires: {
          ...state.tires,
          [action.payload.item]: action.payload.uri,
          [`${action.payload.item}ID`]: action.payload.id,
        },
      };
    case Types.SELECTED_INSPECTION_ID:
      return {
        ...state,
        selectedInspectionID: action.payload.selectedInspectionID,
      };
    case Types.company_ID:
      return {
        ...state,
        company_ID: action.payload,
      };
    case Types.IS_VEHICLE_DETAIL_VISIBLE:
      return {
        ...state,
        isVehicleDetailVisible: action.payload,
      };
    case Types.plate_Number:
      return {
        ...state,
        plateNumber: action.payload,
      };
    case Types.CLEAR_NEW_INSPECTION:
      return initialState;
    default:
      return state;
  }
};

export default newInspectionReducer;
