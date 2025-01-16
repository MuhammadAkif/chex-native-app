import api from './api';
import axios from 'axios';
import {
  AI_API_TOKEN,
  API_ENDPOINTS,
  EXTRACT_NUMBER_PLATE_WITH_AI,
  generateApiUrl,
  MILEAGE_EXTRACTION,
  nightImageCheckAI,
} from '../Constants';
import {generateRandomString} from '../Utils';

const {
  EXTRACT_NUMBER_PLATE_URL,
  INSPECTION_TIRE_STATUS_URL,
  REMOVE_ALL_TIRES_URL,
  ANNOTATION_URL,
  LOCATION_URL,
  CREATE_INSPECTION_URL,
  FETCH_IN_PROGRESS_URL,
  UPLOAD_URL,
  SUBMIT_INSPECTION,
} = API_ENDPOINTS;

/**
 * Error handler for inspection service
 * @param {Error} error - The error object
 * @param {string} operation - The operation that failed
 * @throws {Error} Rethrows the error with additional context
 */
const handleError = (error, operation) => {
  console.error(`${operation} error:`, error?.message || error);
  throw error;
};

/**
 * Creates a new inspection
 * @param {string} companyId - Company identifier
 * @returns {Promise<Object>} Created inspection data
 */
export const createInspection = async companyId => {
  try {
    return await api.post(CREATE_INSPECTION_URL, {
      licensePlateNumber: generateRandomString(),
      companyId,
    });
  } catch (error) {
    handleError(error, 'Create inspection');
  }
};

/**
 * Removes an inspection by ID
 * @param {string} inspectionId - Inspection identifier
 * @returns {Promise<Object>} Deletion response
 */
export const removeInspection = async inspectionId => {
  const endPoint = generateApiUrl(`delete/inspection/${inspectionId}?type=app`);
  try {
    return await api.delete(endPoint);
  } catch (error) {
    handleError(error, 'Inspection remove');
  }
};

/**
 * Gets inspection details by ID
 * @param {string} inspectionId - Inspection identifier
 * @returns {Promise<Object>} Inspection details
 */
export const getInspectionDetails = async inspectionId => {
  try {
    return await api.get(generateApiUrl(`files/details/${inspectionId}`));
  } catch (error) {
    handleError(error, 'Fetching inspection details');
  }
};

/**
 * Extracts number plate information
 * @param {string} licensePlateNumber - License plate number
 * @param {string} companyId - Company identifier
 * @param {string} inspectionId - Inspection identifier
 * @returns {Promise<Object>} Extraction results
 */
export const extractNumberPlate = async (
  licensePlateNumber,
  companyId,
  inspectionId,
) => {
  try {
    return await api.post(EXTRACT_NUMBER_PLATE_URL, {
      licensePlateNumber,
      companyId,
      inspectionId,
    });
  } catch (error) {
    handleError(error, 'License plate extraction');
  }
};

/**
 * Gets vehicle tire status
 * @param {string} inspectionId - Inspection identifier
 * @returns {Promise<Object>} Tire status information
 */
export const vehicleTireStatus = async inspectionId => {
  try {
    return await api.post(INSPECTION_TIRE_STATUS_URL, {inspectionId});
  } catch (error) {
    handleError(error, 'Vehicle tire status check');
  }
};

/**
 * Clears tire information
 * @param {string[]} fileIds - Array of file identifiers
 * @returns {Promise<Object>} Clear operation response
 */
export const clearTires = async (fileIds = []) => {
  try {
    return await api.post(REMOVE_ALL_TIRES_URL, {fileId: fileIds});
  } catch (error) {
    handleError(error, 'Tires removing');
  }
};

/**
 * Submits image annotation data
 * @param {Array} coordinateArray - Array of coordinates
 * @param {string} inspectionId - Inspection identifier
 * @param {string} fileId - File identifier
 * @returns {Promise<Object>} Annotation submission response
 */
export const imageAnnotation = async (
  coordinateArray,
  inspectionId,
  fileId,
) => {
  try {
    return await api.post(ANNOTATION_URL, {
      coordinateArray,
      inspectionId,
      fileId,
    });
  } catch (error) {
    handleError(error, 'Image annotation submission');
  }
};

/**
 * Gets detailed inspection information
 * @param {string} inspectionId - Inspection identifier
 * @returns {Promise<Object>} Detailed inspection data
 */
export const inspectionDetails = async inspectionId => {
  try {
    return await api.get(generateApiUrl(`files/app/${inspectionId}`));
  } catch (error) {
    handleError(error, 'Inspection details');
  }
};

/**
 * Fetches all inspections by status
 * @param {string} status - Inspection status to filter by
 * @returns {Promise<Object>} List of inspections
 */
export const fetchAllInspections = async status => {
  try {
    return await api.post(FETCH_IN_PROGRESS_URL, {status});
  } catch (error) {
    handleError(error, 'Fetch all inspections');
  }
};

/**
 * Extracts license plate using AI
 * @param {string} image_url - URL of the image to process
 * @returns {Promise<Object>} AI extraction results
 */
export const extractLicensePlateAI = async image_url => {
  try {
    return await api.post(
      EXTRACT_NUMBER_PLATE_WITH_AI,
      {image_url},
      {headers: {api_token: AI_API_TOKEN}},
    );
  } catch (error) {
    handleError(error, 'License Plate AI Extraction');
  }
};

