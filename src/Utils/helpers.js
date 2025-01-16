import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {isNotEmpty} from './index';
import {Landscape, Portrait} from '../Assets/Icons';

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

/**
 * Constants for inspection status
 * @constant {Object}
 */
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
  const DOMAINS = {
    dsp: 'https://chex-dsp.s3.amazonaws.com',
    uploads: 'https://chex-ai-uploads.s3.amazonaws.com',
    'dsp-files': 'https://chex-dsp-files.s3.amazonaws.com',
  };

  const DOMAINS_TO_CHECK = [
    'chex-dsp-files.s3.amazonaws.com/',
    'chex-dsp.s3.amazonaws.com',
    'chex-ai-uploads.s3.amazonaws.com',
  ];

  const result = {
    completedUrl: url,
    isValidUrl: true,
    parameters: {},
    domainMatch: false,
    errors: [],
  };

  if (!url || typeof url !== 'string') {
    result.isValidUrl = false;
    result.errors.push('Invalid URL: URL is empty or not a string.');
    return result;
  }

  if (!url.startsWith('http')) {
    const pathPrefix = url.split('/')[0];
    const baseDomain = DOMAINS[pathPrefix] || DOMAINS.uploads;
    url = `${baseDomain.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
    result.completedUrl = url;
  }

  try {
    const urlObj = new URL(url);
    if (paramsToCheck.length > 0) {
      paramsToCheck.forEach(param => {
        result.parameters[param] = urlObj.searchParams.has(param);
      });
    }
    result.domainMatch = DOMAINS_TO_CHECK.some(domain =>
      urlObj.hostname.includes(domain),
    );
  } catch (error) {
    result.isValidUrl = false;
    result.errors.push('Invalid URL format.');
  }

  return result;
}

/**
 * Appends 'mi' to a string if it doesn't already have it
 * @param {string} str - The string to process
 * @returns {string} The processed string with 'mi' appended if necessary
 */
export function insertMileage(str) {
  if (!isNotEmpty(str?.trim())) {
    return str;
  }
  return str.includes('mi') ? str : `${str}mi`;
}

/**
 * Gets the MIME type of a file based on its extension
 * @param {string} path - The file path
 * @returns {string} The MIME type
 */
export const getFileMimeType = path => {
  if (!path) {
    console.warn('Invalid file path passed to getImageMimeType.');
    return 'image/jpeg';
  }
  const extension = path.split('.').pop()?.toLowerCase() || 'jpeg';
  return `image/${extension}`;
};

/**
 * Removes all non-numeric characters except decimal point from a string
 * @param {string|null|undefined} input - The input string
 * @returns {string} The cleaned string containing only numbers and at most one decimal point
 * @throws {TypeError} If input is not a string, null, or undefined
 */
export function removeAlphabets(input) {
  if (input === null || input === undefined) {
    return '';
  }

  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const cleanedInput = input.replace(/[^0-9.]/g, '');
  return cleanedInput.replace(/\.(?=.*\.)/g, '') || '0';
}

/**
 * Calculates dimensions to fit an image within specified bounds while maintaining aspect ratio
 * @param {number} imageWidth - Original image width
 * @param {number} imageHeight - Original image height
 * @param {number} [maxWidth=800] - Maximum allowed width
 * @param {number} [maxHeight=480] - Maximum allowed height
 * @returns {{width: number, height: number}} New dimensions
 */
export const calculateImageDimensions = (
  imageWidth,
  imageHeight,
  maxWidth = 800,
  maxHeight = 480,
) => {
  const containerAspectRatio = maxWidth / maxHeight;
  const imageAspectRatio = imageWidth / imageHeight;

  if (imageAspectRatio > containerAspectRatio) {
    return {
      width: maxWidth,
      height: maxWidth / imageAspectRatio,
    };
  }

  return {
    width: maxHeight * imageAspectRatio,
    height: maxHeight,
  };
};

/**
 * Calculates new position of an inner box during outer box resize
 * @param {number} outerWidth - Current outer box width
 * @param {number} outerHeight - Current outer box height
 * @param {number} initialWidth - Initial outer box width
 * @param {number} initialHeight - Initial outer box height
 * @param {number} initialX - Initial inner box X position
 * @param {number} initialY - Initial inner box Y position
 * @returns {{x: number, y: number}} New position coordinates
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

  return {
    x: (xPercent / 100) * width,
    y: (yPercent / 100) * height,
  };
}
