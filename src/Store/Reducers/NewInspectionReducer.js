import {Types} from '../Types';

const initialState = {
  carVerificiationItems: {
    licensePlate: '',
    licensePlateID: '',
    odometer: '',
    odometerID: '',
  },
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
    /* exteriorInteriorDriverSide: '',
    exteriorInteriorDriverSideID: '',
    exteriorInteriorDriverSide_1: '',
    exteriorInteriorDriverSide_1ID: '',
    exteriorInteriorDriverSide_2: '',
    exteriorInteriorDriverSide_2ID: '',
    exteriorInteriorPassengerSide: '',
    exteriorInteriorPassengerSideID: '',
    exteriorInteriorPassengerSide_1: '',
    exteriorInteriorPassengerSide_1ID: '',
    exteriorInteriorPassengerSide_2: '',
    exteriorInteriorPassengerSide_2ID: '',*/
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
  variant: 0,
  fileDetails: null,
};
const {
  ITEMS_IMAGES,
  REMOVE_IMAGES,
  CLEAR_TIRES,
  CLEAR_INSPECTION_IMAGES,
  SELECTED_INSPECTION_ID,
  company_ID,
  plate_Number,
  SKIP_LEFT,
  SKIP_LEFT_CORNERS,
  SKIP_RIGHT,
  SKIP_RIGHT_CORNERS,
  IS_LICENSE_PLATE_UPLOADED,
  VEHICLE_TYPE,
  CATEGORY_VARIANT,
  FILE_DETAILS,
  CLEAR_NEW_INSPECTION,
} = Types;
const newInspectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ITEMS_IMAGES:
      return {
        ...state,
        [action.payload.group]: {
          ...state[action.payload.group],
          [action.payload.item]: action.payload.uri,
          [action.payload.item_Id]: action.payload.id,
        },
      };
    case REMOVE_IMAGES:
      return {
        ...state,
        [action.payload.group]: {
          ...state[action.payload.group],
          [action.payload.item]: action.payload.uri,
          [action.payload.item_Id]: action.payload.id,
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
        exteriorItems: initialState.exteriorItems,
        tires: initialState.tires,
      };
    case SELECTED_INSPECTION_ID:
      return {
        ...state,
        selectedInspectionID: action.payload,
      };
    case company_ID:
      return {
        ...state,
        company_ID: action.payload,
      };
    case plate_Number:
      return {
        ...state,
        plateNumber: action.payload,
      };
    case SKIP_LEFT:
      return {
        ...state,
        skipLeft: action.payload,
      };
    case SKIP_LEFT_CORNERS:
      return {
        ...state,
        skipLeftCorners: action.payload,
      };
    case SKIP_RIGHT:
      return {
        ...state,
        skipRight: action.payload,
      };
    case SKIP_RIGHT_CORNERS:
      return {
        ...state,
        skipRightCorners: action.payload,
      };
    case IS_LICENSE_PLATE_UPLOADED:
      return {
        ...state,
        isLicensePlateUploaded: action.payload,
      };
    case VEHICLE_TYPE:
      return {
        ...state,
        vehicle_Type: action.payload,
      };
    case CATEGORY_VARIANT:
      return {
        ...state,
        variant: action.payload,
      };
    case FILE_DETAILS:
      return {
        ...state,
        fileDetails: action.payload,
      };
    case CLEAR_NEW_INSPECTION:
      return initialState;
    default:
      return state;
  }
};

export default newInspectionReducer;
