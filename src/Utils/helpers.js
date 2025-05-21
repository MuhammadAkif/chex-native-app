import {DeviceEventEmitter} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {isNotEmpty} from './index';
import {Landscape, Portrait} from '../Assets/Icons';
import axios from 'axios';

const {BLUETOOTH_CONNECT, BLUETOOTH_SCAN, ACCESS_FINE_LOCATION} =
  PERMISSIONS.ANDROID;
const {GRANTED} = RESULTS;

export const headerFlex = {
  true: 1.5,
  false: 1,
};
export const headerFlexGrow = {
  true: 2,
  false: 1,
};
export const headerTextBottom = {
  true: hp('3%'),
  false: null,
};
export const imageHeight = {
  true: hp('20%'),
  false: hp('30%'),
};
export const instructionsContainerTop = {
  true: hp('25%'),
  false: null,
};
export const INSPECTION_STATUS = {
  true: 'No Damage Detected',
  false: 'Damage Detected',
};
export const progressZIndex = {
  true: -1,
  false: 1,
};

export function formatTitle(title = 'No Title') {
  if (!isNotEmpty(title)) {
    return 'No title';
  }
  // Split title by underscores and capitalize each word
  return title
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const extractStatusesCount = (list = []) => {
  if (list.length < 1) {
    return 'No status counts';
  }
  let counts = {reviewed: 0, in_review: 0, ready_for_review: 0};

  for (let i = 0; i < list.length; i++) {
    const status = list[i].status.toLowerCase();
    counts[status] += 1;
  }
  return counts;
};
export const styleMapping = {
  portrait: {
    exterior_left: {height: hp('25%')},
    exterior_right: {height: hp('25%')},
    exterior_front: {height: hp('50%')},
    exterior_rear: {height: hp('50%')},
    front_left_corner: {height: hp('30%')},
    front_right_corner: {height: hp('30%')},
    rear_left_corner: {height: hp('30%')},
    rear_right_corner: {height: hp('30%')},
  },
  landscape: {
    exterior_left: {width: wp('100%')},
    exterior_right: {width: wp('100%')},
    exterior_front: {width: wp('60%')},
    exterior_rear: {width: wp('60%')},
    front_left_corner: {width: wp('80%')},
    front_right_corner: {width: wp('80%')},
    rear_left_corner: {width: wp('80%')},
    rear_right_corner: {width: wp('80%')},
  },
};

export const switchFrameIcon = {
  portrait: Landscape,
  landscape: Portrait,
};
export const switchOrientation = {
  portrait: 'landscape',
  landscape: 'portrait',
};

const vehichle_Categories = {
  carVerificiationItems: {
    license_plate_number: 'license_plate_number',
    odometer: 'odometer',
  },
  interiorItems: {
    interior_passenger_side: 'interior_passenger_side',
    interior_driver_side: 'interior_driver_side',
  },
  exteriorItems: {
    exterior_front: 'exterior_front',
    exterior_rear: 'exterior_rear',
    front_left_corner: 'front_left_corner',
    front_right_corner: 'front_right_corner',
    rear_left_corner: 'rear_left_corner',
    rear_right_corner: 'rear_right_corner',
    inside_cargo_roof: 'inside_cargo_roof',
  },
  tires: {
    left_front_tire: 'left_front_tire',
    left_rear_tire: 'left_rear_tire',
    right_front_tire: 'right_front_tire',
    right_rear_tire: 'right_rear_tire',
  },
};

export function checkAndCompleteUrl(url, paramsToCheck = []) {
  const domainsToCheck = [
    'chex-dsp-files.s3.amazonaws.com/',
    'chex-dsp.s3.amazonaws.com',
    'chex-ai-uploads.s3.amazonaws.com',
  ];
  const defaultDomains = {
    dsp: 'https://chex-dsp.s3.amazonaws.com',
    uploads: 'https://chex-ai-uploads.s3.amazonaws.com',
    'dsp-files': 'https://chex-dsp-files.s3.amazonaws.com',
  };

  const result = {
    completedUrl: url,
    isValidUrl: true,
    parameters: {},
    domainMatch: false,
    errors: [],
  };

  // Handle edge case: Empty or null URL
  if (!url || typeof url !== 'string') {
    result.isValidUrl = false;
    result.errors.push('Invalid URL: URL is empty or not a string.');
    return result;
  }

  // Check if the URL is already complete
  if (!url.startsWith('http')) {
    // Determine the correct default domain based on the path prefix
    const pathPrefix = url.split('/')[0];
    let baseDomain = defaultDomains[pathPrefix] || defaultDomains.uploads;

    // Construct the complete URL
    url = `${baseDomain.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`; // Removes extra slashes
    result.completedUrl = url;
  }

  try {
    const urlObj = new URL(url);

    // Check for specified parameters in the URL if paramsToCheck is not empty
    if (paramsToCheck.length > 0) {
      paramsToCheck.forEach(param => {
        result.parameters[param] = urlObj.searchParams.has(param);
      });
    }

    // Check if the URL's domain matches any specified domains
    result.domainMatch = domainsToCheck.some(domain =>
      urlObj.hostname.includes(domain),
    );
  } catch (error) {
    // Handle invalid URL format
    result.isValidUrl = false;
    result.errors.push('Invalid URL format.');
  }

  return result;
}

/**
 * Extracts the MIME type of image based on its file path.
 * If no extension is found, defaults to 'jpeg'.
 *
 * @returns {string} The MIME type, defaulting to 'image/jpeg'.
 * @param path
 */
export const getFileMimeType = path => {
  if (!path) {
    console.warn('Invalid file path passed to getImageMimeType.');
    return 'image/jpeg';
  }

  const extension = path.split('.').pop() || 'jpeg';
  return `image/${extension}`;
};
export function insertMileage(str) {
  if (isNotEmpty(str.trim())) {
    if (str.includes('mi')) {
      return str;
    } else {
      return str + 'mi';
    }
  }
}

/**
 * Removes all alphabetic characters and retains only numbers and decimals from a string.
 *
 * @param {string|null|undefined} input - The string from which to remove alphabetic characters. Can be null or undefined.
 * @returns {string} - The cleaned string containing only numeric characters and a single decimal point (if applicable).
 * @throws {TypeError} - Throws an error if the input is not a string, null, or undefined.
 */
export function removeAlphabets(input) {
  // Check for invalid input types (null, undefined, or non-string)
  if (input === null || input === undefined) {
    return '';
  }

  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  // Remove all non-numeric and non-decimal characters
  let cleanedInput = input.replace(/[^0-9.]/g, '');

  // Ensure only one decimal point is present in the result
  const decimalCount = (cleanedInput.match(/\./g) || []).length;
  if (decimalCount > 1) {
    // If more than one decimal, remove the extra decimals (keeping the first one)
    cleanedInput = cleanedInput.replace(/\.(?=.*\.)/g, '');
  }

  // Return the cleaned input, ensuring it's not empty
  return cleanedInput || '0';
}

/**
 * Calculates the new dimensions for an image to fit within a specified container size,
 * preserving the aspect ratio of the original image.
 *
 * @param {number} imageWidth - The original width of the image.
 * @param {number} image_Height - The original height of the image.
 * @param {number} [maxWidth=800] - The maximum allowable width of the image in the container.
 * @param {number} [maxHeight=480] - The maximum allowable height of the image in the container.
 *
 * @returns {Object} The new dimensions for the image.
 * @returns {number} return.width - The calculated width of the image, adjusted for aspect ratio.
 * @returns {number} return.height - The calculated height of the image, adjusted for aspect ratio.
 *
 * @example
 * const newDimensions = calculateImageDimensions(1200, 600, 800, 480);
 * console.log(newDimensions); // { width: 800, height: 400 }
 */
const calculateImageDimensions = (
  imageWidth,
  image_Height,
  maxWidth = 800,
  maxHeight = 480,
) => {
  const containerAspectRatio = maxWidth / maxHeight;
  const imageAspectRatio = imageWidth / image_Height;

  let newWidth, newHeight;

  if (imageAspectRatio > containerAspectRatio) {
    // Image is wider than container ratio
    newWidth = maxWidth;
    newHeight = maxWidth / imageAspectRatio;
  } else {
    // Image is taller than container ratio
    newHeight = maxHeight;
    newWidth = maxHeight * imageAspectRatio;
  }

  return {width: newWidth, height: newHeight};
};

/**
 * Get user-friendly error message based on error code
 * @param {string} code - Error code from CameraError
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = code => {
  const errorMessages = {
    // Permission Errors
    'permission/camera-permission-denied':
      'Camera permission is required to use this feature.',
    'permission/microphone-permission-denied':
      'Microphone permission is required for video recording.',

    // Device Errors
    'device/configuration-error': 'There was an error configuring the camera.',
    'device/no-device': 'No camera device was found on your device.',
    'device/invalid-device': 'The selected camera device is invalid.',
    'device/microphone-unavailable': 'The microphone is currently unavailable.',
    'device/camera-not-available-on-simulator':
      'Camera is not available in the simulator.',

    // Session Errors
    'session/camera-not-ready': 'The camera is not ready. Please try again.',
    'session/camera-cannot-be-opened':
      'Unable to access the camera at this time.',
    'session/camera-has-been-disconnected': 'The camera has been disconnected.',
    'session/audio-in-use-by-other-app':
      'Another app is currently using the audio. Please close other apps and try again.',

    // Capture Errors
    'capture/recording-in-progress': 'A recording is already in progress.',
    'capture/no-recording-in-progress':
      'No recording is currently in progress.',
    'capture/file-io-error': 'Error saving the captured media.',
    'capture/video-not-enabled': 'Video capture is not enabled.',
    'capture/photo-not-enabled': 'Photo capture is not enabled.',
    'capture/aborted': 'The capture was cancelled.',

    // System Errors
    'system/camera-module-not-found': 'Camera module not found on your device.',
    'system/view-not-found': 'Camera view could not be initialized.',
  };

  return (
    errorMessages[code] || 'An unexpected error occurred. Please try again.'
  );
};

/**
 * Calculates the new position of an inner box relative to a resizing outer box.
 *
 * @param {number} outerWidth The current width of the outer box.
 * @param {number} outerHeight The current height of the outer box.
 * @param {number} initialWidth The initial width of the outer box.
 * @param {number} initialHeight The initial height of the outer box.
 * @param {number} initialX The initial x-coordinate of the inner box.
 * @param {number} initialY The initial y-coordinate of the inner box.
 * @returns {{x: number, y: number}} An object containing the new x and y coordinates of the inner box.
 */
export function resizeInnerBox(
  outerWidth,
  outerHeight,
  initialWidth,
  initialHeight,
  initialX,
  initialY,
) {
  const {width, height} = calculateImageDimensions(outerWidth, outerHeight);
  const xPercent = (initialX / initialWidth) * 100;
  const yPercent = (initialY / initialHeight) * 100;

  const newX = (xPercent / 100) * width;
  const newY = (yPercent / 100) * height;

  return {x: newX, y: newY};
}
export const ALIGNMENT_PHASES = [
  {
    id: 'STARTING',
    title: 'Starting',
    description: 'Resetting internal states and preparing to start',
    instructions: [
      'Ensure the Safety Tag is firmly mounted in the vehicle',
      'Make sure the device cannot move around',
      'Keep GPS and Bluetooth enabled on your phone',
    ],
  },
  {
    id: 'Z_AXIS_ALIGNMENT',
    title: 'Z-Axis Alignment (Vertical)',
    description: 'Aligning vertical axis (Z-axis) of Safety Tag to vehicle',
    instructions: [
      'Keep the vehicle stationary or under 2 km/h',
      'This process will continue running throughout the alignment',
      'Wait for initial calculations to complete',
    ],
  },
  {
    id: 'X_AXIS_NOT_STARTED',
    title: 'X-Axis Alignment Not Started',
    description: 'Waiting for X-axis alignment to begin',
    instructions: [
      'Drive the vehicle normally',
      'Maintain speed between 10-80 km/h',
      'Drive in a straight line when possible',
      'Accelerate or brake gently when safe',
    ],
  },
  {
    id: 'FINDING_X_AXIS_ANGLE',
    title: 'X-Axis Alignment (Horizontal)',
    description: 'Finding X and Y axes alignment while driving',
    instructions: [
      'Drive the vehicle normally',
      'Maintain speed between 10-80 km/h',
      'Drive in a straight line when possible',
      'Accelerate or brake gently when safe',
    ],
  },
  {
    id: 'ANGLE_DIRECTION_VALIDATION',
    title: 'Direction Validation',
    description: 'Validating the calculated angles',
    instructions: [
      'Continue driving normally',
      'The system is verifying the alignment accuracy',
      'Z-axis alignment continues in parallel',
    ],
  },
  {
    id: 'SENDING_ALIGNMENT_DATA_TO_ST',
    title: 'Saving Alignment',
    description: 'Storing alignment data in Safety Tag',
    instructions: [
      'Keep the vehicle running',
      'Maintain Bluetooth connection',
      'Wait for confirmation (may retry up to 3 times)',
    ],
  },
  {
    id: 'PROCESS_COMPLETED',
    title: 'Completed',
    description: 'Alignment process completed successfully',
    instructions: [
      'Alignment data stored successfully',
      'Crash detection is now enabled',
      'You can continue driving normally',
    ],
  },
];

export const crashReport = {
  crashData: {
    eventId: 12345,
    bufferId: 67890,
    startTimestampUnixMs: 1617187200000,
    startElapsedRealtimeMs: 1000000,
    endTimestampUnixMs: 1617187500000,
    endElapsedRealtimeMs: 2000000,
    accelerometerValues: [
      {x: 0.1, y: 0.2, z: 0.3},
      {x: 0.4, y: 0.5, z: 0.6},
    ],
    matrixRotationU: [
      [1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0],
    ],
    matrixRotationR: [
      [0.5, 0.5, 0.0],
      [0.5, 0.5, 0.0],
      [0.0, 0.0, 1.0],
    ],
    phi: 45.0,
    theta: 90.0,
    validCrashEvent: true,
    hasCompleteData: false,
  },
  status: 'COMPLETE_DATA',
};

export const crashThresholdEvent = {
  timestampUnixMs: 1617187200000,
  timestampElapsedRealtimeMs: 1500000,
};

export const addDeviceEventListener = (eventName, callback) => {
  // Adding the event listener
  // Return listener so it can be removed later
  return DeviceEventEmitter.addListener(eventName, event => {
    try {
      callback(event);
    } catch (error) {
      console.error(`Error in event handler for ${eventName}:`, error);
    }
  });
};

export async function requestPermissions() {
  const bluetooth_connect = await request(BLUETOOTH_CONNECT);
  const bluetooth_scan = await request(BLUETOOTH_SCAN);
  const location = await request(ACCESS_FINE_LOCATION);

  const have_permissions =
    bluetooth_connect === GRANTED &&
    bluetooth_connect === GRANTED &&
    bluetooth_scan === GRANTED &&
    location === GRANTED;

  if (have_permissions) {
    return true;
  } else {
    throw new Error('Permissions denied');
  }
}

export const formatUnixTime = unixTime => {
  const date = new Date(unixTime);
  return date.toLocaleString();
};

export const formatRawData = (rawData = []) => {
  return rawData
    .split('\n')
    .filter(line => line.startsWith('Trip'))
    .map(tripStr => {
      const data = tripStr.match(/(\w+)=([^,)\s]+)/g).reduce((obj, pair) => {
        const [key, value] = pair.split('=');
        obj[key] = isNaN(value) ? value : Number(value); // Convert numbers
        return obj;
      }, {});
      const {startUnixTimeMs = 0, endUnixTimeMs = 0} = data || {};
      return {
        ...data,
        startUnixTime: formatUnixTime(startUnixTimeMs),
        endUnixTime: formatUnixTime(endUnixTimeMs),
      };
    });
};

