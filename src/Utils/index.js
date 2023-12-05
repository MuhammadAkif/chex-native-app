import * as yup from 'yup';
import {Camera} from 'react-native-vision-camera';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import {DEV_URL, fetchInProgressURL, uploadURL} from '../Constants';
import {ROUTES} from '../Navigation/ROUTES';
import {Alert} from 'react-native';

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
    .required('Please enter your Name!')
    .min(2, 'Name must be at least 2 characters'),
  password: yup
    .string()
    .min(1, 'Password must be at least 1 characters')
    .required('Please enter your password!'),
});

//New Inspection Objects starts here
//____________________________Car Verification_________________________
export const LicensePlateDetails = {
  key: 'licensePlate',
  title: 'License Plate',
  source: require('../Assets/Images/license_number.jpg'),
  instructionalText: 'Please take a photo of the License plate on the vehicle',
  instructionalSubHeadingText: '',
  category: 'CarVerification',
  subCategory: 'license_plate_number',
  groupType: 'carVerificiationItems',
  buttonText: 'Capture Now',
};
export const OdometerDetails = {
  key: 'odometer',
  title: 'Odometer',
  source: require('../Assets/Images/Odometer.jpeg'),
  instructionalText:
    'Please take a photo entire odometer dashboard area with vehicle turned on capturing following items:',
  instructionalSubHeadingText: 'Vehicle mileage',
  category: 'CarVerification',
  subCategory: 'odometer',
  groupType: 'carVerificiationItems',
  buttonText: 'Capture Now',
};
//___________________________Exterior______________________________
export const ExteriorLeftDetails = {
  key: 'exteriorLeft',
  title: 'Exterior Left',
  source: require('../Assets/Images/ExteriorLeft.jpg'),
  instructionalText:
    'Please take a photo clearly capturing the entire exterior left side of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'exterior_left',
  groupType: 'exteriorItems',
  isVideo: false,
};
export const ExteriorRightDetails = {
  key: 'exteriorRight',
  title: 'Exterior Right',
  source: require('../Assets/Images/ExteriorRight.jpg'),
  instructionalText:
    'Please take a photo clearly capturing the entire exterior right side of the vehicle',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'exterior_right',
  groupType: 'exteriorItems',
  isVideo: false,
};
export const ExteriorFrontDetails = {
  key: 'exteriorFront',
  title: 'Exterior Front',
  source: require('../Assets/Videos/ExteriorFront.mp4'),
  instructionalText:
    'Please upload a video clearly showing the front of the vehicle with turn indicators and head lights turned on',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'exterior_front',
  groupType: 'exteriorItems',
  isVideo: true,
};
export const ExteriorRearDetails = {
  key: 'exteriorRear',
  title: 'Exterior Rear',
  source: require('../Assets/Videos/ExteriorRear.mp4'),
  instructionalText:
    'Please upload a video clearly showing the rear of the vehicle with turn indicators and tail lights turned on',
  instructionalSubHeadingText: '',
  buttonText: 'Capture Now',
  category: 'Exterior',
  subCategory: 'exterior_rear',
  groupType: 'exteriorItems',
  isVideo: true,
};
//____________________________Tires_____________________________
export const LeftFrontTireDetails = {
  key: 'leftFrontTire',
  title: 'Left Front Tire',
  source: require('../Assets/Images/Tires.jpeg'),
  instructionalText:
    'Please place a penny on the tire thread and take a photo capturing following items:',
  instructionalSubHeadingText:
    'Place Lincoln’s heads on the penny upside down and facing the camera',
  buttonText: 'Capture Now',
  category: 'Tires',
  subCategory: 'left_front_tire',
  groupType: 'tires',
  isVideo: false,
};
export const LeftRearTireDetails = {
  key: 'leftRearTire',
  title: 'Left Rear Tire',
  source: require('../Assets/Images/Tires.jpeg'),
  instructionalText:
    'Please place a penny on the tire thread and take a photo capturing following items:',
  instructionalSubHeadingText:
    'Place Lincoln’s heads on the penny upside down and facing the camera',
  buttonText: 'Capture Now',
  category: 'Tires',
  subCategory: 'left_rear_tire',
  groupType: 'tires',
  isVideo: false,
};
export const RightFrontTireDetails = {
  key: 'rightFrontTire',
  title: 'Right Front Tire',
  source: require('../Assets/Images/Tires.jpeg'),
  instructionalText:
    'Please place a penny on the tire thread and take a photo capturing following items:',
  instructionalSubHeadingText:
    'Place Lincoln’s heads on the penny upside down and facing the camera',
  buttonText: 'Capture Now',
  category: 'Tires',
  subCategory: 'right_front_tire',
  groupType: 'tires',
  isVideo: false,
};
export const RightRearTireDetails = {
  key: 'rightRearTire',
  title: 'Right Rear Tire',
  source: require('../Assets/Images/Tires.jpeg'),
  instructionalText:
    'Please place a penny on the tire thread and take a photo capturing following items:',
  instructionalSubHeadingText:
    'Place Lincoln’s heads on the penny upside down and facing the camera',
  buttonText: 'Capture Now',
  category: 'Tires',
  subCategory: 'right_rear_tire',
  groupType: 'tires',
  isVideo: false,
};

