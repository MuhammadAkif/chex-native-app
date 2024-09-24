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
    exteriorFrontLeftCorner: '',
    exteriorFrontLeftCornerID: '',
    exteriorFrontRightCorner: '',
    exteriorFrontRightCornerID: '',
    exteriorRearLeftCorner: '',
    exteriorRearLeftCornerID: '',
    exteriorRearRightCorner: '',
    exteriorRearRightCornerID: '',
    exteriorInsideCargoRoof: '',
    exteriorInsideCargoRoofID: '',
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
  skipLeft: false,
  skipLeftCorners: false,
  skipRight: false,
  skipRightCorners: false,
  isLicensePlateUploaded: false,
  vehicle_Type: 'existing',
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
    case Types.CLEAR_TIRES:
      return {
        ...state,
        tires: initialState.tires,
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
    case Types.CLEAR_INSPECTION_IMAGES:
      return {
        ...state,
        carVerificationItems: initialState.carVerificationItems,
        exteriorItems: initialState.exteriorItems,
        tires: initialState.tires,
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
    case Types.plate_Number:
      return {
        ...state,
        plateNumber: action.payload,
      };
    case Types.SKIP_LEFT:
      return {
        ...state,
        skipLeft: action.payload,
      };
    case Types.SKIP_LEFT_CORNERS:
      return {
        ...state,
        skipLeftCorners: action.payload,
      };
    case Types.SKIP_RIGHT:
      return {
        ...state,
        skipRight: action.payload,
      };
    case Types.SKIP_RIGHT_CORNERS:
      return {
        ...state,
        skipRightCorners: action.payload,
      };
    case Types.IS_LICENSE_PLATE_UPLOADED:
      return {
        ...state,
        isLicensePlateUploaded: action.payload,
      };
    case Types.VEHICLE_TYPE:
      return {
        ...state,
        vehicle_Type: action.payload,
      };
    case Types.CLEAR_NEW_INSPECTION:
      return initialState;
    default:
      return state;
  }
};

export default newInspectionReducer;
