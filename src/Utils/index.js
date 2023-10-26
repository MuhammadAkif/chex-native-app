import * as yup from 'yup';
import {Camera} from 'react-native-vision-camera';

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
  // .email('Please enter a valid email')
  // .matches(
  //   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  //   'Invalid email format',
  // ),
  password: yup
    .string()
    .min(6, 'Password must be at least 8 characters')
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
