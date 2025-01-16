import {createNavigationContainerRef} from '@react-navigation/native';

/**
 * Primary navigation reference for the app
 * @type {import('@react-navigation/native').NavigationContainerRef}
 */
export const navigationRef = createNavigationContainerRef();

/**
 * Secondary navigation reference used for saga operations
 * @type {import('@react-navigation/native').NavigationContainerRef}
 * @private
 */
let navigationRefCopy;

/**
 * Navigates to a specified screen if navigation is ready
 * @param {string} name - The name of the screen to navigate to
 * @param {Object} [params] - Parameters to pass to the screen
 * @throws {Error} If navigation is not ready
 * @example
 * navigate('Home', { userId: 123 });
 */
export function navigate(name, params) {
  if (!name) {
    console.warn('Navigation attempted without a screen name');
    return;
  }

  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn('Navigation attempted before navigation container was ready');
  }
}

/**
 * Resets the navigation stack to a single screen
 * @param {string} name - The name of the screen to reset to
 * @throws {Error} If navigation is not ready
 * @example
 * resetNavigation('Login');
 */
export function resetNavigation(name) {
  if (!name) {
    console.warn('Reset attempted without a screen name');
    return;
  }

  if (navigationIsReady()) {
    navigationRefCopy.reset({
      index: 0,
      routes: [{name}],
    });
  } else {
    console.warn('Reset attempted before navigation container was ready');
  }
}

/**
 * Sets the navigation reference copy for saga operations
 * @param {import('@react-navigation/native').NavigationContainerRef | null} navRef - The navigation reference to set
 */
export function setNavigationRef(navRef = null) {
  if (navRef?.isReady || navRef === null) {
    navigationRefCopy = navRef;
  } else {
    console.warn('Attempted to set invalid navigation reference');
  }
}

/**
 * Checks if the navigation container is ready for saga operations
 * @returns {boolean} True if navigation is ready
 */
export function navigationIsReady() {
  return Boolean(navigationRefCopy?.isReady());
}

/**
 * Gets the current route name
 * @returns {string|null} The current route name or null if navigation is not ready
 */
export function getCurrentRoute() {
  if (!navigationRef.isReady()) {
    return null;
  }
  return navigationRef.getCurrentRoute()?.name ?? null;
}

/**
 * Goes back to the previous screen if possible
 * @returns {boolean} True if navigation went back successfully
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
    return true;
  }
  return false;
}
