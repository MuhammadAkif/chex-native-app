import { Platform } from 'react-native';
import { IMAGES } from '../Assets/Images';
import i18n from 'i18next';

// Vehicle Types Constants
export const VEHICLE_TYPES = {
  VAN: 'van',
  SEDAN: 'sedan',
  TRUCK: 'truck',
  OTHER: 'other',
};

// Vehicle Types Display Names
export const VEHICLE_TYPE_DISPLAY_NAMES = {
  [VEHICLE_TYPES.VAN]: 'Van',
  [VEHICLE_TYPES.SEDAN]: 'Sedan',
  [VEHICLE_TYPES.TRUCK]: 'Truck',
  [VEHICLE_TYPES.OTHER]: 'Other',
};

// Vehicle Types that support frames
export const VEHICLE_TYPES_WITH_FRAMES = [VEHICLE_TYPES.VAN, VEHICLE_TYPES.SEDAN, VEHICLE_TYPES.TRUCK];

// Api Endpoints start here
const ENV_TYPE_URL = {
  staging: process.env.STAGING_URL,
  production: process.env.PRODUCTION_URL,
  development: process.env.DEVELOPMENT_URL,
  ngrok: process.env.NGROK_URL,
};

const version = '1';
export const API_VERSION_PATH = '/api/v' + version + '/';
export const API_BASE_URL = ENV_TYPE_URL.staging;
export const generateApiUrl = path => API_BASE_URL + API_VERSION_PATH + path;
export const S3_BUCKET_BASEURL = process.env.S3_BUCKET_BASEURL;
export const EXTRACT_NUMBER_PLATE_WITH_AI = process.env.EXTRACT_NUMBER_PLATE_URL;
export const nightImageCheckAI = process.env.NIGHT_IMAGE_CHECK;
export const MILEAGE_EXTRACTION = process.env.MILEAGE_EXTRACT;
export const AI_API_TOKEN = process.env.AI_API_TOKEN;
export const SMARTLOOK_PROJECT_ID = process.env.SMARTLOOK_PROJECT_ID;

// API endpoints
export const API_ENDPOINTS = {
  FETCH_NUMBER_PLATE_URL: generateApiUrl('searchnumberplate'),
  EXTRACT_NUMBER_PLATE_URL: generateApiUrl('extract/inspection/create'),
  EXTRACT_NUMBER_PLATE_WITH_AI_URL: process.env.EXTRACT_NUMBER_PLATE_URL,
  LOGIN_URL: generateApiUrl('auth/login'),
  /*New file upload api*/
  /*UPLOAD_URL: generateApiUrl('automation/file/upload'),*/
  /*Old file upload api*/
  UPLOAD_URL: generateApiUrl('file/upload'),
  CREATE_INSPECTION_URL: generateApiUrl('create/inspection'),
  FETCH_IN_PROGRESS_URL: generateApiUrl('status/vehicle'),
  VEHICLE_INFO_AGAINSET_LICENSE_PLATE: generateApiUrl('inspections/vehicle-info'),
  REGISTERED_VEHICLES: generateApiUrl('inspections/user-vehicles'),
  RECENT_INSPECTION: generateApiUrl('inspections/recent'),
  FORGET_PASSWORD_URL: generateApiUrl('auth/reset/email'),
  RESET_PASSWORD_URL: generateApiUrl('auth/reset/password'),
  INSPECTION_TIRE_STATUS_URL: generateApiUrl('display/tire'),
  UPDATE_MY_PROFILE: generateApiUrl('user'),
  REMOVE_ALL_TIRES_URL: generateApiUrl('delete/file'),
  ANNOTATION_URL: generateApiUrl('file/coordinate'),
  LOCATION_URL: generateApiUrl('inspection/location'),
  SUBMIT_INSPECTION: generateApiUrl('dsp/app/producer'),
  GET_USER_INSPECTION_STATS: generateApiUrl('user/stats'),
};
// Api Endpoints ends here
export const Platforms = {
  ANDROID: 'android',
  IOS: 'ios',
  WINDOW: 'window',
};
export const HARDWARE_BACK_PRESS = 'hardwareBackPress';
export const ANDROID = 'android';

