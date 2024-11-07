import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
export let navigationRefCopy;

/**
 *
 * @param name
 * @param params
 */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

/**
 *
 * @param name
 */
export function resetNavigation(name) {
  if (navigationIsReady()) {
    navigationRefCopy.reset({
      index: 0,
      routes: [{name}],
    });
  }
}

/**
 *
 * @param navRef
 */
export function setNavigationRef(navRef = null) {
  navigationRefCopy = navRef;
}

/**
 *
 * @returns {*}
 */
export function navigationIsReady() {
  return navigationRefCopy?.isReady(); // returns true when called in a redux saga file.
}
