import {Types} from '../Types';

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
  SET_REQUIRED,
  BATCH_UPDATE_VEHICLE_IMAGES,
  SET_MILEAGE,
  SET_FEEDBACK,
  SET_MILEAGE_VISIBLE,
  SET_PLATE_NUMBER_VISIBLE,
  SET_TRIGGER_TIRE_STATUS_CHECK,
  SET_MILEAGE_MESSAGE,
  SET_IMAGE_DIMENSIONS,
  FLASH_MODE,
} = Types;

// Initial state shape for a vehicle inspection session
const initialState = {
  /** Section: Vehicle Verification Inputs */
  carVerificiationItems: {
    licensePlate: '',
    licensePlateID: '',
    odometer: '',
    odometerID: '',
  },

  /** Section: Interior Inspection Images */
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

  /** Section: Exterior Inspection Images */
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
  },

  /** Section: Tire Photos */
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

  /** Metadata & UI Control Flags */
  selectedInspectionID: null, // Current inspection session ID
  company_ID: null, // Associated company identifier
  plateNumber: null, // OCR-extracted plate number
  plateNumberVisible: null, // Control display of plate number input
  skipLeft: false, // Skip left-side exterior
  skipLeftCorners: false,
  skipRight: false,
  skipRightCorners: false,
  isLicensePlateUploaded: false, // Tracks if plate image uploaded
  vehicle_Type: 'existing', // 'existing' or 'new'
  variant: 0, // Category variant (0, 1, 2)
  fileDetails: null, // Detailed file metadata
  fileRequired: null, // Validation rules for files
  mileage: '', // OCR-extracted mileage string
  mileageMessage: '', // Validation or error message
  feedback: '', // User-entered feedback
  mileageVisible: false, // Toggle mileage input visibility
  triggerTireStatusCheck: false, // Flag to initiate tire health check
  imageDimensions: null, // Captured image dimension data
  flashMode: 'off', // Camera flash ('on' | 'off' | 'auto')
};

/**
 * Reducer: newInspectionReducer
 * @param {Object} state - Current inspection state
 * @param {Object} action - Redux action
 * @returns {Object} New state after applying the action
 *
 * Manages state for adding/removing images, metadata updates,
 * flow control flags, and reset logic.
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
      return {...state, tires: initialState.tires};

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

    case SET_REQUIRED:
      return {...state, fileRequired: payload};

    case BATCH_UPDATE_VEHICLE_IMAGES:
      const updatedState = {...state};

      payload.forEach(update => {
        const {groupType, item, imageURL, id} = update;
        updatedState[groupType] = {
          ...updatedState[groupType],
          [item]: imageURL,
          [`${item}ID`]: id,
        };
      });

      return updatedState;

    case SET_FEEDBACK:
      return {...state, feedback: payload};

    case SET_MILEAGE:
      return {...state, mileage: payload};

    case SET_MILEAGE_MESSAGE:
      return {...state, mileageMessage: payload};

    case SET_PLATE_NUMBER_VISIBLE:
      return {...state, plateNumberVisible: payload};

    case SET_MILEAGE_VISIBLE:
      return {...state, mileageVisible: payload};

    case SET_TRIGGER_TIRE_STATUS_CHECK:
      return {...state, triggerTireStatusCheck: payload};

    case SET_IMAGE_DIMENSIONS:
      return {...state, imageDimensions: payload};

    case FLASH_MODE:
      return {...state, flashMode: payload};

    case CLEAR_NEW_INSPECTION:
      // Reset entire inspection state
      return initialState;

    default:
      return state;
  }
};

export default newInspectionReducer;