export const INSPECTION = {
  carVerificiationItems: 'carVerificiationItems',
  interiorItems: 'interiorItems',
  exteriorItems: 'exteriorItems',
  tires: 'tires',
};
export const INSPECTION_SUBCATEGORY = {
  license_plate_number: 'licensePlate',
  odometer: 'odometer',
  exterior_front: 'exteriorFront',
  exterior_front_1: 'exteriorFront_1',
  exterior_front_2: 'exteriorFront_2',
  exterior_rear: 'exteriorRear',
  exterior_rear_1: 'exteriorRear_1',
  exterior_rear_2: 'exteriorRear_2',
  exterior_left: 'exteriorLeft',
  exterior_left_1: 'exteriorLeft_1',
  exterior_left_2: 'exteriorLeft_2',
  exterior_right: 'exteriorRight',
  exterior_right_1: 'exteriorRight_1',
  exterior_right_2: 'exteriorRight_2',
  front_left_corner: 'exteriorFrontLeftCorner',
  front_left_corner_1: 'exteriorFrontLeftCorner_1',
  front_left_corner_2: 'exteriorFrontLeftCorner_2',
  front_right_corner: 'exteriorFrontRightCorner',
  front_right_corner_1: 'exteriorFrontRightCorner_1',
  front_right_corner_2: 'exteriorFrontRightCorner_2',
  rear_left_corner: 'exteriorRearLeftCorner',
  rear_left_corner_1: 'exteriorRearLeftCorner_1',
  rear_left_corner_2: 'exteriorRearLeftCorner_2',
  rear_right_corner: 'exteriorRearRightCorner',
  rear_right_corner_1: 'exteriorRearRightCorner_1',
  rear_right_corner_2: 'exteriorRearRightCorner_2',
  interior_driver_side: 'driverSide',
  interior_driver_side_1: 'driverSide_1',
  interior_driver_side_2: 'driverSide_2',
  interior_passenger_side: 'passengerSide',
  interior_passenger_side_1: 'passengerSide_1',
  interior_passenger_side_2: 'passengerSide_2',
  inside_cargo_roof: 'exteriorInsideCargoRoof',
  inside_cargo_roof_1: 'exteriorInsideCargoRoof_1',
  inside_cargo_roof_2: 'exteriorInsideCargoRoof_2',
  left_front_tire: 'leftFrontTire',
  left_rear_tire: 'leftRearTire',
  right_front_tire: 'rightFrontTire',
  right_rear_tire: 'rightRearTire',
};
export const INSPECTION_TITLE = {
  license_plate_number: i18n.t('inspectionTitles.license_plate_number'),
  odometer: i18n.t('inspectionTitles.odometer'),
  exterior_front: i18n.t('inspectionTitles.exterior_front'),
  exterior_front_1: i18n.t('inspectionTitles.exterior_front_1'),
  exterior_front_2: i18n.t('inspectionTitles.exterior_front_2'),
  exterior_rear: i18n.t('inspectionTitles.exterior_rear'),
  exterior_rear_1: i18n.t('inspectionTitles.exterior_rear_1'),
  exterior_rear_2: i18n.t('inspectionTitles.exterior_rear_2'),
  exterior_left: i18n.t('inspectionTitles.exterior_left'),
  exterior_left_1: i18n.t('inspectionTitles.exterior_left_1'),
  exterior_left_2: i18n.t('inspectionTitles.exterior_left_2'),
  exterior_right: i18n.t('inspectionTitles.exterior_right'),
  exterior_right_1: i18n.t('inspectionTitles.exterior_right_1'),
  exterior_right_2: i18n.t('inspectionTitles.exterior_right_2'),
  front_left_corner: i18n.t('inspectionTitles.front_left_corner'),
  front_left_corner_1: i18n.t('inspectionTitles.front_left_corner_1'),
  front_left_corner_2: i18n.t('inspectionTitles.front_left_corner_2'),
  front_right_corner: i18n.t('inspectionTitles.front_right_corner'),
  front_right_corner_1: i18n.t('inspectionTitles.front_right_corner_1'),
  front_right_corner_2: i18n.t('inspectionTitles.front_right_corner_2'),
  rear_left_corner: i18n.t('inspectionTitles.rear_left_corner'),
  rear_left_corner_1: i18n.t('inspectionTitles.rear_left_corner_1'),
  rear_left_corner_2: i18n.t('inspectionTitles.rear_left_corner_2'),
  rear_right_corner: i18n.t('inspectionTitles.rear_right_corner'),
  rear_right_corner_1: i18n.t('inspectionTitles.rear_right_corner_1'),
  rear_right_corner_2: i18n.t('inspectionTitles.rear_right_corner_2'),
  inside_cargo_roof: i18n.t('inspectionTitles.inside_cargo_roof'),
  inside_cargo_roof_1: i18n.t('inspectionTitles.inside_cargo_roof_1'),
  inside_cargo_roof_2: i18n.t('inspectionTitles.inside_cargo_roof_2'),
  left_front_tire: i18n.t('inspectionTitles.left_front_tire'),
  left_rear_tire: i18n.t('inspectionTitles.left_rear_tire'),
  right_front_tire: i18n.t('inspectionTitles.right_front_tire'),
  right_rear_tire: i18n.t('inspectionTitles.right_rear_tire'),
  interior_passenger_side: i18n.t('inspectionTitles.interior_passenger_side'),
  interior_driver_side: i18n.t('inspectionTitles.interior_driver_side'),
};
export const UPDATE_APP = {
  TITLE: i18n.t('appUpdate.title'),
  MESSAGE: i18n.t('appUpdate.message'),
  BUTTON: i18n.t('appUpdate.button'),
};
export const SESSION_EXPIRED = {
  TITLE: i18n.t('session.expired.title'),
  MESSAGE: i18n.t('session.expired.message'),
  BUTTON: i18n.t('session.expired.button'),
};