/**
 * Gets S3 signed URL for file upload
 * @param {Object} params - Upload parameters
 * @param {string} [params.type=''] - File type
 * @param {string} [params.source=''] - Source of the file
 * @param {string} [params.inspectionId=''] - Inspection identifier
 * @param {string} [params.categoryName=''] - Category name
 * @param {string} [params.variant=''] - Variant information
 * @param {string} [params.companyId=''] - Company identifier
 * @returns {Promise<Object>} Signed URL data
 */
export const s3SignedUrl = async ({
  type = '',
  source = '',
  inspectionId = '',
  categoryName = '',
  variant = '',
  companyId = '',
} = {}) => {
  try {
    return await api.post(UPLOAD_URL, {
      type,
      source,
      inspectionId,
      categoryName,
      variant,
      companyId,
    });
  } catch (error) {
    handleError(error, 'Getting s3 signed url');
  }
};

/**
 * Uploads file to database
 * @param {string} inspectionId - Inspection identifier
 * @param {Object} body - Upload body data
 * @returns {Promise<Object>} Upload response
 */
export const uploadFileToDatabase = async (inspectionId, body) => {
  try {
    return await api.post(generateApiUrl(`vehicle/${inspectionId}/file`), body);
  } catch (error) {
    handleError(error, 'Upload file to database');
  }
};

/**
 * Deletes image from database
 * @param {string} fileId - File identifier
 * @returns {Promise<Object>} Deletion response
 */
export const deleteImageFromDatabase = async fileId => {
  try {
    return await api.delete(generateApiUrl(`files/${fileId}`));
  } catch (error) {
    handleError(error, 'Deleting image from database');
  }
};

/**
 * Updates location information
 * @param {string} inspectionId - Inspection identifier
 * @returns {Promise<Object>} Location update response
 */
export const location = async inspectionId => {
  try {
    return await api.put(LOCATION_URL, {
      isLocation: true,
      inspectionId,
    });
  } catch (error) {
    handleError(error, 'Location update');
  }
};

/**
 * Submits an inspection
 * @param {string} [inspectionId=''] - Inspection identifier
 * @param {string} [companyId=''] - Company identifier
 * @param {string|null} [driverComment=null] - Optional driver comments
 * @returns {Promise<Object>} Submission response
 */
export const inspectionSubmission = async (
  inspectionId = '',
  companyId = '',
  driverComment = null,
) => {
  try {
    return await api.patch(generateApiUrl(`inspection/${inspectionId}`), {
      driverComment,
    });
  } catch (error) {
    handleError(error, 'Inspection submission');
  }
};

/**
 * Submits an inspection using auto-inspection with a company ID.
 * This function makes a POST request to submit the inspection data, along with the company ID.
 *
 * @param {string} [inspectionId=''] The unique identifier of the inspection. Default to an empty string if not provided.
 * @param {string} [companyId=''] The unique identifier of the company submitting the inspection. Default to an empty string if not provided.
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the Axios response object, containing the result of the POST request.
 * @throws {Error} If the request fails, it will throw an error.
 */
/*export const inspectionSubmission = async (
  inspectionId = '',
  companyId = '',
) => {
  const endPoint = generateApiUrl(`auto/reviewed/${inspectionId}`);
  const body = {companyId};

  try {
    return await api.post(endPoint, body);
  } catch (error) {
    console.error('Inspection submission error:', error);
    throw error;
  }
}*/

/**
 * Submits an inspection using a queue-based auto-inspection with additional driver comments.
 * This function makes a POST request to submit the inspection, company ID, and any driver comments.
 *
 * @param {string} [inspectionId=''] The unique identifier of the inspection. Default to an empty string if not provided.
 * @param {string} [companyId=''] The unique identifier of the company submitting the inspection. Default to an empty string if not provided.
 * @param {string|null} [driverComment=null] Optional driver comments for the inspection. Default to `null` if not provided.
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the Axios response object, containing the result of the POST request.
 * @throws {Error} If the request fails, it will throw an error.
 */
/*export const inspectionSubmission = async (
  inspectionId = '',
  companyId = '',
  driverComment = null,
) => {
  const body = {inspectionId, companyId, driverComment};

  try {
    return await api.post(SUBMIT_INSPECTION, body);
  } catch (error) {
    console.error('Inspection submission error:', error);
    throw error;
  }
};*/

export const isImageDarkWithAI = async image_url => {
  const body = {image_url};
  const config = {headers: {api_token: AI_API_TOKEN}};
  try {
    return await api.post(nightImageCheckAI, body, config);
  } catch (error) {
    console.error('Night image check error:', error.message);
    throw error;
  }
};

export const ai_Mileage_Extraction = async image_url => {
  try {
    return await api.post(
      MILEAGE_EXTRACTION,
      {image_url},
      {headers: {api_token: AI_API_TOKEN}},
    );
  } catch (error) {
    handleError(error, 'Mileage extraction');
  }
};

/**
 * Updates mileage in database
 * @param {string|number} milage - Mileage value to update
 * @param {string} inspectionId - Inspection identifier
 * @returns {Promise<Object>} Update response
 */
export const updateMileageInDB = async (milage, inspectionId) => {
  try {
    return await api.put(
      generateApiUrl(`update/vehicle/milage/${inspectionId}`),
      {milage},
    );
  } catch (error) {
    handleError(error, 'Mileage update');
  }
};
