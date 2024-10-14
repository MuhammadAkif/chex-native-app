import {Types} from '../Types';

const initialState = {
  carVerificationItems: {
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
    exteriorInteriorDriverSide: '',
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
    exteriorInteriorPassengerSide_2ID: '',
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
    case Types.CATEGORY_VARIANT:
      return {
        ...state,
        variant: action.payload,
      };
    case Types.FILE_DETAILS:
      return {
        ...state,
        fileDetails: action.payload,
      };
    case Types.CLEAR_NEW_INSPECTION:
      return initialState;
    default:
      return state;
  }
};

export default newInspectionReducer;
