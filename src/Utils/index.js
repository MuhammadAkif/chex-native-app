import {Alert} from 'react-native';
import * as yup from 'yup';
import {Camera} from 'react-native-vision-camera';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import {
  CREATE_INSPECTION_URL,
  API_BASE_URL,
  FETCH_IN_PROGRESS_URL,
  Image_Type,
  INSPECTION,
  INSPECTION_SUBCATEGORY,
  S3_BUCKET_BASEURL,
  UPLOAD_URL,
} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {
  File_Details,
  NumberPlateSelectedAction,
  UpdateCarVerificationItemURI,
  UpdateExteriorItemURI,
  UpdateTiresItemURI,
} from '../Store/Actions';
import {Types} from '../Store/Types';
import {IMAGES} from '../Assets/Images';
import {store} from '../Store';

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
        dispatch,
      );
    })
    .catch(error => {
      error_Handler(handleError);
      const statusCode = error?.response?.data?.statusCode;
      if (statusCode === 401) {
        handle_Session_Expired(statusCode, dispatch);
      }
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
      error_Handler(handleError);
    });
};
export const uploadFile = async (
  callback,
  body,
  inspectionId,
  token,
  handleError,
  dispatch,
) => {
  let imageID = 0;
  await axios
    .post(`${API_BASE_URL}/api/v1/vehicle/${inspectionId}/file`, body, {
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
      const statusCode = error?.response?.data?.statusCode;
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
    });
  return imageID;
};
export const fetchInProgressInspections = async (
  token,
  status,
  setIsLoading,
  dispatch,
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
      const statusCode = error?.response?.data?.statusCode;
      if (statusCode === 401) {
        handle_Session_Expired(statusCode, dispatch);
      }
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
  return errors[statusCode] || errors.noStatusCode;
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
// export const sortInspection_Reviewed_Items = list => {
//   const customSortOrder = {
//     groupType: ['carVerificiationItems', 'exteriorItems', 'tires'],
//     carVerificiationItems: ['license_plate_number', 'odometer'],
//     exteriorItems: [
//       'Exterior-Front',
//       'Exterior-Front',
//       'Exterior-Front',
//       'Exterior-Rear',
//       'Exterior-Rear',
//       'Exterior-Rear',
//       'Front-Left-Corner',
//       'Front-Left-Corner',
//       'Front-Left-Corner',
//       'Front-Right-Corner',
//       'Front-Right-Corner',
//       'Front-Right-Corner',
//       'Rear-Left-Corner',
//       'Rear-Left-Corner',
//       'Rear-Left-Corner',
//       'Rear-Right-Corner',
//       'Rear-Right-Corner',
//       'Rear-Right-Corner',
//       'Inside-Cargo-Roof',
//       'Inside-Cargo-Roof',
//       'Inside-Cargo-Roof',
//     ],
//     tires: [
//       'Left-Front-Tire',
//       'Left-Right-Tire',
//       'Right-Front-Tire',
//       'Right-Rear-Tire',
//     ],
//   };
//
//   // Step 1: Count occurrences
//   const countMap = {};
//   list.forEach(item => {
//     const key = `${item.groupType}-${item.category}`;
//     countMap[key] = (countMap[key] || 0) + 1;
//   });
//
//   // Step 2: Sort the list based on custom order
//   const sortedList = list.sort((a, b) => {
//     const groupTypeComparison =
//       customSortOrder.groupType.indexOf(a.groupType) -
//       customSortOrder.groupType.indexOf(b.groupType);
//
//     if (groupTypeComparison !== 0) {
//       return groupTypeComparison; // Sort by groupType first
//     }
//
//     return (
//       customSortOrder[a.groupType].indexOf(a.category) -
//       customSortOrder[b.groupType].indexOf(b.category) // Sort by category second
//     );
//   });
//
//   // Step 3: Flatten the sorted list based on counts
//   const finalSortedList = [];
//   sortedList.forEach(item => {
//     const key = `${item.groupType}-${item.category}`;
//     const count = countMap[key];
//     for (let i = 0; i < count; i++) {
//       finalSortedList.push(item);
//     }
//     // Delete the count to avoid duplicates in the final list
//     delete countMap[key];
//   });
//
//   return finalSortedList;
// };
export const sortInspection_Reviewed_Items = list => {
  const customSortOrder = {
    groupType: ['carVerificiationItems', 'exteriorItems', 'tires'],
    carVerificiationItems: ['license_plate_number', 'odometer'],
    exteriorItems: [
      'Exterior-Front',
      'Exterior-Front',
      'Exterior-Front',
      'Exterior-Rear',
      'Exterior-Rear',
      'Exterior-Rear',
      'Front-Left-Corner',
      'Front-Left-Corner',
      'Front-Left-Corner',
      'Front-Right-Corner',
      'Front-Right-Corner',
      'Front-Right-Corner',
      'Rear-Left-Corner',
      'Rear-Left-Corner',
      'Rear-Left-Corner',
      'Rear-Right-Corner',
      'Rear-Right-Corner',
      'Rear-Right-Corner',
      'Inside-Cargo-Roof',
      'Inside-Cargo-Roof',
      'Inside-Cargo-Roof',
    ],
    tires: [
      'Left-Front-Tire',
      'Left-Right-Tire',
      'Right-Front-Tire',
      'Right-Rear-Tire',
    ],
  };

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
      customSortOrder[a.groupType].indexOf(a.category) -
      customSortOrder[b.groupType].indexOf(b.category) // Sort by category second
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
    let {groupType, id, category, llamaCost: variant} = files[file];
    let variant_ = parseInt(variant);
    if (variant_) {
      category += '_' + variant_;
    }
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
  dispatch({type: Types.company_ID, payload: companyId});
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
      console.log('err => ', err?.response?.data?.statusCode);
      const statusCode = err?.response?.data?.statusCode;
      if (statusCode === 401) {
        handle_Session_Expired(statusCode, dispatch);
      }
    })
    .finally(() => setIsLoading(false));
};
export function handle_Session_Expired(statusCode = null, dispatch) {
  if (statusCode === 401) {
    dispatch({type: Types.SESSION_EXPIRED});
  }
}

export const EXTRACT_INSPECTION_ITEM_ID = key => {
  const {
    carVerificationItems: carVerification,
    exteriorItems: exterior,
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
  if (!Array.isArray(arr)) {
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

export function exteriorVariant(item, variant) {
  if (variant === 0) {
    return item;
  }
  return item + '_' + variant;
}
export const get_Inspection_Details = async (dispatch, inspectionId) => {
  await axios
    .get(`${API_BASE_URL}/api/v1/files/details/${inspectionId}`)
    .then(res => {
      const details = res?.data?.files;
      dispatch(File_Details(details, inspectionId));
    })
    .catch(error => {
      const statusCode = error?.response?.data?.statusCode;
      if (statusCode === 401) {
        handle_Session_Expired(statusCode, dispatch);
      }
      console.log('error of inspection in progress => ', error);
    });
};
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
export const fallBack = (text = 'Fall back Pressed') => console.log(text);
