import {Alert} from 'react-native';
import * as yup from 'yup';
import {Camera} from 'react-native-vision-camera';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import {
  CREATE_INSPECTION_URL,
  DEV_URL,
  FETCH_IN_PROGRESS_URL,
  INSPECTION,
  INSPECTION_SUBCATEGORY,
  INSPECTION_TITLE,
  S3_BUCKET_BASEURL,
  UPLOAD_URL,
} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {
  NumberPlateSelectedAction,
  UpdateCarVerificationItemURI,
  UpdateExteriorItemURI,
  UpdateTiresItemURI,
} from '../Store/Actions';
import {Types} from '../Store/Types';
import {IMAGES} from '../Assets/Images';
import {store} from '../Store';
// import {DEV_URL, S3_BUCKET_BASEURL} from '@env';

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
  groupType: INSPECTION.CAR_VERIFICATION,
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
  groupType: INSPECTION.CAR_VERIFICATION,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.EXTERIOR,
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
  groupType: INSPECTION.TIRES,
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
  groupType: INSPECTION.TIRES,
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
  groupType: INSPECTION.TIRES,
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
  groupType: INSPECTION.TIRES,
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

export const UPLOAD_FAILED_POP_UP = (callback = null) => {
  Alert.alert(
    'Upload Failed',
    'Please check your internet connection and try again. If issues persist, reduce file size or switch networks. Contact support if needed. Apologies for any inconvenience.',
    [{text: 'Retry', onPress: callback}],
  );
};
export const getSignedUrl = async (
  token,
  mime,
  path,
  setProgress,
  handleResponse,
  handleError,
) => {
  await axios
    .post(
      UPLOAD_URL,
      {type: mime},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(res => {
      const {url, key} = res.data;
      uploadToS3(
        url,
        key,
        path,
        mime,
        setProgress,
        handleResponse,
        handleError,
      );
    })
    .catch(error => {
      console.log(error);
      UPLOAD_FAILED_POP_UP(handleError);
    });
};
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
    .then(() => {
      handleResponse(key);
    })
    .catch(() => {
      UPLOAD_FAILED_POP_UP(handleError);
    });
};
export const uploadFile = async (
  callback,
  body,
  inspectionId,
  token,
  handleError,
) => {
  let imageID = 0;
  await axios
    .post(`${DEV_URL}/api/v1/vehicle/${inspectionId}/file`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      callback(res?.data?.id);
    })
    .catch(error => {
      const inspectionDeleted = error?.response?.data?.statusCode === 403;
      const {title, message} = newInspectionUploadError(
        error?.response?.data?.statusCode,
      );
      if (inspectionDeleted) {
        handleError(inspectionDeleted);
      } else {
        Alert.alert(title, message, [
          {text: 'Retry', onPress: () => handleError(inspectionDeleted)},
        ]);
      }
    });
  return imageID;
};
export const fetchInProgressInspections = async (
  token,
  status = 'IN_PROGRESS',
  setIsLoading,
) => {
  let data = '';
  await axios
    .post(
      FETCH_IN_PROGRESS_URL,
      {
        status: status,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(response => {
      data = response.data;
      if (setIsLoading) {
        setIsLoading(false);
      }
    })
    .catch(error => {
      if (setIsLoading) {
        setIsLoading(false);
      }
      console.log(error);
    });
  return data;
};
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
export const handleStartInspectionPress = navigation =>
  navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION);

export const convertToBase64 = async (url, mime) => {
  let base64Path = '';
  await RNFetchBlob.config({
    fileCache: true,
  })
    .fetch('GET', url)
    .then(resp => resp.readFile('base64'))
    .then(base64 => {
      base64Path = `data:${mime};base64,${base64}`;
    })
    .catch(error => console.log('error converting base64 => ', error));
  return base64Path;
};

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
  console.log('errors[statusCode] => ', errors[statusCode]);
  return errors[statusCode] || errors.noStatusCode;
};

export const extractTitle = (groupType, category) => {
  return INSPECTION_TITLE[category] || 'No Title';
};

