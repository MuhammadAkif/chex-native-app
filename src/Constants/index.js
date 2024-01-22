import {DEV_URL} from '@env'
// export const DEV_URL =
//   'https://fbyrgnnu14.execute-api.us-east-1.amazonaws.com/chexai-dsp-staging';
// export const S3_BUCKET_BASEURL = 'https://chex-ai-uploads.s3.amazonaws.com/';
export const fetchNPURL = `${DEV_URL}/api/v1/searchnumberplate`;
export const loginURL = `${DEV_URL}/api/v1/auth/login`;
export const uploadURL = `${DEV_URL}/api/v1/file/upload`;
export const createInspectionURL = `${DEV_URL}/api/v1/create/inspection`;
export const fetchInProgressURL = `${DEV_URL}/api/v1/status/vehicle`;
