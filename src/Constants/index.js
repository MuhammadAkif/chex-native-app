import AWS from 'aws-sdk';
export const baseURL =
  'https://fbyrgnnu14.execute-api.us-east-1.amazonaws.com/chexai-dsp-staging';
export const fetchNPURL = `${baseURL}/api/v1/searchnumberplate`;
export const uploadURL = `${baseURL}/api/v1/file/upload`;
export const createInspectionURL = `${baseURL}/api/v1/create/inspection`;
export const fetchInProgressURL = `${baseURL}/api/v1/status/vehicle`;

export const AWS_S3_ACCESS_KEY_ID = 'AKIA6RONSHZ4NCSTO3UU';
export const AWS_S3_SECRET_ACCESS_KEY =
  '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';
export const AWS_S3_BUCKET_NAME = 'chex-ai-uploads';
export const AWS_S3_BUCKET_REGION_NAME = 'us-east-1';

AWS.config.update({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
});
export const s3 = new AWS.S3({
  params: {Bucket: AWS_S3_BUCKET_NAME},
  region: AWS_S3_BUCKET_REGION_NAME,
});
export default AWS;
