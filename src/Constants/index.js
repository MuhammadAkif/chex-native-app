// Api Endpoints start here
import {IMAGES} from '../Assets/Images';

const ENV_TYPE_URL = {
  staging: process.env.STAGING_URL,
  production: process.env.PRODUCTION_URL,
  development: process.env.DEVELOPMENT_URL,
};
export const API_BASE_URL =
  'https://bed-paraguay-brave-documents.trycloudflare.com';
// export const DEV_URL = ENV_TYPE_URL.development;
const generateApiUrl = path => API_BASE_URL + path;
export const S3_BUCKET_BASEURL = process.env.S3_BUCKET_BASEURL;
export const FETCH_NUMBER_PLATE_URL = generateApiUrl(
  '/api/v1/searchnumberplate',
);
export const EXTRACT_NUMBER_PLATE = generateApiUrl(
  '/api/v1/extract/inspection/create',
);
export const EXTRACT_NUMBER_PLATE_WITH_AI =
  process.env.EXTRACT_NUMBER_PLATE_URL;
export const LOGIN_URL = generateApiUrl('/api/v1/auth/login');
export const UPLOAD_URL = generateApiUrl('/api/v1/file/upload');
export const CREATE_INSPECTION_URL = generateApiUrl(
  '/api/v1/create/inspection',
);
export const FETCH_IN_PROGRESS_URL = generateApiUrl('/api/v1/status/vehicle');
export const FORGET_PASSWORD_URL = generateApiUrl('/api/v1/auth/reset/email');
export const RESET_PASSWORD_URL = generateApiUrl('/api/v1/auth/reset/password');
export const INSPECTION_TIRE_STATUS = generateApiUrl('/api/v1/display/tire');
export const REMOVE_ALL_TIRES = generateApiUrl('/api/v1/delete/file');
export const ANNOTATION = generateApiUrl('/api/v1/file/coordinate');
export const AI_API_TOKEN = process.env.AI_API_TOKEN;
// Api Endpoints ends here

/*
// Dynamically set the base URL based on the environment
const ENV = process.env.NODE_ENV || 'development';
const API_BASE_URL = process.env[`${ENV.toUpperCase()}_URL`] || 'http://localhost:3000';
const S3_BUCKET_BASE_URL = process.env.S3_BUCKET_BASEURL;
const AI_API_TOKEN = process.env.AI_API_TOKEN;

// Group all API endpoints
export const API_ENDPOINTS = {
  FETCH_NUMBER_PLATE_URL: `${API_BASE_URL}/api/v1/searchnumberplate`,
  EXTRACT_NUMBER_PLATE_URL: `${API_BASE_URL}/api/v1/extract/inspection/create`,
  EXTRACT_NUMBER_PLATE_WITH_AI_URL: process.env.EXTRACT_NUMBER_PLATE_URL,
  LOGIN_URL: `${API_BASE_URL}/api/v1/auth/login`,
  UPLOAD_URL: `${API_BASE_URL}/api/v1/file/upload`,
  CREATE_INSPECTION_URL: `${API_BASE_URL}/api/v1/create/inspection`,
  FETCH_IN_PROGRESS_URL: `${API_BASE_URL}/api/v1/status/vehicle`,
  FORGET_PASSWORD_URL: `${API_BASE_URL}/api/v1/auth/reset/email`,
  RESET_PASSWORD_URL: `${API_BASE_URL}/api/v1/auth/reset/password`,
  INSPECTION_TIRE_STATUS_URL: `${API_BASE_URL}/api/v1/display/tire`,
  REMOVE_ALL_TIRES_URL: `${API_BASE_URL}/api/v1/delete/file`,
  ANNOTATION_URL: `${API_BASE_URL}/api/v1/file/coordinate`,
};

export { S3_BUCKET_BASE_URL, AI_API_TOKEN };
*/

export const HARDWARE_BACK_PRESS = 'hardwareBackPress';
export const ANDROID = 'android';
export const WINDOW = 'window';
export const IOS = 'ios';

export const EXPIRY_INSPECTION = {
  description: 'The Inspection Has Expired. Please Start A New Inspection.',
  confirmButton: 'New Inspection',
  cancelButton: 'Exit',
};
export const INSPECTION = {
  CAR_VERIFICATION: 'carVerificiationItems',
  EXTERIOR: 'exteriorItems',
  TIRES: 'tires',
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
  inside_cargo_roof: 'exteriorInsideCargoRoof',
  inside_cargo_roof_1: 'exteriorInsideCargoRoof_1',
  inside_cargo_roof_2: 'exteriorInsideCargoRoof_2',
  left_front_tire: 'leftFrontTire',
  left_rear_tire: 'leftRearTire',
  right_front_tire: 'rightFrontTire',
  right_rear_tire: 'rightRearTire',
};
export const INSPECTION_TITLE = {
  license_plate_number: 'License Plate Number',
  odometer: 'Odometer',
  exterior_front: 'Exterior Front',
  exterior_front_1: 'Exterior Front - 1',
  exterior_front_2: 'Exterior Front - 2',
  exterior_rear: 'Exterior Rear',
  exterior_rear_1: 'Exterior Rear - 1',
  exterior_rear_2: 'Exterior Rear - 2',
  exterior_left: 'Exterior Left',
  exterior_left_1: 'Exterior Left - 1',
  exterior_left_2: 'Exterior Left - 2',
  exterior_right: 'Exterior Right',
  exterior_right_1: 'Exterior Right - 1',
  exterior_right_2: 'Exterior Right - 2',
  front_left_corner: 'Front Left Corner',
  front_left_corner_1: 'Front Left Corner - 1',
  front_left_corner_2: 'Front Left Corner - 2',
  front_right_corner: 'Front Right Corner',
  front_right_corner_1: 'Front Right Corner - 1',
  front_right_corner_2: 'Front Right Corner - 2',
  rear_left_corner: 'Rear Left Corner',
  rear_left_corner_1: 'Rear Left Corner - 1',
  rear_left_corner_2: 'Rear Left Corner - 2',
  rear_right_corner: 'Rear Right Corner',
  rear_right_corner_1: 'Rear Right Corner - 1',
  rear_right_corner_2: 'Rear Right Corner - 2',
  inside_cargo_roof: 'Inside Cargo Roof',
  inside_cargo_roof_1: 'Inside Cargo Roof - 1',
  inside_cargo_roof_2: 'Inside Cargo Roof - 2',
  left_front_tire: 'Left Front Tire',
  left_rear_tire: 'Left Rear Tire',
  right_front_tire: 'Right Front Tire',
  right_rear_tire: 'Right Rear Tire',
};
export const UPDATE_APP = {
  TITLE: 'Version Update',
  MESSAGE:
    'A new version of the app is available. Please update to continue using the app.',
  BUTTON: 'UPDATE',
};
export const SESSION_EXPIRED = {
  TITLE: 'Session Expired',
  MESSAGE: 'Your session has expired. Please log in again to continue.',
  BUTTON: 'OK',
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