//New Inspection Objects starts here
// Mock Data stars here
export const MockInspectionDetail = [
  {
    source: require('../Assets/Images/InspectionDetails/Overwiew.jpg'),
    name: 'Overview',
  },
  {
    source: require('../Assets/Images/InspectionDetails/InteriorDriverside.jpg'),
    name: 'Interior Driverside',
  },
  {
    source: require('../Assets/Images/InspectionDetails/DriverSeatAdjusted.jpg'),
    name: 'Driver seat Adjusted',
  },
  {
    source: require('../Assets/Images/InspectionDetails/InteriorPassengerSide.jpg'),
    name: 'Interior Passengerside',
  },
  {
    source: require('../Assets/Images/InspectionDetails/PassengerSeatAdjusted.jpg'),
    name: 'Passenger seat Adjusted',
  },
  {
    source: require('../Assets/Images/InspectionDetails/InteriorBackseat.jpg'),
    name: 'Interior Backseat',
  },
];
export const MockLicensePlateNumbers = [
  'DFKGI',
  'OPOPL',
  'FEPOI',
  'FPALI',
  'AAWWP',
  'POLIK',
];
// Mock Data ends here

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
      uploadURL,
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
    .catch(error => console.log(error));
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
    {'Content-Type': mime},
    RNFetchBlob.wrap(path),
  )
    .uploadProgress((written, total) => {
      const percentCompleted = Math.round((written * 100) / total);
      setProgress(percentCompleted);
    })
    .then(res => {
      handleResponse(key);
    })
    .catch(err => {
      Alert.alert(
        'Upload Failed',
        'Please check your internet connection and try again. If issues persist, reduce file size or switch networks. Contact support if needed. Apologies for any inconvenience.',
        [{text: 'Retry', onPress: handleError}],
      );
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
      console.log('uploadFile error :', error);
      const {title, message} = newInspectionUploadError(
        error.response.data.statusCode,
      );
      Alert.alert(title, message, [{text: 'Retry', onPress: handleError}]);
    });
  return imageID;
};
export const fetchInProgressInspections = async (
  token,
  status,
  setIsLoading,
) => {
  let data = '';
  await axios
    .post(
      fetchInProgressURL,
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

  return `${day}/${month}/${year}`;
};
export const handleHomePress = navigation =>
  navigation.navigate(ROUTES.INSPECTION_SELECTION);
export const handleStartInspectionPress = navigation =>
  navigation.navigate(ROUTES.LICENSE_PLATE_SELECTION);

// export const convertToBase64 = uri => {
//   let base64Path = '';
//   RNFetchBlob.fs
//     .readFile(uri, 'base64')
//     .then(base64 => {
//       console.log('base64 String => ', base64);
//       base64Path = base64;
//     })
//     .catch(error => console.log('error converting base64 => ', error));
//   return base64Path;
// };
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

export const getBlob = async fileUri => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

export const newInspectionUploadError = statusCode => {
  const errorTitle = statusCode === 409 ? 'Duplicate Image Detected' : '';
  const errorMessage =
    statusCode === 409
      ? 'An image/video for this category was uploaded previously and already exists in our database. please refresh your page to see the previously uploaded image.'
      : '';
  return {title: errorTitle, message: errorMessage};
};

export const extractTitle = (groupType, category) => {
  let title = 'No Title';
  if (groupType === 'carVerificiationItems') {
    title =
      category === 'license_plate_number'
        ? 'License Plate Number'
        : category === 'odometer'
        ? 'Odometer'
        : 'No Title';
  } else if (groupType === 'exteriorItems') {
    title =
      category === 'exterior_left'
        ? 'Exterior Left'
        : category === 'exterior_right'
        ? 'Exterior Right'
        : category === 'exterior_front'
        ? 'Exterior Front'
        : category === 'exterior_rear'
        ? 'Exterior Rear'
        : 'No Title';
  } else if (groupType === 'tires') {
    title =
      category === 'left_front_tire'
        ? 'Left Front Tire'
        : category === 'left_rear_tire'
        ? 'Left Rear Tire'
        : category === 'right_front_tire'
        ? 'Right Front Tire'
        : category === 'right_rear_tire'
        ? 'Right Rear Tire'
        : 'No Title';
  }
  return title;
};

export const sortInspectionReviewedItems = list => {
  const customSortOrder = {
    groupType: ['carVerificiationItems', 'exteriorItems', 'tires'],
    carVerificiationItems: ['license_plate_number', 'odometer'],
    exteriorItems: [
      'Exterior-Left',
      'Exterior-Right',
      'Exterior-Front',
      'Exterior-Rear',
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

    const categoryComparison =
      customSortOrder[a.groupType].indexOf(a.category) -
      customSortOrder[b.groupType].indexOf(b.category);
    return categoryComparison;
  }

  const sortedArray = list.sort(customSort);

  console.log(sortedArray);
  return sortedArray;
};
