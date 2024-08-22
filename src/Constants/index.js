// import {DEV_URL} from '@env'
export const DEV_URL =
  // 'https://n3hqyu9j2i.execute-api.us-east-1.amazonaws.com/chexai-dsp';
  'https://fbyrgnnu14.execute-api.us-east-1.amazonaws.com/chexai-dsp-staging';
export const S3_BUCKET_BASEURL = 'https://chex-ai-uploads.s3.amazonaws.com/';
export const FETCH_NUMBER_PLATE_URL = `${DEV_URL}/api/v1/searchnumberplate`;
export const EXTRACT_NUMBER_PLATE = `${DEV_URL}/api/v1/extract/inspection/create`;
export const EXTRACT_NUMBER_PLATE_WITH_AI =
  'https://cardamage.chex.ai/license-plate-number-extraction/';
export const LOGIN_URL = `${DEV_URL}/api/v1/auth/login`;
export const UPLOAD_URL = `${DEV_URL}/api/v1/file/upload`;
export const CREATE_INSPECTION_URL = `${DEV_URL}/api/v1/create/inspection`;
export const FETCH_IN_PROGRESS_URL = `${DEV_URL}/api/v1/status/vehicle`;
export const FORGET_PASSWORD_URL = `${DEV_URL}/api/v1/auth/reset/email`;
export const RESET_PASSWORD_URL = `${DEV_URL}/api/v1/auth/reset/password`;
export const INSPECTION_TIRE_STATUS = `${DEV_URL}/api/v1/already/tire/past/month`;
export const REMOVE_ALL_TIRES = `${DEV_URL}/api/v1/delete/file`;
export const HARDWARE_BACK_PRESS = 'hardwareBackPress';
export const ANDROID = 'android';
export const WINDOW = 'window';
export const IOS = 'ios';
export const AI_API_TOKEN = 'FF5SE7GZULOP0CZQQ180KMZER';

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