export const checkPermissions = async () => {
  // Location Always
  const locationAlwaysPermission = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
  console.log('Location Always Permission:', locationAlwaysPermission);

  // Location When in Use
  const locationWhenInUsePermission = await check(
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  );
  console.log('Location When in Use Permission:', locationWhenInUsePermission);
};

export const requestLocationPermission = async () => {
  const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  if (result === RESULTS.GRANTED) {
    console.log('Location permission granted');
  } else {
    console.log('Location permission denied');
  }
};

export function devicesListOptimized(existingDevices = [], newDevice = {}) {
  const exists = existingDevices.some(
    device => device.properties.getTag === newDevice.properties.getTag,
  );
  if (!exists) {
    return [...existingDevices, newDevice];
  }
  return existingDevices;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const days = Math.floor(hours / 24);
  const hrs = hours % 24;

  if (totalSeconds < 60) {
    return `${totalSeconds} ${totalSeconds === 1 ? 's' : 's'}`;
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
  }

  if (hours < 24) {
    const hourLabel = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    const minLabel =
      mins > 0 ? ` and ${mins} ${mins === 1 ? 'min' : 'mins'}` : '';
    return hourLabel + minLabel;
  }

  // 1 day or more
  const dayLabel = `${days} ${days === 1 ? 'day' : 'days'}`;
  const hourLabel =
    hrs > 0 ? ` and ${hrs} ${hrs === 1 ? 'hour' : 'hours'}` : '';
  return dayLabel + hourLabel;
}

