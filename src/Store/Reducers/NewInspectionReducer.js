import {Types} from '../Types';

const initialState = {
  // Section: Vehicle Verification
  carVerificiationItems: {
    licensePlate: '',
    licensePlateID: '',
    odometer: '',
    odometerID: '',
  },

  // Section: Interior Inspection Images
  interiorItems: {
    driverSide: '',
    driverSideID: '',
    driverSide_1: '',
    driverSide_1ID: '',
    driverSide_2: '',
    driverSide_2ID: '',
    passengerSide: '',
    passengerSideID: '',
    passengerSide_1: '',
    passengerSide_1ID: '',
    passengerSide_2: '',
    passengerSide_2ID: '',
  },

  // Section: Exterior Inspection Images
  exteriorItems: {
    exteriorLeft: '',
    exteriorLeftID: '',
    exteriorLeft_1: '',
    exteriorLeft_1ID: '',
    exteriorLeft_2: '',
    exteriorLeft_2ID: '',
    exteriorRight: '',
    exteriorRightID: '',
    exteriorRight_1: '',
    exteriorRight_1ID: '',
    exteriorRight_2: '',
    exteriorRight_2ID: '',
    exteriorFront: '',
    exteriorFrontID: '',
    exteriorFront_1: '',
    exteriorFront_1ID: '',
    exteriorFront_2: '',
    exteriorFront_2ID: '',
    exteriorRear: '',
    exteriorRearID: '',
    exteriorRear_1: '',
    exteriorRear_1ID: '',
    exteriorRear_2: '',
    exteriorRear_2ID: '',
    exteriorFrontLeftCorner: '',
    exteriorFrontLeftCornerID: '',
    exteriorFrontLeftCorner_1: '',
    exteriorFrontLeftCorner_1ID: '',
    exteriorFrontLeftCorner_2: '',
    exteriorFrontLeftCorner_2ID: '',
    exteriorFrontRightCorner: '',
    exteriorFrontRightCornerID: '',
    exteriorFrontRightCorner_1: '',
    exteriorFrontRightCorner_1ID: '',
    exteriorFrontRightCorner_2: '',
    exteriorFrontRightCorner_2ID: '',
    exteriorRearLeftCorner: '',
    exteriorRearLeftCornerID: '',
    exteriorRearLeftCorner_1: '',
    exteriorRearLeftCorner_1ID: '',
    exteriorRearLeftCorner_2: '',
    exteriorRearLeftCorner_2ID: '',
    exteriorRearRightCorner: '',
    exteriorRearRightCornerID: '',
    exteriorRearRightCorner_1: '',
    exteriorRearRightCorner_1ID: '',
    exteriorRearRightCorner_2: '',
    exteriorRearRightCorner_2ID: '',
    exteriorInsideCargoRoof: '',
    exteriorInsideCargoRoofID: '',
    exteriorInsideCargoRoof_1: '',
    exteriorInsideCargoRoof_1ID: '',
    exteriorInsideCargoRoof_2: '',
    exteriorInsideCargoRoof_2ID: '',
    // Reserved for future feature (Interior panels from exterior POV)
    // exteriorInteriorDriverSide: '',
    // ...
  },

  // Section: Tire Photos
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

  // Additional Metadata and Controls
  selectedInspectionID: null,
  company_ID: null,
  plateNumber: null,
  skipLeft: false,
  skipLeftCorners: false,
  skipRight: false,
  skipRightCorners: false,
  isLicensePlateUploaded: false,
  vehicle_Type: 'existing', // 'existing' | 'new'
  variant: 0, // Category variant (0, 1, 2)
  fileDetails: null,
  flashMode: 'off', // Camera flash mode
};

const {
  UPDATE_VEHICLE_IMAGE,
  REMOVE_IMAGE,
  CLEAR_TIRES,
  CLEAR_INSPECTION_IMAGES,
  SELECTED_INSPECTION_ID,
  COMPANY_ID,
  LICENSE_PLATE_NUMBER,
  SKIP_LEFT,
  SKIP_LEFT_CORNERS,
  SKIP_RIGHT,
  SKIP_RIGHT_CORNERS,
  IS_LICENSE_PLATE_UPLOADED,
  VEHICLE_TYPE,
  CATEGORY_VARIANT,
  FILE_DETAILS,
  CLEAR_NEW_INSPECTION,
  FLASH_MODE,
} = Types;

/**
 * Reducer to manage the state of a new vehicle inspection session.
 *
 * Handles image updates, metadata, flow controls (e.g., skip sections),
 * and reset scenarios.
 */
const newInspectionReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case UPDATE_VEHICLE_IMAGE:
      return {
        ...state,
        [payload.group]: {
          ...state[payload.group],
          [payload.item]: payload.uri,
          [payload.itemId]: payload.id,
        },
      };

    case REMOVE_IMAGE:
      return {
        ...state,
        [payload.group]: {
          ...state[payload.group],
          [payload.item]: payload.uri,
          [payload.itemId]: payload.id,
        },
      };

    case CLEAR_TIRES:
      return {
        ...state,
        tires: initialState.tires,
      };

    case CLEAR_INSPECTION_IMAGES:
      return {
        ...state,
        carVerificiationItems: initialState.carVerificiationItems,
        interiorItems: initialState.interiorItems,
        exteriorItems: initialState.exteriorItems,
        tires: initialState.tires,
      };

    case SELECTED_INSPECTION_ID:
      return {...state, selectedInspectionID: payload};

    case COMPANY_ID:
      return {...state, company_ID: payload};

    case LICENSE_PLATE_NUMBER:
      return {...state, plateNumber: payload};

    case SKIP_LEFT:
      return {...state, skipLeft: payload};

    case SKIP_LEFT_CORNERS:
      return {...state, skipLeftCorners: payload};

    case SKIP_RIGHT:
      return {...state, skipRight: payload};

    case SKIP_RIGHT_CORNERS:
      return {...state, skipRightCorners: payload};

    case IS_LICENSE_PLATE_UPLOADED:
      return {...state, isLicensePlateUploaded: payload};

    case VEHICLE_TYPE:
      return {...state, vehicle_Type: payload};

    case CATEGORY_VARIANT:
      return {...state, variant: payload};

    case FILE_DETAILS:
      return {...state, fileDetails: payload};

    case FLASH_MODE:
      return {...state, flashMode: payload};

    case CLEAR_NEW_INSPECTION:
      return initialState;

    default:
      return state;
  }
};

export default newInspectionReducer;
