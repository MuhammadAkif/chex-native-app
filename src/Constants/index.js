// import {DEV_URL} from '@env'
export const DEV_URL =
  // 'https://n3hqyu9j2i.execute-api.us-east-1.amazonaws.com/chexai-dsp';
  'https://fbyrgnnu14.execute-api.us-east-1.amazonaws.com/chexai-dsp-staging';
export const S3_BUCKET_BASEURL = 'https://chex-ai-uploads.s3.amazonaws.com/';
export const FETCH_NUMBER_PLATE_URL = `${DEV_URL}/api/v1/searchnumberplate`;
export const LOGIN_URL = `${DEV_URL}/api/v1/auth/login`;
export const UPLOAD_URL = `${DEV_URL}/api/v1/file/upload`;
export const CREATE_INSPECTION_URL = `${DEV_URL}/api/v1/create/inspection`;
export const FETCH_IN_PROGRESS_URL = `${DEV_URL}/api/v1/status/vehicle`;
export const FORGET_PASSWORD_URL = `${DEV_URL}/api/v1/auth/reset/email`;
export const RESET_PASSWORD_URL = `${DEV_URL}/api/v1/auth/reset/password`;
export const HARDWARE_BACK_PRESS = 'hardwareBackPress';
export const ANDROID = 'android';
export const WINDOW = 'window';