export function getElapsedTime(eventUnixTimeMs) {
  const currentUnixTime = Date.now(); // Get current Unix time (wall-clock time)
  const diffMs = currentUnixTime - eventUnixTimeMs; // Difference in ms
  return formatDuration(diffMs); // Convert that diff into a human-readable format
}
export function getElapsedTimeDiff(startUnixTimeMs, endUnixTimeMs) {
  const diffMs = endUnixTimeMs - startUnixTimeMs; // Difference in ms
  return formatDuration(diffMs); // Convert that diff into a human-readable format
}

export function format12HourTime(timestampUnixMs) {
  const date = new Date(timestampUnixMs);
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Converts speed from meters per second (m/s) to kilometers per hour (km/h).
 *
 * @param {number|null|undefined} speedInMetersPerSecond - Speed value in m/s.
 * @returns {number|null} - Speed in km/h, rounded to two decimal places, or null if input is invalid.
 */
export const convertSpeedToKmh = speedInMetersPerSecond => {
  if (
    typeof speedInMetersPerSecond !== 'number' ||
    isNaN(speedInMetersPerSecond) ||
    speedInMetersPerSecond < 0
  ) {
    // Invalid or missing speed value
    return null;
  }

  const speedKmh = speedInMetersPerSecond * 3.6;
  return parseFloat(speedKmh.toFixed(2));
};

/**
 * Returns the value if it's not null or undefined; otherwise returns the fallback.
 *
 * @template T
 * @param {T|null|undefined} value - The value to check.
 * @param {T} fallback - The fallback value to return if the input is null or undefined.
 * @returns {T}
 */
export const withDefault = (value, fallback) => {
  return value != null || value !== undefined ? value : fallback;
};

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/*('Trip(receiveNumber=1, startUnixTimeMs=1746186979756, startElapsedRealtimeMs=-114284845, endUnixTimeMs=1746187369756, endElapsedRealtimeMs=-113894845, connectedDuringTrip=true)\nTrip(receiveNumber=2, startUnixTimeMs=1746187753756, startElapsedRealtimeMs=-113510845, endUnixTimeMs=1746188143756, endElapsedRealtimeMs=-113120845, connectedDuringTrip=true)\nTrip(receiveNumber=3, startUnixTimeMs=1746195744756, startElapsedRealtimeMs=-105519845, endUnixTimeMs=1746196224756, endElapsedRealtimeMs=-105039845, connectedDuringTrip=false)\nTrip(receiveNumber=4, startUnixTimeMs=1746196391756, startElapsedRealtimeMs=-104872845, endUnixTimeMs=1746196781756, endElapsedRealtimeMs=-104482845, connectedDuringTrip=false)\nTrip(receiveNumber=5, startUnixTimeMs=1746427839756, startElapsedRealtimeMs=126575155, endUnixTimeMs=1746428439756, endElapsedRealtimeMs=127175155, connectedDuringTrip=true)\nTrip(receiveNumber=6, startUnixTimeMs=1746428536756, startElapsedRealtimeMs=127272155, endUnixTimeMs=1746428986756, endElapsedRealtimeMs=127722155, connectedDuringTrip=true)\nTrip(receiveNumber=7, startUnixTimeMs=1746436266756, startElapsedRealtimeMs=135002155, endUnixTimeMs=1746436626756, endElapsedRealtimeMs=135362155, connectedDuringTrip=true)\nTrip(receiveNumber=8, startUnixTimeMs=1746439142756, startElapsedRealtimeMs=137878155, endUnixTimeMs=1746439472756, endElapsedRealtimeMs=138208155, connectedDuringTrip=false)\nTrip(receiveNumber=9, startUnixTimeMs=1746443520756, startElapsedRealtimeMs=142256155, endUnixTimeMs=1746444030756, endElapsedRealtimeMs=142766155, connectedDuringTrip=true)\nTrip(receiveNumber=10, startUnixTimeMs=1746444413756, startElapsedRealtimeMs=143149155, endUnixTimeMs=1746444743756, endElapsedRealtimeMs=143479155, connectedDuringTrip=true)\nTrip(receiveNumber=11, startUnixTimeMs=1746445112756, startElapsedRealtimeMs=143848155, endUnixTimeMs=1746446582756, endElapsedRealtimeMs=145318155, connectedDuringTrip=true)\nTrip(receiveNumber=12, startUnixTimeMs=1746451209756, startElapsedRealtimeMs=149945155, endUnixTimeMs=1746451539756, endElapsedRealtimeMs=150275155, connectedDuringTrip=true)\nTrip(receiveNumber=13, startUnixTimeMs=1746451861756, startElapsedRealtimeMs=150597155, endUnixTimeMs=1746452221756, endElapsedRealtimeMs=150957155, connectedDuringTrip=true)\nTrip(receiveNumber=14, startUnixTimeMs=1746452424756, startElapsedRealtimeMs=151160155, endUnixTimeMs=1746453444756, endElapsedRealtimeMs=152180155, connectedDuringTrip=true)\nTrip(receiveNumber=15, startUnixTimeMs=1746454387756, startElapsedRealtimeMs=153123155, endUnixTimeMs=1746454747756, endElapsedRealtimeMs=153483155, connectedDuringTrip=true)\nTrip(receiveNumber=16, startUnixTimeMs=1746455114756, startElapsedRealtimeMs=153850155, endUnixTimeMs=1746456254756, endElapsedRealtimeMs=154990155, connectedDuringTrip=true)\nTrip(receiveNumber=17, startUnixTimeMs=1746457371756, startElapsedRealtimeMs=156107155, endUnixTimeMs=1746457911756, endElapsedRealtimeMs=156647155, connectedDuringTrip=false)\nTrip(receiveNumber=18, startUnixTimeMs=1746462325756, startElapsedRealtimeMs=161061155, endUnixTimeMs=1746462655756, endElapsedRealtimeMs=161391155, connectedDuringTrip=false)\nTrip(receiveNumber=19, startUnixTimeMs=1746506040756, startElapsedRealtimeMs=204776155, endUnixTimeMs=1746506400756, endElapsedRealtimeMs=205136155, connectedDuringTrip=false)\nTrip(receiveNumber=20, startUnixTimeMs=1746517182756, startElapsedRealtimeMs=215918155, endUnixTimeMs=1746517542756, endElapsedRealtimeMs=216278155, connectedDuringTrip=true)\nTrip(receiveNumber=21, startUnixTimeMs=1746518097756, startElapsedRealtimeMs=216833155, endUnixTimeMs=1746519627756, endElapsedRealtimeMs=218363155, connectedDuringTrip=true)\nTrip(receiveNumber=22, startUnixTimeMs=1746520014756, startElapsedRealtimeMs=218750155, endUnixTimeMs=1746520734756, endElapsedRealtimeMs=219470155, connectedDuringTrip=true)\nTrip(receiveNumber=23, startUnixTimeMs=1746522204756, startElapsedRealtimeMs=220940155, endUnixTimeMs=1746522564756, endElapsedRealtimeMs=221300155, connectedDuringTrip=true)\nTrip(receiveNumber=24, startUnixTimeMs=1746522968756, startElapsedRealtimeMs=221704155, endUnixTimeMs=1746523448756, endElapsedRealtimeMs=222184155, connectedDuringTrip=true)\nTrip(receiveNumber=25, startUnixTimeMs=1746524966756, startElapsedRealtimeMs=223702155, endUnixTimeMs=1746525326756, endElapsedRealtimeMs=224062155, connectedDuringTrip=true)\nTrip(receiveNumber=26, startUnixTimeMs=1746531661756, startElapsedRealtimeMs=230397155, endUnixTimeMs=1746532621756, endElapsedRealtimeMs=231357155, connectedDuringTrip=true)\nTrip(receiveNumber=27, startUnixTimeMs=1746534500756, startElapsedRealtimeMs=233236155, endUnixTimeMs=1746535250756, endElapsedRealtimeMs=233986155, connectedDuringTrip=true)\nTrip(receiveNumber=28, startUnixTimeMs=1746535416756, startElapsedRealtimeMs=234152155, endUnixTimeMs=1746536076756, endElapsedRealtimeMs=234812155, connectedDuringTrip=true)\nTrip(receiveNumber=29, startUnixTimeMs=1746536338756, startElapsedRealtimeMs=235074155, endUnixTimeMs=1746536728756, endElapsedRealtimeMs=235464155, connectedDuringTrip=true)\nTrip(receiveNumber=30, startUnixTimeMs=1746537482756, startElapsedRealtimeMs=236218155, endUnixTimeMs=1746538562756, endElapsedRealtimeMs=237298155, connectedDuringTrip=true)\nTrip(receiveNumber=31, startUnixTimeMs=1746542718756, startElapsedRealtimeMs=241454155, endUnixTimeMs=1746543588756, endElapsedRealtimeMs=242324155, connectedDuringTrip=false)\nTrip(receiveNumber=32, startUnixTimeMs=1746546484756, startElapsedRealtimeMs=245220155, endUnixTimeMs=1746546844756, endElapsedRealtimeMs=245580155, connectedDuringTrip=false)\nTrip(receiveNumber=33, startUnixTimeMs=1746548612756, startElapsedRealtimeMs=247348155, endUnixTimeMs=1746548972756, endElapsedRealtimeMs=247708155, connectedDuringTrip=false)\nTrip(receiveNumber=34, startUnixTimeMs=1746550706756, startElapsedRealtimeMs=249442155, endUnixTimeMs=1746551066756, endElapsedRealtimeMs=249802155, connectedDuringTrip=false)\nTrip(receiveNumber=35, startUnixTimeMs=1746595598756, startElapsedRealtimeMs=294334155, endUnixTimeMs=1746595958756, endElapsedRealtimeMs=294694155, connectedDuringTrip=false)\nTrip(receiveNumber=36, startUnixTimeMs=1746613214756, startElapsedRealtimeMs=311950155, endUnixTimeMs=1746613574756, endElapsedRealtimeMs=312310155, connectedDuringTrip=false)\nTrip(receiveNumber=37, startUnixTimeMs=1746622265756, startElapsedRealtimeMs=321001155, endUnixTimeMs=1746622865756, endElapsedRealtimeMs=321601155, connectedDuringTrip=false)\nTrip(receiveNumber=38, startUnixTimeMs=1746629459756, startElapsedRealtimeMs=328195155, endUnixTimeMs=1746630089756, endElapsedRealtimeMs=328825155, connectedDuringTrip=false)\nTrip(receiveNumber=39, startUnixTimeMs=1746689640756, startElapsedRealtimeMs=388376155, endUnixTimeMs=1746690000756, endElapsedRealtimeMs=388736155, connectedDuringTrip=true)\nTrip(receiveNumber=40, startUnixTimeMs=1746691188756, startElapsedRealtimeMs=389924155, endUnixTimeMs=1746692148756, endElapsedRealtimeMs=390884155, connectedDuringTrip=true)\nTrip(receiveNumber=41, startUnixTimeMs=1746694829756, startElapsedRealtimeMs=393565155, endUnixTimeMs=1746695309756, endElapsedRealtimeMs=394045155, connectedDuringTrip=true)\nTrip(receiveNumber=42, startUnixTimeMs=1746696157756, startElapsedRealtimeMs=394893155, endUnixTimeMs=1746696517756, endElapsedRealtimeMs=395253155, connectedDuringTrip=true)\nTrip(receiveNumber=43, startUnixTimeMs=1746696813756, startElapsedRealtimeMs=395549155, endUnixTimeMs=1746697173756, endElapsedRealtimeMs=395909155, connectedDuringTrip=true)\nTrip(receiveNumber=44, startUnixTimeMs=1746697949756, startElapsedRealtimeMs=396685155, endUnixTimeMs=1746698909756, endElapsedRealtimeMs=397645155, connectedDuringTrip=true)\nTrip(receiveNumber=45, startUnixTimeMs=1746703082756, startElapsedRealtimeMs=401818155, endUnixTimeMs=1746703682756, endElapsedRealtimeMs=402418155, connectedDuringTrip=true)\nTrip(receiveNumber=46, startUnixTimeMs=1746705234756, startElapsedRealtimeMs=403970155, endUnixTimeMs=1746706494756, endElapsedRealtimeMs=405230155, connectedDuringTrip=true)\nTrip(receiveNumber=47, startUnixTimeMs=1746716181756, startElapsedRealtimeMs=414917155, endUnixTimeMs=1746716541756, endElapsedRealtimeMs=415277155, connectedDuringTrip=true)\nTrip(receiveNumber=48, startUnixTimeMs=1746770936756, startElapsedRealtimeMs=469672155, endUnixTimeMs=1746771296756, endElapsedRealtimeMs=470032155, connectedDuringTrip=false)\nTrip(receiveNumber=49, startUnixTimeMs=1746773776756, startElapsedRealtimeMs=472512155, endUnixTimeMs=1746774346756, endElapsedRealtimeMs=473082155, connectedDuringTrip=true)\nTrip(receiveNumber=50, startUnixTimeMs=1746777104756, startElapsedRealtimeMs=475840155, endUnixTimeMs=1746777434756, endElapsedRealtimeMs=476170155, connectedDuringTrip=true)\n');*/
export const tripsData = [
  {
    receiveNumber: 1,
    startUnixTimeMs: 1746186979756,
    startElapsedRealtimeMs: -114284845,
    endUnixTimeMs: 1746187369756,
    endElapsedRealtimeMs: -113894845,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 2,
    startUnixTimeMs: 1746187753756,
    startElapsedRealtimeMs: -113510845,
    endUnixTimeMs: 1746188143756,
    endElapsedRealtimeMs: -113120845,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 3,
    startUnixTimeMs: 1746195744756,
    startElapsedRealtimeMs: -105519845,
    endUnixTimeMs: 1746196224756,
    endElapsedRealtimeMs: -105039845,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 4,
    startUnixTimeMs: 1746196391756,
    startElapsedRealtimeMs: -104872845,
    endUnixTimeMs: 1746196781756,
    endElapsedRealtimeMs: -104482845,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 5,
    startUnixTimeMs: 1746427839756,
    startElapsedRealtimeMs: 126575155,
    endUnixTimeMs: 1746428439756,
    endElapsedRealtimeMs: 127175155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 6,
    startUnixTimeMs: 1746428536756,
    startElapsedRealtimeMs: 127272155,
    endUnixTimeMs: 1746428986756,
    endElapsedRealtimeMs: 127722155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 7,
    startUnixTimeMs: 1746436266756,
    startElapsedRealtimeMs: 135002155,
    endUnixTimeMs: 1746436626756,
    endElapsedRealtimeMs: 135362155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 8,
    startUnixTimeMs: 1746439142756,
    startElapsedRealtimeMs: 137878155,
    endUnixTimeMs: 1746439472756,
    endElapsedRealtimeMs: 138208155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 9,
    startUnixTimeMs: 1746443520756,
    startElapsedRealtimeMs: 142256155,
    endUnixTimeMs: 1746444030756,
    endElapsedRealtimeMs: 142766155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 10,
    startUnixTimeMs: 1746444413756,
    startElapsedRealtimeMs: 143149155,
    endUnixTimeMs: 1746444743756,
    endElapsedRealtimeMs: 143479155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 11,
    startUnixTimeMs: 1746445112756,
    startElapsedRealtimeMs: 143848155,
    endUnixTimeMs: 1746446582756,
    endElapsedRealtimeMs: 145318155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 12,
    startUnixTimeMs: 1746451209756,
    startElapsedRealtimeMs: 149945155,
    endUnixTimeMs: 1746451539756,
    endElapsedRealtimeMs: 150275155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 13,
    startUnixTimeMs: 1746451861756,
    startElapsedRealtimeMs: 150597155,
    endUnixTimeMs: 1746452221756,
    endElapsedRealtimeMs: 150957155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 14,
    startUnixTimeMs: 1746452424756,
    startElapsedRealtimeMs: 151160155,
    endUnixTimeMs: 1746453444756,
    endElapsedRealtimeMs: 152180155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 15,
    startUnixTimeMs: 1746454387756,
    startElapsedRealtimeMs: 153123155,
    endUnixTimeMs: 1746454747756,
    endElapsedRealtimeMs: 153483155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 16,
    startUnixTimeMs: 1746455114756,
    startElapsedRealtimeMs: 153850155,
    endUnixTimeMs: 1746456254756,
    endElapsedRealtimeMs: 154990155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 17,
    startUnixTimeMs: 1746457371756,
    startElapsedRealtimeMs: 156107155,
    endUnixTimeMs: 1746457911756,
    endElapsedRealtimeMs: 156647155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 18,
    startUnixTimeMs: 1746462325756,
    startElapsedRealtimeMs: 161061155,
    endUnixTimeMs: 1746462655756,
    endElapsedRealtimeMs: 161391155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 19,
    startUnixTimeMs: 1746506040756,
    startElapsedRealtimeMs: 204776155,
    endUnixTimeMs: 1746506400756,
    endElapsedRealtimeMs: 205136155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 20,
    startUnixTimeMs: 1746517182756,
    startElapsedRealtimeMs: 215918155,
    endUnixTimeMs: 1746517542756,
    endElapsedRealtimeMs: 216278155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 21,
    startUnixTimeMs: 1746518097756,
    startElapsedRealtimeMs: 216833155,
    endUnixTimeMs: 1746519627756,
    endElapsedRealtimeMs: 218363155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 22,
    startUnixTimeMs: 1746520014756,
    startElapsedRealtimeMs: 218750155,
    endUnixTimeMs: 1746520734756,
    endElapsedRealtimeMs: 219470155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 23,
    startUnixTimeMs: 1746522204756,
    startElapsedRealtimeMs: 220940155,
    endUnixTimeMs: 1746522564756,
    endElapsedRealtimeMs: 221300155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 24,
    startUnixTimeMs: 1746522968756,
    startElapsedRealtimeMs: 221704155,
    endUnixTimeMs: 1746523448756,
    endElapsedRealtimeMs: 222184155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 25,
    startUnixTimeMs: 1746524966756,
    startElapsedRealtimeMs: 223702155,
    endUnixTimeMs: 1746525326756,
    endElapsedRealtimeMs: 224062155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 26,
    startUnixTimeMs: 1746531661756,
    startElapsedRealtimeMs: 230397155,
    endUnixTimeMs: 1746532621756,
    endElapsedRealtimeMs: 231357155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 27,
    startUnixTimeMs: 1746534500756,
    startElapsedRealtimeMs: 233236155,
    endUnixTimeMs: 1746535250756,
    endElapsedRealtimeMs: 233986155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 28,
    startUnixTimeMs: 1746535416756,
    startElapsedRealtimeMs: 234152155,
    endUnixTimeMs: 1746536076756,
    endElapsedRealtimeMs: 234812155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 29,
    startUnixTimeMs: 1746536338756,
    startElapsedRealtimeMs: 235074155,
    endUnixTimeMs: 1746536728756,
    endElapsedRealtimeMs: 235464155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 30,
    startUnixTimeMs: 1746537482756,
    startElapsedRealtimeMs: 236218155,
    endUnixTimeMs: 1746538562756,
    endElapsedRealtimeMs: 237298155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 31,
    startUnixTimeMs: 1746542718756,
    startElapsedRealtimeMs: 241454155,
    endUnixTimeMs: 1746543588756,
    endElapsedRealtimeMs: 242324155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 32,
    startUnixTimeMs: 1746546484756,
    startElapsedRealtimeMs: 245220155,
    endUnixTimeMs: 1746546844756,
    endElapsedRealtimeMs: 245580155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 33,
    startUnixTimeMs: 1746548612756,
    startElapsedRealtimeMs: 247348155,
    endUnixTimeMs: 1746548972756,
    endElapsedRealtimeMs: 247708155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 34,
    startUnixTimeMs: 1746550706756,
    startElapsedRealtimeMs: 249442155,
    endUnixTimeMs: 1746551066756,
    endElapsedRealtimeMs: 249802155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 35,
    startUnixTimeMs: 1746595598756,
    startElapsedRealtimeMs: 294334155,
    endUnixTimeMs: 1746595958756,
    endElapsedRealtimeMs: 294694155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 36,
    startUnixTimeMs: 1746613214756,
    startElapsedRealtimeMs: 311950155,
    endUnixTimeMs: 1746613574756,
    endElapsedRealtimeMs: 312310155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 37,
    startUnixTimeMs: 1746622265756,
    startElapsedRealtimeMs: 321001155,
    endUnixTimeMs: 1746622865756,
    endElapsedRealtimeMs: 321601155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 38,
    startUnixTimeMs: 1746629459756,
    startElapsedRealtimeMs: 328195155,
    endUnixTimeMs: 1746630089756,
    endElapsedRealtimeMs: 328825155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 39,
    startUnixTimeMs: 1746689640756,
    startElapsedRealtimeMs: 388376155,
    endUnixTimeMs: 1746690000756,
    endElapsedRealtimeMs: 388736155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 40,
    startUnixTimeMs: 1746691188756,
    startElapsedRealtimeMs: 389924155,
    endUnixTimeMs: 1746692148756,
    endElapsedRealtimeMs: 390884155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 41,
    startUnixTimeMs: 1746694829756,
    startElapsedRealtimeMs: 393565155,
    endUnixTimeMs: 1746695309756,
    endElapsedRealtimeMs: 394045155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 42,
    startUnixTimeMs: 1746696157756,
    startElapsedRealtimeMs: 394893155,
    endUnixTimeMs: 1746696517756,
    endElapsedRealtimeMs: 395253155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 43,
    startUnixTimeMs: 1746696813756,
    startElapsedRealtimeMs: 395549155,
    endUnixTimeMs: 1746697173756,
    endElapsedRealtimeMs: 395909155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 44,
    startUnixTimeMs: 1746697949756,
    startElapsedRealtimeMs: 396685155,
    endUnixTimeMs: 1746698909756,
    endElapsedRealtimeMs: 397645155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 45,
    startUnixTimeMs: 1746703082756,
    startElapsedRealtimeMs: 401818155,
    endUnixTimeMs: 1746703682756,
    endElapsedRealtimeMs: 402418155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 46,
    startUnixTimeMs: 1746705234756,
    startElapsedRealtimeMs: 403970155,
    endUnixTimeMs: 1746706494756,
    endElapsedRealtimeMs: 405230155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 47,
    startUnixTimeMs: 1746716181756,
    startElapsedRealtimeMs: 414917155,
    endUnixTimeMs: 1746716541756,
    endElapsedRealtimeMs: 415277155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 48,
    startUnixTimeMs: 1746770936756,
    startElapsedRealtimeMs: 469672155,
    endUnixTimeMs: 1746771296756,
    endElapsedRealtimeMs: 470032155,
    connectedDuringTrip: false,
  },
  {
    receiveNumber: 49,
    startUnixTimeMs: 1746773776756,
    startElapsedRealtimeMs: 472512155,
    endUnixTimeMs: 1746774346756,
    endElapsedRealtimeMs: 473082155,
    connectedDuringTrip: true,
  },
  {
    receiveNumber: 50,
    startUnixTimeMs: 1746777104756,
    startElapsedRealtimeMs: 475840155,
    endUnixTimeMs: 1746777434756,
    endElapsedRealtimeMs: 476170155,
    connectedDuringTrip: true,
  },
];

export function formatDate(
  timestamp,
  locale = 'en-US',
  options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
) {
  return new Date(timestamp).toLocaleDateString(locale, options);
}

const __ = {
  tripsList: [
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
    {
      commentInfo: undefined,
      connectedDuringTrip: true,
      endElapsedRealtimeMs: 493092965,
      endPosition: [Object],
      endUnixTimeMs: 1746794357555,
      receiveNumber: 1,
      startElapsedRealtimeMs: null,
      startPosition: undefined,
      startUnixTimeMs: null,
    },
  ],
};
export const formatTripsJSON = (tripsList = '') => {
  if (!isNotEmpty(tripsList)) {
    return;
  }
  return tripsList
    ?.trim()
    .split('\n')
    .map(line => {
      const match = line.match(
        /Trip\(receiveNumber=(\d+), startUnixTimeMs=(\d+), startElapsedRealtimeMs=(-?\d+), endUnixTimeMs=(\d+), endElapsedRealtimeMs=(-?\d+), connectedDuringTrip=(true|false)\)/,
      );
      if (match) {
        return {
          receiveNumber: parseInt(match[1]),
          startUnixTimeMs: parseInt(match[2]),
          startElapsedRealtimeMs: parseInt(match[3]),
          endUnixTimeMs: parseInt(match[4]),
          endElapsedRealtimeMs: parseInt(match[5]),
          connectedDuringTrip: match[6] === 'true',
          commentInfo: {
            comment: '',
            time: null,
          },
          position: {
            coords: {
              speed: null,
              heading: null,
              longitude: null,
              latitude: null,
            },
          },
        };
      }
      return null;
    })
    .filter(Boolean);
};

export const reverseGeocode = async (
  latitude,
  longitude,
  geoNamesUsername = 'shahroz_chex',
) => {
  const url = `http://api.geonames.org/reverseJSON?lat=${latitude}&lng=${longitude}&username=${geoNamesUsername}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.address) {
      const {countryName, city, state} = response.data.address;
      console.log('I have response of geo names api', response?.data?.address);
    } else {
      console.log('Address not found');
    }
  } catch (error) {
    console.warn('Error with GeoNames API:', error);
    throw error;
  } finally {
  }
};

export function formatUnixTimestampIntoDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
}