export const ANNOTATE_IMAGE_DETAILS = {
  title: 'Exterior Front',
  source: IMAGES.front_Left_Corner,
  description:
    "To annotate an image of a vehicle's, you can click directly on the area of interest within the image. Upon clicking, a damage icon will appear at the selected spot, allowing you to visually mark and highlight the specific location of any damage.",
  instruction: 'Do you want to Annotate\n',
  annotateText: 'Annotate',
  skipText: 'Skip',
};
export const ANNOTATE_IMAGE = {
  title: 'Exterior Front',
  source: IMAGES.front_Left_Corner,
  description:
    "To annotate an image of a vehicle's front, you can click directly on the area of interest within the image. Upon clicking, a damage icon will appear at the selected spot, allowing you to visually mark and highlight the specific location of any damage.",
  instruction: 'Do you want to Annotate\n',
  annotateText: 'Submit',
  cancelText: 'Cancel',
};

export const DAMAGE_TYPE = ['Minor', 'Major', 'Severe'];
export const Image_Type = [];

export const PROJECT_NAME = {
  CHEX_AI: 'CHEX.AI',
  CHEX: 'CHEX',
  AI: '.AI',
};

export const DRAWER = {
  HOME: 'HOME',
  THINGS_YOU_WILL_REQUIRE: 'Things you will require',
  LOGOUT: 'Logout',
  DVIRC: 'DVIRC',
};

export const INSPECTION_STATUSES = ['IN_REVIEW', 'REVIEWED', 'READY_FOR_REVIEW'];
export const STATUSES = {
  REVIEWED: 'Reviewed',
  READY_FOR_REVIEW: 'Ready For Review',
  IN_REVIEW: 'In Review',
  IN_PROGRESS: 'In Progress',
};
export const PHYSICAL_DEVICES = ['wide-angle-camera', 'ultra-wide-angle-camera', 'telephoto-camera'];
export const IS_BACK_CAMERA = {
  front: true,
  back: false,
};
export const SWITCH_CAMERA = {
  true: 'front',
  false: 'back',
};

export const Delete_Messages = {
  success: i18n.t('delete.success'),
  failed: i18n.t('delete.failed'),
};
export const customSortOrder = {
  groupType: ['carVerificiationItems', 'interiorItems', 'exteriorItems', 'tires'],
  carVerificiationItems: ['license_plate_number', 'odometer'],
  interiorItems: [
    'interior_passenger_side',
    'interior_passenger_side0',
    'interior_passenger_side1',
    'interior_passenger_side2',
    'interior_driver_side',
    'interior_driver_side0',
    'interior_driver_side1',
    'interior_driver_side2',
  ],
  exteriorItems: [
    'exterior_left',
    'exterior_left0',
    'exterior_left1',
    'exterior_left2',
    'exterior_right',
    'exterior_right0',
    'exterior_right1',
    'exterior_right2',
    'exterior_front',
    'exterior_front0',
    'exterior_front1',
    'exterior_front2',
    'exterior_rear',
    'exterior_rear0',
    'exterior_rear1',
    'exterior_rear2',
    'front_left_corner',
    'front_left_corner0',
    'front_left_corner1',
    'front_left_corner2',
    'front_right_corner',
    'front_right_corner0',
    'front_right_corner1',
    'front_right_corner2',
    'rear_left_corner',
    'rear_left_corner0',
    'rear_left_corner1',
    'rear_left_corner2',
    'rear_right_corner',
    'rear_right_corner0',
    'rear_right_corner1',
    'rear_right_corner2',
    'inside_cargo_roof',
    'inside_cargo_roof0',
    'inside_cargo_roof1',
    'inside_cargo_roof2',
  ],
  tires: ['left_front_tire', 'left_rear_tire', 'right_front_tire', 'right_rear_tire'],
};
export const darkImageError = {
  title: i18n.t('errors.darkImageError.title'),
  message: i18n.t('errors.darkImageError.message'),
};
export const uploadFailed = {
  title: i18n.t('errors.uploadFailed.title'),
  message: i18n.t('errors.uploadFailed.message'),
};
export const exitAppInfo = {
  title: i18n.t('exitApp.title'),
  message: i18n.t('exitApp.message'),
  button: {
    yes: i18n.t('exitApp.button.yes'),
    cancel: i18n.t('exitApp.button.cancel'),
  },
};

export const NoInteriorAndRoofTopCompanyIds = [121];

export const hasInteriorAndRoofTopCompany = companyId => {
  if (NoInteriorAndRoofTopCompanyIds.includes(companyId)) return true;
  return false;
};

export const VEHICLE_IMAGES = {
  [VEHICLE_TYPES.VAN]: IMAGES.Van,
  [VEHICLE_TYPES.TRUCK]: IMAGES.Truck,
  [VEHICLE_TYPES.SEDAN]: IMAGES.Sedan,
  [VEHICLE_TYPES.OTHER]: IMAGES.other_vehicle,
};

export const INSPECTION_RESULTS = {
  pending: 'Pending',
  pass: 'Passed',
  fail: 'Failed',
};

export const isIOS = Platform.OS == Platforms.IOS;