export const sortInspectionReviewedItems = list => {
  const customSortOrder = {
    groupType: ['carVerificiationItems', 'exteriorItems', 'tires'],
    carVerificiationItems: ['license_plate_number', 'odometer'],
    exteriorItems: [
      // 'Exterior-Left',
      // 'Exterior-Right',
      'Exterior-Front',
      'Exterior-Rear',
      'Front-Left-Corner',
      'Front-Right-Corner',
      'Rear-Left-Corner',
      'Rear-Right-Corner',
      'Inside-Cargo-Roof',
    ],
    tires: [
      'Left-Front-Tire',
      'Left-Right-Tire',
      'Right-Front-Tire',
      'Right-Rear-Tire',
    ],
  };

  function customSort(a, b) {
    const groupTypeComparison =
      customSortOrder.groupType.indexOf(a.groupType) -
      customSortOrder.groupType.indexOf(b.groupType);
    if (groupTypeComparison !== 0) {
      return groupTypeComparison;
    }

    return (
      customSortOrder[a.groupType].indexOf(a.category) -
      customSortOrder[b.groupType].indexOf(b.category)
    );
  }

  return list.sort(customSort);
};
export const handleUpdateStoreMedia = {
  carVerificiationItems: UpdateCarVerificationItemURI,
  exteriorItems: UpdateExteriorItemURI,
  tires: UpdateTiresItemURI,
};
export function uploadInProgressMediaToStore(files, dispatch) {
  for (let file = 0; file < files.length; file++) {
    const imageURL =
      files[file].url.split(':')[0] === 'https'
        ? files[file].url
        : `${S3_BUCKET_BASEURL}${files[file].url}`;
    const {groupType, id, category} = files[file];
    const UPDATE_INSPECTION_IMAGES = handleUpdateStoreMedia[groupType];
    dispatch(
      UPDATE_INSPECTION_IMAGES(INSPECTION_SUBCATEGORY[category], imageURL, id),
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
  dispatch({type: Types.COMPANY_ID, payload: companyId});
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  await axios
    .post(CREATE_INSPECTION_URL, body, {headers: headers})
    .then(response => {
      // setInspectionID(response.data.id);
      dispatch(NumberPlateSelectedAction(response?.data?.id));
      resetAllStates();
      navigation.navigate(ROUTES.NEW_INSPECTION, {
        routeName: ROUTES.LICENSE_PLATE_SELECTION,
      });
    })
    .catch(err => {
      console.log('err => ', err.message);
    })
    .finally(() => setIsLoading(false));
};

export const EXTRACT_INSPECTION_ITEM_ID = key => {
  const {
    carVerificationItems: carVerification,
    exteriorItems: exterior,
    tires,
  } = store.getState().newInspection;
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
  const {licensePlateID, odometerID} = carVerification;
  const {leftFrontTireID, leftRearTireID, rightFrontTireID, rightRearTireID} =
    tires;
  const GET_EXTERIOR_ITEM = {
    licensePlate: licensePlateID,
    odometer: odometerID,
    exteriorFront: exteriorFrontID,
    exteriorRear: exteriorRearID,
    exteriorLeft: exteriorLeftID,
    exteriorRight: exteriorRightID,
    exteriorFrontLeftCorner: exteriorFrontLeftCornerID,
    exteriorFrontRightCorner: exteriorFrontRightCornerID,
    exteriorRearLeftCorner: exteriorRearLeftCornerID,
    exteriorRearRightCorner: exteriorRearRightCornerID,
    exteriorInsideCargoRoof: exteriorInsideCargoRoofID,
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
  console.log(
    '----- => ',
    isNotEmpty(exteriorFrontID) &&
      isNotEmpty(exteriorRearID) &&
      isNotEmpty(exteriorInsideCargoRoofID) &&
      leftCheck &&
      rightCheck,
  );
  return (
    isNotEmpty(exteriorFrontID) &&
    isNotEmpty(exteriorRearID) &&
    isNotEmpty(exteriorInsideCargoRoofID) &&
    leftCheck &&
    rightCheck
  );
};

export const FILTER_IMAGES = (arr = [], toFilter = 'before') => {
  if (!Array.isArray(arr)) {
    console.log('Please enter an array');
    return;
  }
  if (toFilter === 'before') {
    return arr.filter(item => item?.pictureTag === toFilter);
  } else {
    return arr.filter(item => {
      if (
        item?.groupType === INSPECTION.CAR_VERIFICATION ||
        item?.groupType === INSPECTION.TIRES
      ) {
        return item;
      } else if (
        item?.groupType === INSPECTION.EXTERIOR &&
        item?.pictureTag === toFilter
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
