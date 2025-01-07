import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {isNotEmpty} from './index';
import {Landscape, Portrait} from '../Assets/Icons';

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
    'chex-dsp.s3.amazonaws.com',
    'chex-ai-uploads.s3.amazonaws.com',
  ];
  const defaultDomains = {
    dsp: 'https://chex-dsp.s3.amazonaws.com',
    uploads: 'https://chex-ai-uploads.s3.amazonaws.com',
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
