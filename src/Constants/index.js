// Api Endpoints start here
import {IMAGES} from '../Assets/Images';

const ENV_TYPE_URL = {
  staging: process.env.STAGING_URL,
  production: process.env.PRODUCTION_URL,
  development: process.env.DEVELOPMENT_URL,
};
export const DEV_URL = ENV_TYPE_URL.staging;
export const S3_BUCKET_BASEURL = process.env.S3_BUCKET_BASEURL;
export const FETCH_NUMBER_PLATE_URL = `${DEV_URL}/api/v1/searchnumberplate`;
export const EXTRACT_NUMBER_PLATE = `${DEV_URL}/api/v1/extract/inspection/create`;
export const EXTRACT_NUMBER_PLATE_WITH_AI =
  process.env.EXTRACT_NUMBER_PLATE_URL;
export const LOGIN_URL = `${DEV_URL}/api/v1/auth/login`;
export const UPLOAD_URL = `${DEV_URL}/api/v1/file/upload`;
export const CREATE_INSPECTION_URL = `${DEV_URL}/api/v1/create/inspection`;
export const FETCH_IN_PROGRESS_URL = `${DEV_URL}/api/v1/status/vehicle`;
export const FORGET_PASSWORD_URL = `${DEV_URL}/api/v1/auth/reset/email`;
export const RESET_PASSWORD_URL = `${DEV_URL}/api/v1/auth/reset/password`;
export const INSPECTION_TIRE_STATUS = `${DEV_URL}/api/v1/display/tire`;
export const REMOVE_ALL_TIRES = `${DEV_URL}/api/v1/delete/file`;
export const AI_API_TOKEN = process.env.AI_API_TOKEN;
// Api Endpoints ends here

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
  exterior_rear: 'exteriorRear',
  exterior_left: 'exteriorLeft',
  exterior_right: 'exteriorRight',
  front_left_corner: 'exteriorFrontLeftCorner',
  front_right_corner: 'exteriorFrontRightCorner',
  rear_left_corner: 'exteriorRearLeftCorner',
  rear_right_corner: 'exteriorRearRightCorner',
  inside_cargo_roof: 'exteriorInsideCargoRoof',
  left_front_tire: 'leftFrontTire',
  left_rear_tire: 'leftRearTire',
  right_front_tire: 'rightFrontTire',
  right_rear_tire: 'rightRearTire',
};
export const INSPECTION_TITLE = {
  license_plate_number: 'License Plate Number',
  odometer: 'Odometer',
  exterior_front: 'Exterior Front',
  exterior_rear: 'Exterior Rear',
  exterior_left: 'Exterior Left',
  exterior_right: 'Exterior Right',
  front_left_corner: 'Front Left Corner',
  front_right_corner: 'Front Right Corner',
  rear_left_corner: 'Rear Left Corner',
  rear_right_corner: 'Rear Right Corner',
  inside_cargo_roof: 'Inside Cargo Roof',
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
    "To annotate an image of a vehicle's front, you can click directly on the area of interest within the image. Upon clicking, a damage icon will appear at the selected spot, allowing you to visually mark and highlight the specific location of any damage.",
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
};

export const remarks =
  'skdjhaksdhsdk jadkjsab dias bdkasd gsakd gsakdj ajsdakj sjdhaks jdhaksjdhshskjdhskdhskjdhskshdkshdkshdksjhdkshdkshdskdhskdhskjdhkskdjhaksdhsdk jadkjsab dias bdkasd gsakd gsakdj ajsdakj sjdhaks jdhaksjdhshskjdhskdhskjdhskshdkshdkshdksjhdkshdkshdskdhskdhskjdhkskdjhaksdhsdk jadkjsab dias bdkasd gsakd gsakdj ajsdakj sjdhaks jdhaksjdhshskjdhskdhskjdhskshdkshdkshdksjhdkshdkshdskdhskdhskjdhk';

export const DAMAGE_TYPE = ['Minor', 'Major', 'Severe'];
