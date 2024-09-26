// Api Endpoints start here
import {IMAGES} from '../Assets/Images';

const ENV_TYPE_URL = {
  staging: process.env.STAGING_URL,
  production: process.env.PRODUCTION_URL,
  development: process.env.DEVELOPMENT_URL,
};
export const DEV_URL = 'https://cd-partially-survivors-agree.trycloudflare.com';
// export const DEV_URL = ENV_TYPE_URL.development;
export const S3_BUCKET_BASEURL = process.env.S3_BUCKET_BASEURL;
export const FETCH_NUMBER_PLATE_URL = DEV_URL + '/api/v1/searchnumberplate';
export const EXTRACT_NUMBER_PLATE =
  DEV_URL + '/api/v1/extract/inspection/create';
export const EXTRACT_NUMBER_PLATE_WITH_AI =
  process.env.EXTRACT_NUMBER_PLATE_URL;
export const LOGIN_URL = DEV_URL + '/api/v1/auth/login';
export const UPLOAD_URL = DEV_URL + '/api/v1/file/upload';
export const CREATE_INSPECTION_URL = DEV_URL + '/api/v1/create/inspection';
export const FETCH_IN_PROGRESS_URL = DEV_URL + '/api/v1/status/vehicle';
export const FORGET_PASSWORD_URL = DEV_URL + '/api/v1/auth/reset/email';
export const RESET_PASSWORD_URL = DEV_URL + '/api/v1/auth/reset/password';
export const INSPECTION_TIRE_STATUS = DEV_URL + '/api/v1/display/tire';
export const REMOVE_ALL_TIRES = DEV_URL + '/api/v1/delete/file';
export const ANNOTATION = DEV_URL + '/api/v1/file/coordinate';
export const AI_API_TOKEN = process.env.AI_API_TOKEN;
// Api Endpoints ends here

export const HARDWARE_BACK_PRESS = 'hardwareBackPress';
export const ANDROID = 'android';
export const WINDOW = 'window';
export const IOS = 'ios';

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
  exterior_front_1: 'exteriorFront_1',
  exterior_front_2: 'exteriorFront_2',
  exterior_rear: 'exteriorRear',
  exterior_rear_1: 'exteriorRear_1',
  exterior_rear_2: 'exteriorRear_2',
  exterior_left: 'exteriorLeft',
  exterior_left_1: 'exteriorLeft_1',
  exterior_left_2: 'exteriorLeft_2',
  exterior_right: 'exteriorRight',
  exterior_right_1: 'exteriorRight_1',
  exterior_right_2: 'exteriorRight_2',
  front_left_corner: 'exteriorFrontLeftCorner',
  front_left_corner_1: 'exteriorFrontLeftCorner_1',
  front_left_corner_2: 'exteriorFrontLeftCorner_2',
  front_right_corner: 'exteriorFrontRightCorner',
  front_right_corner_1: 'exteriorFrontRightCorner_1',
  front_right_corner_2: 'exteriorFrontRightCorner_2',
  rear_left_corner: 'exteriorRearLeftCorner',
  rear_left_corner_1: 'exteriorRearLeftCorner_1',
  rear_left_corner_2: 'exteriorRearLeftCorner_2',
  rear_right_corner: 'exteriorRearRightCorner',
  rear_right_corner_1: 'exteriorRearRightCorner_1',
  rear_right_corner_2: 'exteriorRearRightCorner_2',
  inside_cargo_roof: 'exteriorInsideCargoRoof',
  inside_cargo_roof_1: 'exteriorInsideCargoRoof_1',
  inside_cargo_roof_2: 'exteriorInsideCargoRoof_2',
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
export const SESSION_EXPIRED = {
  TITLE: 'Session Expired',
  MESSAGE: 'Your session has expired. Please log in again to continue.',
  BUTTON: 'OK',
};

export const ANNOTATE_IMAGE_DETAILS = {
  title: 'Exterior Front',
  source: IMAGES.front_Left_Corner,
  description:
    "To annotate an image of a vehicle's front, you can click directly on the area of interest within the image. Upon clicking, a damage icon will appear at the selected spot, allowing you to visually mark and highlight the specific location of any damage.",
  instruction: 'Do you want to Annotate\n',
  annotateText: 'Annotate',
  skipText: 'Skip',
};
export const ANNOTATE_IMAGE = {
  title: 'Exterior Front',
  source: IMAGES.front_Left_Corner,
  description:
    "To annotate an image of a vehicle's front, you can click directly on the area of interest within the image. Upon clicking, a damage icon will appear at the selected spot, allowing you to visually mark and highlight the specific location of any damage.",
  instruction: 'Do you want to Annotate\n',
  annotateText: 'Submit',
  cancelText: 'Cancel',
};

