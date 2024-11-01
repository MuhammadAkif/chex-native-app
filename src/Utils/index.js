import {Alert, PermissionsAndroid} from 'react-native';
import * as yup from 'yup';
import {Camera} from 'react-native-vision-camera';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import {
  INSPECTION,
  INSPECTION_SUBCATEGORY,
  S3_BUCKET_BASEURL,
  API_ENDPOINTS,
  generateApiUrl,
  customSortOrder,
} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {
  fileDetails,
  numberPlateSelected,
  setCompanyId,
  updateVehicleImage,
  sessionExpired,
} from '../Store/Actions';
import {IMAGES} from '../Assets/Images';
import {store} from '../Store';

const {UPLOAD_URL, FETCH_IN_PROGRESS_URL, CREATE_INSPECTION_URL} =
  API_ENDPOINTS;

// Validation Schema
export const validationSchema = yup.object().shape({
  firstName: yup.string().required('Field required'),
  lastName: yup.string().required('Field required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Please enter your email!')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format',
    ),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{11}$/, 'Please enter a valid phone number')
    .required('Field required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 8 characters')
    .required('Please enter your password!'),
});
export const signInValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Please enter your name!')
    .min(2, 'Name must be at least 2 characters'),
  password: yup
    .string()
    .min(1, 'Password must be at least 1 characters')
    .required('Please enter your password!'),
});
export const forgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter your email!')
    .min(2, 'Email must be at least 2 characters')
    .email('Invalid email address'),
});
export const resetPasswordSchema = yup.object().shape({
  verificationCode: yup
    .string()
    .min(6, 'Name must be at least 6 characters')
    .required('Please enter your code!'),
  password: yup
    .string()
    .required('Please enter your new password!')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please re-enter your new password!'),
});

