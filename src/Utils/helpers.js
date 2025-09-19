import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {isNotEmpty} from './index';
import {Landscape, Portrait} from '../Assets/Icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

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
  const domainsToCheck = ['chex-dsp-files.s3.amazonaws.com/', 'chex-dsp.s3.amazonaws.com', 'chex-ai-uploads.s3.amazonaws.com'];
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
    result.domainMatch = domainsToCheck.some(domain => urlObj.hostname.includes(domain));
  } catch (error) {
    // Handle invalid URL format
    result.isValidUrl = false;
    result.errors.push('Invalid URL format.');
  }

  return result;
}

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

  // Return the cleaned input, ensuring it’s not empty
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
const calculateImageDimensions = (imageWidth, image_Height, maxWidth = 800, maxHeight = 480) => {
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
export function resizeInnerBox(outerWidth, outerHeight, initialWidth, initialHeight, initialX, initialY) {
  const {width, height} = calculateImageDimensions(outerWidth, outerHeight);
  const xPercent = (initialX / initialWidth) * 100;
  const yPercent = (initialY / initialHeight) * 100;

  const newX = (xPercent / 100) * width;
  const newY = (yPercent / 100) * height;

  return {x: newX, y: newY};
}

export const getUserFullName = (first, last) => {
  if (!first || !last) return 'there';
  return `${first} ${last}`;
};

export function navigateBackWithParams(navigation, route, extraParams = {}) {
  if (!route?.params?.returnTo) {
    return navigation.goBack();
  }

  const targetScreen = route.params.returnTo;
  const parentOfTargetScreen = route.params.parentOfTargetScreen;
  const returnToParams = route.params.returnToParams || {};

  // merge captured params + caller-provided extras
  const navParams = {
    ...returnToParams.params,
    ...extraParams,
  };

  // Use navigate with merge:true to update existing nested screen
  navigation.popTo(parentOfTargetScreen, {
    screen: targetScreen,
    params: navParams,
  });
}