export const DAMAGE_TYPE = ['Minor', 'Major', 'Severe'];
export const Image_Type = {
  files: [
    {
      id: 23182,
      category: 'license_plate_number',
      isReviewed: false,
      comments: null,
      groupType: 'carVerificiationItems',
      extension: 'image/jpg',
      url: 'uploads/46/ImkOtv_aB4OgPuonvr-At',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:35:41.143Z',
      updatedAt: '2024-09-25T13:35:54.605Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22671,
          fileId: 23182,
          status: null,
          checkStatus: null,
          Check: {
            id: 1,
            name: 'Photo capturing Vin located on the vehicle or on the registration card',
            category: 'license_plate_number',
          },
        },
      ],
    },
    {
      id: 23184,
      category: 'exterior_front',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/5K4Muw3HTcaJOK526mvxW',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:36:59.880Z',
      updatedAt: '2024-09-25T13:36:59.880Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22673,
          fileId: 23184,
          status: null,
          checkStatus: null,
          Check: {
            id: 52,
            name: 'New damage detected',
            category: 'exterior_front',
          },
        },
      ],
    },
    {
      id: 23185,
      category: 'exterior_rear',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/UhHINBNTqOgMmJkty-9hP',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: [
        {
          id: 0,
          coordinates: {x: 128.2084503173828, y: 18.085227966308594},
          type: 'Severe',
          notes: 'Bzhzhzsb',
        },
        {
          id: 1,
          coordinates: {x: 118.39950561523438, y: 22.44708824157715},
          type: 'Minor',
          notes: 'Hahabsb',
        },
      ],
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:37:19.451Z',
      updatedAt: '2024-09-25T13:37:38.262Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22674,
          fileId: 23185,
          status: null,
          checkStatus: null,
          Check: {
            id: 53,
            name: 'New damage detected',
            category: 'exterior_rear',
          },
        },
      ],
    },
    {
      id: 23186,
      category: 'exterior_front',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/sq89ZtcUft3QuK8-SZLlL',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: [
        {
          id: 0,
          coordinates: {x: 225.93643188476562, y: 47.8909797668457},
          type: 'Major',
          notes: 'Test',
        },
      ],
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:37:56.715Z',
      updatedAt: '2024-09-25T13:38:18.056Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22675,
          fileId: 23186,
          status: null,
          checkStatus: null,
          Check: {
            id: 52,
            name: 'New damage detected',
            category: 'exterior_front',
          },
        },
      ],
    },
    {
      id: 23187,
      category: 'front_left_corner',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/fTIXEU4u81uuCix3fxPvt',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:38:41.248Z',
      updatedAt: '2024-09-25T13:38:41.248Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22676,
          fileId: 23187,
          status: null,
          checkStatus: null,
          Check: {
            id: 47,
            name: 'New damage detected',
            category: 'front_left_corner',
          },
        },
      ],
    },
    {
      id: 23188,
      category: 'odometer',
      isReviewed: false,
      comments: null,
      groupType: 'carVerificiationItems',
      extension: 'image/jpg',
      url: 'uploads/46/cdAlFriPKI51jBFrT9BVR',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:39:13.782Z',
      updatedAt: '2024-09-25T13:39:13.782Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22677,
          fileId: 23188,
          status: null,
          checkStatus: null,
          Check: {id: 2, name: 'Speedometer', category: 'odometer'},
        },
      ],
    },
    {
      id: 23189,
      category: 'front_right_corner',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/1ss01bgj47dJxIiF9nSLg',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: [
        {
          id: 0,
          coordinates: {x: 69.71733093261719, y: 170.3852996826172},
          type: 'Minor',
          notes: 'Testing ',
        },
        {
          id: 1,
          coordinates: {x: 196.50888061523438, y: 123.1921157836914},
          type: 'Major',
          notes: 'Jdiskd',
        },
        {
          id: 2,
          coordinates: {x: 266.2624206542969, y: 136.21768188476562},
          type: 'Severe',
          notes: 'Nzus',
        },
      ],
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:39:33.460Z',
      updatedAt: '2024-09-25T13:39:52.181Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22678,
          fileId: 23189,
          status: null,
          checkStatus: null,
          Check: {
            id: 48,
            name: 'New damage detected',
            category: 'front_right_corner',
          },
        },
      ],
    },
    {
      id: 23190,
      category: 'rear_right_corner',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/tO31B62gFQAEsT0cVPrU4',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: [
        {
          id: 0,
          coordinates: {x: 209.22442626953125, y: 123.49573516845703},
          type: 'Major',
          notes: 'Mkmk\n',
        },
      ],
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:40:11.976Z',
      updatedAt: '2024-09-25T13:40:23.427Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22679,
          fileId: 23190,
          status: null,
          checkStatus: null,
          Check: {
            id: 50,
            name: 'New damage detected',
            category: 'rear_right_corner',
          },
        },
      ],
    },
    {
      id: 23191,
      category: 'rear_left_corner',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/S3617nqImXLfslvXwIoAp',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:40:40.519Z',
      updatedAt: '2024-09-25T13:40:40.519Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22680,
          fileId: 23191,
          status: null,
          checkStatus: null,
          Check: {
            id: 49,
            name: 'New damage detected',
            category: 'rear_left_corner',
          },
        },
      ],
    },
    {
      id: 23192,
      category: 'inside_cargo_roof',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/DIGj8FSsyQ7xgfK2puLna',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: [
        {
          id: 0,
          coordinates: {x: 248.4609375, y: 171.11221313476562},
          type: 'Severe',
          notes: 'Hhhh',
        },
      ],
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:40:59.033Z',
      updatedAt: '2024-09-25T13:41:21.882Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22681,
          fileId: 23192,
          status: null,
          checkStatus: null,
          Check: {
            id: 51,
            name: 'New damage detected',
            category: 'inside_cargo_roof',
          },
        },
      ],
    },
    {
      id: 23193,
      category: 'left_front_tire',
      isReviewed: false,
      comments: null,
      groupType: 'tires',
      extension: 'image/jpg',
      url: 'uploads/46/VxW1vcxqohBjWys4NVooe',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:41:45.520Z',
      updatedAt: '2024-09-25T13:41:45.520Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22682,
          fileId: 23193,
          status: null,
          checkStatus: null,
          Check: {
            id: 15,
            name: 'Tires incl. tread depth',
            category: 'left_front_tire',
          },
        },
      ],
    },
    {
      id: 23194,
      category: 'left_rear_tire',
      isReviewed: false,
      comments: null,
      groupType: 'tires',
      extension: 'image/jpg',
      url: 'uploads/46/JJjLyroyE_bQz7C6qKjcj',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:41:59.919Z',
      updatedAt: '2024-09-25T13:41:59.919Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22683,
          fileId: 23194,
          status: null,
          checkStatus: null,
          Check: {
            id: 16,
            name: 'Tires incl. tread depth',
            category: 'left_rear_tire',
          },
        },
      ],
    },
    {
      id: 23195,
      category: 'right_front_tire',
      isReviewed: false,
      comments: null,
      groupType: 'tires',
      extension: 'image/jpg',
      url: 'uploads/46/xos3gdhKtPnPRxLDGe9S4',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:42:18.184Z',
      updatedAt: '2024-09-25T13:42:18.184Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22684,
          fileId: 23195,
          status: null,
          checkStatus: null,
          Check: {
            id: 17,
            name: 'Tires incl. tread depth',
            category: 'right_front_tire',
          },
        },
      ],
    },
    {
      id: 23196,
      category: 'right_rear_tire',
      isReviewed: false,
      comments: null,
      groupType: 'tires',
      extension: 'image/jpg',
      url: 'uploads/46/n3kFOHljLruVXDvnpMzev',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:42:36.742Z',
      updatedAt: '2024-09-25T13:42:36.742Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22685,
          fileId: 23196,
          status: null,
          checkStatus: null,
          Check: {
            id: 18,
            name: 'Tires incl. tread depth',
            category: 'right_rear_tire',
          },
        },
      ],
    },
    {
      id: 23200,
      category: 'exterior_front',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/rJfbFP3L9O18Me-fE_nJp',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: null,
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:47:42.205Z',
      updatedAt: '2024-09-25T13:47:42.205Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22689,
          fileId: 23200,
          status: null,
          checkStatus: null,
          Check: {
            id: 52,
            name: 'New damage detected',
            category: 'exterior_front',
          },
        },
      ],
    },
    {
      id: 23202,
      category: 'exterior_rear',
      isReviewed: false,
      comments: null,
      groupType: 'exteriorItems',
      extension: 'image/jpg',
      url: 'uploads/46/llwy_whvWR15zECHSCPT4',
      inspectionId: 2920,
      orientation: '0',
      dateImage: '25-9-2024',
      dimension: null,
      statusAi: null,
      commentAi: null,
      longitude: null,
      latitude: null,
      pictureTag: 'before',
      fileStatus: 'new',
      coordinateArray: [
        {
          id: 0,
          coordinates: {x: 183.79331970214844, y: 140.2162628173828},
          type: 'Major',
          notes: 'Uujj',
        },
      ],
      vehicleId: 1981,
      llamaMessage: null,
      llamaCost: null,
      createdAt: '2024-09-25T13:54:39.568Z',
      updatedAt: '2024-09-25T13:54:52.110Z',
      deletedAt: null,
      InspectionChecks: [
        {
          id: 22690,
          fileId: 23202,
          status: null,
          checkStatus: null,
          Check: {
            id: 53,
            name: 'New damage detected',
            category: 'exterior_rear',
          },
        },
      ],
    },
  ],
  locationStatus: {isLocation: null, payment_status: false},
  inspection: {
    id: 2920,
    status: 'IN_PROGRESS',
    link: null,
    milage: null,
    reminderCount: 0,
    vehicleId: 1981,
    remarks: null,
    finalStatus: null,
    reviewedBy: null,
    isRejected: 0,
    lyftInspection: false,
    inspectionCode: 'bzS4a',
    inspectionState: null,
    reviewedDate: null,
    assignedTo: null,
    hasAdded: null,
    annualAlert: false,
    annualReinspectionStarted: false,
    annualInspectionCompleted: false,
    isLocation: null,
    userId: 46,
    inspectionCheck: false,
    companyInspectionId: null,
    inspection_id: null,
    webhook_status: null,
    eventId: null,
    createdAt: '2024-09-25T13:35:20.352Z',
    updatedAt: '2024-09-25T13:35:53.882Z',
    deletedAt: null,
  },
  hasAdded: 'new',
};