//New Inspection Objects starts here
//____________________________Car Verification_________________________
export const LicensePlateDetails = {
  key: 'licensePlate',
  title: 'License Plate',
  source: IMAGES.license_Plate,
  instructionalText: 'Please take a photo of the License plate on the vehicle',
  instructionalSubHeadingText: '',
  category: 'CarVerification',
  subCategory: 'license_plate_number',
  groupType: INSPECTION.carVerificiationItems,
  buttonText: 'Capture Now',
};
export const OdometerDetails = {
  key: 'odometer',
  title: 'Odometer',
  source: IMAGES.odometer,
  instructionalText:
    'Please take a photo of the odometer clearly showing the mileage  on the vehicle',
  // instructionalSubHeadingText: 'Vehicle mileage',
  instructionalSubHeadingText: '',
  category: 'CarVerification',
  subCategory: 'odometer',
  groupType: INSPECTION.carVerificiationItems,
  buttonText: 'Capture Now',
};
//___________________________Exterior______________________________
export const ExteriorFrontDetails = {
  key: 'exteriorFront',
  title: 'Exterior Front',
  source: IMAGES.exterior_Front,
  instructionalText:
    'Please upload a photo clearly showing the front of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'exterior_front',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
export const ExteriorRearDetails = {
  key: 'exteriorRear',
  title: 'Exterior Rear',
  source: IMAGES.exterior_Rear,
  instructionalText:
    'Please upload a photo clearly showing the rear of the vehicle ',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'exterior_rear',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
export const ExteriorLeftDetails = {
  key: 'exteriorLeft',
  title: 'Exterior Left',
  source: IMAGES.exterior_Left,
  instructionalText:
    'Please take a photo clearly capturing the entire exterior left side of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'exterior_left',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
export const ExteriorRightDetails = {
  key: 'exteriorRight',
  title: 'Exterior Right',
  source: IMAGES.exterior_Right,
  instructionalText:
    'Please take a photo clearly capturing the entire exterior right side of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'exterior_right',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
export const ExteriorFrontLeftCornerDetails = {
  key: 'exteriorFrontLeftCorner',
  title: 'Front Left Corner',
  source: IMAGES.front_Left_Corner,
  instructionalText:
    'Please take a photo from the front left corner of the vehicle clearly capturing the left headlight, driver door and roof on the exterior left side of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'front_left_corner',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
export const ExteriorFrontRightCornerDetails = {
  key: 'exteriorFrontRightCorner',
  title: 'Front Right Corner',
  source: IMAGES.front_Right_Corner,
  instructionalText:
    'Please take a photo from the front right corner of the vehicle clearly capturing the right headlight, passenger door and roof on the exterior right side of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'front_right_corner',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
export const ExteriorRearLeftCornerDetails = {
  key: 'exteriorRearLeftCorner',
  title: 'Rear Left Corner',
  source: IMAGES.rear_Left_Corner,
  instructionalText:
    'Please take a photo from the rear left corner of the vehicle clearly capturing the left tail light, rear door and roof on the exterior left side of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'rear_left_corner',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
export const ExteriorRearRightCornerDetails = {
  key: 'exteriorRearRightCorner',
  title: 'Rear Right Corner',
  source: IMAGES.rear_Right_Corner,
  instructionalText:
    'Please take a photo from the rear right corner of the vehicle clearly capturing the right tail light, rear door and roof on the exterior right side of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'rear_right_corner',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
export const ExteriorInsideCargoRoofDetails = {
  key: 'exteriorInsideCargoRoof',
  title: 'Inside Cargo Roof',
  source: IMAGES.inside_Cargo_Roof,
  instructionalText:
    'Please upload a photo clearly showing the inside cargo roof of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'inside_cargo_roof',
  groupType: INSPECTION.exteriorItems,
  isVideo: false,
};
//___________________________Interior______________________________
export const InteriorPassengerSide = {
  key: 'passengerSide',
  title: 'Interior Passenger Side',
  source: IMAGES.interior_passenger_side,
  instructionalText:
    'Please take a photo of the interior of the vehicle with right passenger side door open with clear view of the following interior items:',
  instructionalSubHeadingText: 'Passenger seat belt buckled',
  buttonText: 'Capture Now',
  category: 'Interior',
  subCategory: 'interior_passenger_side',
  groupType: INSPECTION.interiorItems,
  isVideo: false,
};
export const InteriorDriverSide = {
  key: 'driverSide',
  title: 'Interior Driver Side',
  source: IMAGES.interior_driver_side,
  instructionalText:
    'Please take a photo of the interior of the vehicle with left driver side door open with clear view of the following items:',
  instructionalSubHeadingText: 'Driver seat belt buckled',
  instructionalSubHeadingText_1: 'Interior rearview mirror',
  instructionalSubHeadingText_2: 'Brake pads',
  buttonText: 'Capture Now',
  category: 'Interior',
  subCategory: 'interior_driver_side',
  groupType: INSPECTION.interiorItems,
  isVideo: false,
};
//____________________________Tires_____________________________
export const LeftFrontTireDetails = {
  key: 'leftFrontTire',
  title: 'Left Front Tire',
  source: IMAGES.tire,
  instructionalText:
    'Please place a penny on the tire thread and take a photo capturing following items:',
  instructionalSubHeadingText:
    'Place Lincoln’s heads on the penny upside down and facing the camera',
  buttonText: 'Capture Now',
  category: 'Tires',
  subCategory: 'left_front_tire',
  groupType: INSPECTION.tires,
  isVideo: false,
};
export const LeftRearTireDetails = {
  key: 'leftRearTire',
  title: 'Left Rear Tire',
  source: IMAGES.tire,
  instructionalText:
    'Please place a penny on the tire thread and take a photo capturing following items:',
  instructionalSubHeadingText:
    'Place Lincoln’s heads on the penny upside down and facing the camera',
  buttonText: 'Capture Now',
  category: 'Tires',
  subCategory: 'left_rear_tire',
  groupType: INSPECTION.tires,
  isVideo: false,
};
export const RightFrontTireDetails = {
  key: 'rightFrontTire',
  title: 'Right Front Tire',
  source: IMAGES.tire,
  instructionalText:
    'Please place a penny on the tire thread and take a photo capturing following items:',
  instructionalSubHeadingText:
    'Place Lincoln’s heads on the penny upside down and facing the camera',
  buttonText: 'Capture Now',
  category: 'Tires',
  subCategory: 'right_front_tire',
  groupType: INSPECTION.tires,
  isVideo: false,
};
export const RightRearTireDetails = {
  key: 'rightRearTire',
  title: 'Right Rear Tire',
  source: IMAGES.tire,
  instructionalText:
    'Please place a penny on the tire thread and take a photo capturing following items:',
  instructionalSubHeadingText:
    'Place Lincoln’s heads on the penny upside down and facing the camera',
  buttonText: 'Capture Now',
  category: 'Tires',
  subCategory: 'right_rear_tire',
  groupType: INSPECTION.tires,
  isVideo: false,
};
//New Inspection Objects starts here

export const hasCameraAndMicrophoneAllowed = async () => {
  const cameraPermission = await Camera.getCameraPermissionStatus();
  const microphonePermission = await Camera.getMicrophonePermissionStatus();
  if (cameraPermission !== 'authorized') {
    await Camera.requestCameraPermission();
  }
  if (microphonePermission !== 'authorized') {
    await Camera.requestMicrophonePermission();
  }
};
export async function requestStorageAccessPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Access to Storage',
        message: 'We need access to your storage to display images',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Storage permission granted');
    } else {
      console.log('Storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
function error_Handler(callback = null) {
  Alert.alert(
    'Upload Failed',
    'Please check your internet connection and try again. If issues persist, reduce file size or switch networks. Contact support if needed. Apologies for any inconvenience.',
    [{text: 'Retry', onPress: callback}],
  );
}
export const getSignedUrl = async (
  token,
  mime,
  path,
  setProgress,
  handleResponse,
  handleError,
  dispatch,
  inspectionId,
  categoryName,
  variant = 0,
  source = 'app',
) => {
  const data = {type: mime, source, inspectionId, categoryName, variant};
  // const data = {type: mime},

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  await axios
    .post(UPLOAD_URL, data, config)
    .then(res =>
      onGetSignedUrlSuccess(
        res,
        path,
        mime,
        setProgress,
        handleResponse,
        handleError,
        dispatch,
      ),
    )
    .catch(error => onGetSignedUrlFail(error, handleError, dispatch));
};
function onGetSignedUrlSuccess(
  res,
  path,
  mime,
  setProgress,
  handleResponse,
  handleError,
  dispatch,
) {
  const {url, key} = res.data;
  uploadToS3(
    url,
    key,
    path,
    mime,
    setProgress,
    handleResponse,
    handleError,
    dispatch,
  ).then();
}
function onGetSignedUrlFail(error, handleError, dispatch) {
  const {statusCode = null} = error?.response?.data || {};
  error_Handler(handleError);
  if (statusCode === 401) {
    handle_Session_Expired(statusCode, dispatch);
  }
}
export const uploadToS3 = async (
  preSignedUrl,
  key,
  path,
  mime,
  setProgress,
  handleResponse,
  handleError,
) => {
  RNFetchBlob.fetch(
    'PUT',
    preSignedUrl,
    {'Content-Type': mime, Connection: 'close'},
    RNFetchBlob.wrap(path),
  )
    .uploadProgress((written, total) => {
      const percentCompleted = Math.round((written * 100) / total);
      setProgress(percentCompleted);
    })
    .then(res => onUploadToS3Success(res, handleResponse, key))
    .catch(error => onUploadToS3Fail(error, handleError));
};
function onUploadToS3Success(res, handleResponse, key) {
  handleResponse(key);
}
function onUploadToS3Fail(error, handleError) {
  error_Handler(handleError);
}
export const uploadFile = async (
  callback,
  body,
  inspectionId,
  token,
  handleError,
  dispatch,
) => {
  let imageID = 0;
  const endPoint = generateApiUrl(`vehicle/${inspectionId}/file`);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  await axios
    .post(endPoint, body, config)
    .then(res => onUploadFileSuccess(res, callback))
    .catch(error => onUploadFileFail(error, dispatch, handleError));
  return imageID;
};
function onUploadFileSuccess(res, callback) {
  const {id = null} = res?.data || {};
  callback(id);
}
function onUploadFileFail(error, dispatch, handleError) {
  const {statusCode = null} = error?.response?.data || {};
  const inspectionDeleted = statusCode === 403;
  const {title, message} = newInspectionUploadError(statusCode || '');
  if (statusCode === 401) {
    handle_Session_Expired(statusCode, dispatch);
  }
  if (inspectionDeleted) {
    handleError(inspectionDeleted);
  } else {
    Alert.alert(title, message, [
      {text: 'Retry', onPress: () => handleError(inspectionDeleted)},
    ]);
  }
}
export const fetchInProgressInspections = async (
  token,
  status = 'IN_PROGRESS',
  setIsLoading,
  dispatch,
) => {
  let data = '';
  const body = {
    status: status,
  };
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  await axios
    .post(FETCH_IN_PROGRESS_URL, body, config)
    .then(response => {
      data = onFetchInProgressInspectionsSuccess(response, setIsLoading);
    })
    .catch(error =>
      onFetchInProgressInspectionsFail(error, dispatch, setIsLoading),
    );
  return data;
};
function onFetchInProgressInspectionsSuccess(response, setIsLoading) {
  const {data = {}} = response || {};
  if (setIsLoading) {
    setIsLoading(false);
  }
  return data;
}
function onFetchInProgressInspectionsFail(error, dispatch, setIsLoading) {
  const {statusCode = null} = error?.response?.data || {};
  if (setIsLoading) {
    setIsLoading(false);
  }
  if (statusCode === 401) {
    handle_Session_Expired(statusCode, dispatch);
  }
}
export const getCurrentDate = () => {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  return `${day}-${month}-${year}`;
};
export const extractDate = dataAndTime => {
  const date = new Date(dataAndTime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};
export const handleHomePress = navigation =>
  navigation.navigate(ROUTES.INSPECTION_SELECTION);
export const newInspectionUploadError = (statusCode = 'noStatusCode') => {
  const errors = {
    409: {
      title: 'Duplicate Image Detected',
      message:
        'An image/video for this category was uploaded previously and already exists in our database. please refresh your page to see the previously uploaded image.',
    },
    403: {
      title: '',
      message: 'The inspection has expired. Please start a new Inspection.',
    },
    noStatusCode: {
      title: 'Upload Failed',
      message: 'Please try again in a few minutes',
    },
  };
  return errors[statusCode] || errors.noStatusCode;
};
export const sortInspectionReviewedItems = list => {
  function customSort(a, b) {
    const groupTypeComparison =
      customSortOrder.groupType.indexOf(a.groupType) -
      customSortOrder.groupType.indexOf(b.groupType);
    if (groupTypeComparison !== 0) {
      return groupTypeComparison;
    }

    return (
      customSortOrder[a.groupType].indexOf(a.name) -
      customSortOrder[b.groupType].indexOf(b.name)
    );
  }

  return list.sort(customSort);
};
export const updateFiles = (files = []) => {
  if (files?.length < 1) {
    return files;
  }
  const files_Updated = [];
  for (let i = 0; i < files.length; i++) {
    const variant = files[i].llamaCost || '';
    let name = files[i].category + variant;
    const data = {...files[i], name: name};
    files_Updated.push(data);
  }
  return files_Updated;
};
export function sortImagesByOrder(list) {
  return list.sort((a, b) => {
    // Sort by groupType
    const groupTypeAIndex = customSortOrder.groupType.indexOf(a.groupType);
    const groupTypeBIndex = customSortOrder.groupType.indexOf(b.groupType);

    if (groupTypeAIndex !== groupTypeBIndex) {
      return groupTypeAIndex - groupTypeBIndex;
    }

    // Sort by category within the groupType
    const categoryAIndex = customSortOrder[a.groupType]?.indexOf(a.category);
    const categoryBIndex = customSortOrder[b.groupType]?.indexOf(b.category);

    if (categoryAIndex !== categoryBIndex) {
      return (categoryAIndex ?? Infinity) - (categoryBIndex ?? Infinity);
    }

    // Sort by llamaCost (numerically)
    const llamaCostA =
      a.llamaCost !== null ? parseInt(a.llamaCost, 10) : Infinity;
    const llamaCostB =
      b.llamaCost !== null ? parseInt(b.llamaCost, 10) : Infinity;

    return llamaCostA - llamaCostB;
  });
}
export const sortInspection_Reviewed_Items = list => {
  // Step 1: Count occurrences
  const countMap = {};
  list.forEach(item => {
    const key = `${item.groupType}-${item.category}`;
    countMap[key] = (countMap[key] || 0) + 1;
  });

  // Step 2: Sort the list based on custom order
  const sortedList = list.sort((a, b) => {
    const groupTypeComparison =
      customSortOrder.groupType.indexOf(a.groupType) -
      customSortOrder.groupType.indexOf(b.groupType);

    if (groupTypeComparison !== 0) {
      return groupTypeComparison; // Sort by groupType first
    }

    return (
      customSortOrder[a.groupType].indexOf(a.name) -
      customSortOrder[b.groupType].indexOf(b.name) // Sort by category second
    );
  });

  // Step 3: Flatten the sorted list based on counts
  const finalSortedList = [];
  sortedList.forEach(item => {
    const key = `${item.groupType}-${item.category}`;
    const count = countMap[key];
    for (let i = 0; i < count; i++) {
      finalSortedList.push(item);
    }
    // Delete the count to avoid duplicates in the final list
    delete countMap[key];
  });

  return finalSortedList;
};

export function uploadInProgressMediaToStore(files, dispatch) {
  for (let file = 0; file < files.length; file++) {
    const url = files[file].url;
    const completeURL = S3_BUCKET_BASEURL + url;
    const image_URLs = {
      true: url,
      false: completeURL,
    };
    const imageURL = image_URLs[url.split(':')[0] === 'https'];
    let {groupType, id, category, llamaCost: variant} = files[file];
    let variant_ = parseInt(variant);
    if (variant_) {
      category += '_' + variant_;
    }
    dispatch(
      updateVehicleImage(
        groupType,
        INSPECTION_SUBCATEGORY[category],
        imageURL,
        id,
      ),
    );
  }
}
export const generateRandomString = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const minLength = 5;
  const maxLength = 10;
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
};

export const handleNewInspectionPress = async (
  dispatch,
  setIsLoading,
  companyId,
  token,
  navigation,
  resetAllStates,
) => {
  setIsLoading(true);
  const body = {
    licensePlateNumber: generateRandomString(),
    companyId: companyId,
  };
  dispatch(setCompanyId(companyId));
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  await axios
    .post(CREATE_INSPECTION_URL, body, {headers: headers})
    .then(response =>
      onNewInspectionPressSuccess(
        response,
        dispatch,
        navigation,
        resetAllStates,
      ),
    )
    .catch(err => onNewInspectionPressFail(err, dispatch))
    .finally(() => setIsLoading(false));
};
function onNewInspectionPressSuccess(
  response,
  dispatch,
  navigation,
  resetAllStates,
) {
  const {id = null} = response?.data || {};
  const {NEW_INSPECTION, INSPECTION_SELECTION} = ROUTES;

  dispatch(numberPlateSelected(id));
  resetAllStates();
  navigation.navigate(NEW_INSPECTION, {
    routeName: INSPECTION_SELECTION,
  });
}
function onNewInspectionPressFail(err, dispatch) {
  const {statusCode = null} = err?.response?.data || {};
  console.log('err => ', statusCode);
  if (statusCode === 401) {
    handle_Session_Expired(statusCode, dispatch);
  }
}
export function handle_Session_Expired(statusCode = null, dispatch) {
  if (statusCode === 401) {
    dispatch(sessionExpired());
  }
}
export const EXTRACT_INSPECTION_ITEM_ID = key => {
  const {
    carVerificiationItems: carVerification,
    exteriorItems: exterior,
    interiorItems: interior,
    tires,
  } = store.getState().newInspection;
  const {
    exteriorLeftID,
    exteriorLeft_1ID,
    exteriorLeft_2ID,
    exteriorRightID,
    exteriorRight_1ID,
    exteriorRight_2ID,
    exteriorFrontID,
    exteriorFront_1ID,
    exteriorFront_2ID,
    exteriorRearID,
    exteriorRear_1ID,
    exteriorRear_2ID,
    exteriorFrontLeftCornerID,
    exteriorFrontLeftCorner_1ID,
    exteriorFrontLeftCorner_2ID,
    exteriorFrontRightCornerID,
    exteriorFrontRightCorner_1ID,
    exteriorFrontRightCorner_2ID,
    exteriorRearLeftCornerID,
    exteriorRearLeftCorner_1ID,
    exteriorRearLeftCorner_2ID,
    exteriorRearRightCornerID,
    exteriorRearRightCorner_1ID,
    exteriorRearRightCorner_2ID,
    exteriorInsideCargoRoofID,
    exteriorInsideCargoRoof_1ID,
    exteriorInsideCargoRoof_2ID,
  } = exterior;
  const {
    driverSideID,
    driverSide_1ID,
    driverSide_2ID,
    passengerSideID,
    passengerSide_1ID,
    passengerSide_2ID,
  } = interior;
  const {licensePlateID, odometerID} = carVerification;
  const {leftFrontTireID, leftRearTireID, rightFrontTireID, rightRearTireID} =
    tires;
  const GET_EXTERIOR_ITEM = {
    licensePlate: licensePlateID,
    odometer: odometerID,
    exteriorFront: exteriorFrontID,
    exteriorFront_1: exteriorFront_1ID,
    exteriorFront_2: exteriorFront_2ID,
    exteriorRear: exteriorRearID,
    exteriorRear_1: exteriorRear_1ID,
    exteriorRear_2: exteriorRear_2ID,
    exteriorLeft: exteriorLeftID,
    exteriorLeft_1: exteriorLeft_1ID,
    exteriorLeft_2: exteriorLeft_2ID,
    exteriorRight: exteriorRightID,
    exteriorRight_1: exteriorRight_1ID,
    exteriorRight_2: exteriorRight_2ID,
    exteriorFrontLeftCorner: exteriorFrontLeftCornerID,
    exteriorFrontLeftCorner_1: exteriorFrontLeftCorner_1ID,
    exteriorFrontLeftCorner_2: exteriorFrontLeftCorner_2ID,
    exteriorFrontRightCorner: exteriorFrontRightCornerID,
    exteriorFrontRightCorner_1: exteriorFrontRightCorner_1ID,
    exteriorFrontRightCorner_2: exteriorFrontRightCorner_2ID,
    exteriorRearLeftCorner: exteriorRearLeftCornerID,
    exteriorRearLeftCorner_1: exteriorRearLeftCorner_1ID,
    exteriorRearLeftCorner_2: exteriorRearLeftCorner_2ID,
    exteriorRearRightCorner: exteriorRearRightCornerID,
    exteriorRearRightCorner_1: exteriorRearRightCorner_1ID,
    exteriorRearRightCorner_2: exteriorRearRightCorner_2ID,
    exteriorInsideCargoRoof: exteriorInsideCargoRoofID,
    exteriorInsideCargoRoof_1: exteriorInsideCargoRoof_1ID,
    exteriorInsideCargoRoof_2: exteriorInsideCargoRoof_2ID,
    driverSide: driverSideID,
    driverSide_1: driverSide_1ID,
    driverSide_2: driverSide_2ID,
    passengerSide: passengerSideID,
    passengerSide_1: passengerSide_1ID,
    passengerSide_2: passengerSide_2ID,
    leftFrontTire: leftFrontTireID,
    leftRearTire: leftRearTireID,
    rightFrontTire: rightFrontTireID,
    rightRearTire: rightRearTireID,
  };
  return GET_EXTERIOR_ITEM[key] || "Inspection ID doesn't exists";
};
export const isNotEmpty = value =>
  value !== null && value !== undefined && value !== '' && value !== 0;
export const isObjectEmpty = (object = {}) => {
  const extractValues = Object?.values(object);
  return extractValues?.includes('');
};
export const haveOneValue = (object = {}) => {
  const extractValues = Object?.values(object);
  const even = element => element !== '';

  return extractValues.some(even);
};
export const checkExterior = () => {
  const {exteriorItems: exterior} = store.getState().newInspection;
  const {
    exteriorLeftID,
    exteriorRightID,
    exteriorFrontID,
    exteriorRearID,
    exteriorFrontLeftCornerID,
    exteriorFrontRightCornerID,
    exteriorRearLeftCornerID,
    exteriorRearRightCornerID,
    exteriorInsideCargoRoofID,
  } = exterior;

  const leftCheck =
    isNotEmpty(exteriorLeftID) ||
    (isNotEmpty(exteriorFrontLeftCornerID) &&
      isNotEmpty(exteriorRearLeftCornerID));

  const rightCheck =
    isNotEmpty(exteriorRightID) ||
    (isNotEmpty(exteriorFrontRightCornerID) &&
      isNotEmpty(exteriorRearRightCornerID));
  return (
    isNotEmpty(exteriorFrontID) &&
    isNotEmpty(exteriorRearID) &&
    isNotEmpty(exteriorInsideCargoRoofID) &&
    leftCheck &&
    rightCheck
  );
};
export const FILTER_IMAGES = (arr = [], toFilter = 'before') => {
  const {carVerificiationItems, exteriorItems, interiorItems, tires} =
    INSPECTION;
  if (!Array.isArray(arr)) {
    return;
  }
  if (toFilter === 'before') {
    return arr.filter(item => item?.pictureTag === toFilter);
  } else {
    return arr.filter(item => {
      const {groupType, pictureTag} = item;
      if (groupType === carVerificiationItems || groupType === tires) {
        return item;
      } else if (
        (groupType === exteriorItems || groupType === interiorItems) &&
        pictureTag === toFilter
      ) {
        return item;
      }
    });
  }
};
export function extractIDs(obj) {
  const idsArray = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key.includes('ID')) {
      if (isNotEmpty(obj[key])) {
        idsArray.push(obj[key]);
      }
    }
  }
  return idsArray;
}
export function exteriorVariant(item, variant) {
  if (variant === 0) {
    return item;
  }
  return item + '_' + variant;
}
export const get_Inspection_Details = async (dispatch, inspectionId) => {
  const endPoint = generateApiUrl(`files/details/${inspectionId}`);

  await axios
    .get(endPoint)
    .then(res => onGet_Inspection_DetailsSuccess(res, dispatch, inspectionId))
    .catch(error => onGet_Inspection_DetailsFail(error, dispatch));
};
function onGet_Inspection_DetailsSuccess(res, dispatch, inspectionId) {
  const {files = {}} = res?.data || {};
  dispatch(fileDetails(files, inspectionId));
}
function onGet_Inspection_DetailsFail(error, dispatch) {
  const {statusCode = null} = error?.response?.data || {};
  if (statusCode === 401) {
    handle_Session_Expired(statusCode, dispatch);
  }
  console.log('error of inspection in progress => ', error);
}
export const getAnnotationStatus = (files = [], id = '') => {
  if (!isNotEmpty(files) || !isNotEmpty(id)) {
    return false;
  }
  for (let i = 0; i < files.length; i++) {
    const checkById =
      id === files[i].id && isNotEmpty(files[i].coordinateArray);
    if (checkById) {
      return true;
    }
  }
  return false;
};
export const extractCoordinates = (files = [], id = null) => {
  if (!isNotEmpty(files)) {
    return [];
  }
  let coordinates = [];
  for (let file = 0; file < files.length; file++) {
    if (id === files[file].id) {
      return files[file].coordinateArray || [];
    }
  }
  return coordinates;
};
export function assignNumber(arr = [], length = 0) {
  const countMap = {};
  for (let i = 0; i < length; i++) {
    if (countMap[arr[i].category] !== undefined) {
      countMap[arr[i].category] += 1;
    } else {
      countMap[arr[i].category] = 0;
    }
    if (countMap[arr[i].category]) {
      arr[i].category += '_' + countMap[arr[i].category];
    }
  }
}
export const fallBack = () => {};
export const mergeData = (list = [], label = '') => {
  if (list?.length < 1 || !Array.isArray(list)) {
    console.log('Empty Array or invalid array');
    return list;
  }
  const newList = [];
  for (let i = 0; i < list.length; i++) {
    const body = {
      ...list[i],
      label: label,
    };
    newList.push(body);
  }
  return newList;
};
export function checkRelevantType(type) {
  const {interiorItems, exteriorItems} = INSPECTION;
  const relevantGroupTypes = [interiorItems, exteriorItems];
  return relevantGroupTypes.includes(type) || false;
}
