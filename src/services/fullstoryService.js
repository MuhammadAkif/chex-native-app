/**
 * FullStory Service
 *
 * Handles FullStory initialization, user identification, and session management.
 *
 * IMPORTANT: FullStory is disabled in development mode to avoid Metro Server compatibility issues.
 * Only production builds will have FullStory active.
 *
 * Features:
 * - Automatic background/foreground handling
 * - Screen tracking support
 * - User identification and anonymization
 * - Custom event logging
 * - Privacy-compliant data capture
 */

import FullStory from '@fullstory/react-native';
import {AppState, Platform} from 'react-native';

// FullStory organization ID - configured natively (Android/iOS), not in JavaScript
// For reference only - actual org ID must be set in native configuration
// Get this from your FullStory dashboard: https://app.fullstory.com
const FULLSTORY_ORG_ID = process.env.FULLSTORY_ORG_ID || '';

// Enable FullStory only in production builds
// This avoids Metro Server compatibility issues during development
// NOTE: FullStory will still initialize natively, but JS-side features are disabled in dev
const IS_FULLSTORY_ENABLED = !__DEV__;

// Track AppState listener for cleanup
let appStateSubscription = null;

/**
 * Initialize FullStory
 * Should be called early in app lifecycle (e.g., in App.tsx)
 *
 * NOTE: FullStory React Native v1.8.0+ starts automatically when the app launches.
 * The organization ID must be configured natively (Android/iOS), not in JavaScript.
 *
 * Sets up FullStory with:
 * - AppState listener for background/foreground handling
 * - Android-specific restart workaround
 *
 * IMPORTANT: Configure FullStory org ID natively:
 * - Android: Set via FullStory Gradle plugin or AndroidManifest.xml meta-data
 * - iOS: Set via Info.plist or native code
 */
export const initializeFullStory = () => {
  if (!IS_FULLSTORY_ENABLED) {
    if (__DEV__) {
      console.log('[FullStory] Disabled in development mode');
    }
    return;
  }

  try {
    // FullStory starts automatically - no need to call start()
    // The org ID is configured natively (Android/iOS)
    console.log('[FullStory] Initialized (auto-starts on app launch)');

    // Set up AppState listener for background/foreground handling
    setupAppStateListener();

    // On Android, explicitly restart to ensure proper session recording
    // This addresses a known issue where Android sessions may lack interaction data
    if (Platform.OS === 'android') {
      setTimeout(() => {
        FullStory.restart();
        console.log('[FullStory] Android restart completed');
      }, 1000);
    }
  } catch (error) {
    console.error('[FullStory] Initialization error:', error);
  }
};

/**
 * Set up AppState listener to handle background/foreground transitions
 * FullStory automatically handles this, but explicit control provides better reliability
 */
const setupAppStateListener = () => {
  if (!IS_FULLSTORY_ENABLED) {
    return;
  }

  // Remove existing listener if present
  if (appStateSubscription) {
    appStateSubscription.remove();
  }

  // Add new listener
  appStateSubscription = AppState.addEventListener('change', nextAppState => {
    if (nextAppState === 'background') {
      // App went to background - FullStory automatically pauses, but we can explicitly shutdown if needed
      // Note: FullStory handles this automatically, but explicit shutdown can save resources
      // Uncomment if you want explicit control:
      // shutdownFullStory();
    } else if (nextAppState === 'active') {
      // App came to foreground - ensure FullStory is recording
      try {
        FullStory.restart();
        console.log('[FullStory] Resumed after foreground');
      } catch (error) {
        console.error('[FullStory] Error resuming:', error);
      }
    }
  });
};

/**
 * Cleanup AppState listener
 * Call this when app unmounts or FullStory is disabled
 */
export const cleanupFullStory = () => {
  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
};

/**
 * Identify a user in FullStory
 * Call this after successful user authentication
 *
 * @param {string} userId - Unique user identifier
 * @param {Object} userVars - User metadata (displayName, email, etc.)
 * @param {string} userVars.displayName - User's display name
 * @param {string} userVars.email - User's email address
 * @param {Object} userVars.customVars - Additional custom user properties
 */
export const identifyUser = (userId, userVars = {}) => {
  if (!IS_FULLSTORY_ENABLED) {
    return;
  }

  try {
    const {displayName, email, ...customVars} = userVars;

    FullStory.identify(userId, {
      displayName: displayName || userId,
      email: email,
      ...customVars,
    });

    console.log('[FullStory] User identified:', userId);
  } catch (error) {
    console.error('[FullStory] Identify error:', error);
  }
};

/**
 * Anonymize the current user
 * Call this when user logs out or session expires
 */
export const anonymizeUser = () => {
  if (!IS_FULLSTORY_ENABLED) {
    return;
  }

  try {
    FullStory.anonymize();
    console.log('[FullStory] User anonymized');
  } catch (error) {
    console.error('[FullStory] Anonymize error:', error);
  }
};

/**
 * Log a custom event to FullStory
 *
 * @param {string} eventName - Name of the event
 * @param {Object} properties - Event properties
 */
export const logEvent = (eventName, properties = {}) => {
  if (!IS_FULLSTORY_ENABLED) {
    return;
  }

  try {
    FullStory.event(eventName, properties);
  } catch (error) {
    console.error('[FullStory] Event logging error:', error);
  }
};

/**
 * Set user variables (update user metadata)
 *
 * @param {Object} userVars - User metadata to update
 */
export const setUserVars = (userVars = {}) => {
  if (!IS_FULLSTORY_ENABLED) {
    return;
  }

  try {
    FullStory.setUserVars(userVars);
  } catch (error) {
    console.error('[FullStory] Set user vars error:', error);
  }
};

/**
 * Shutdown FullStory (stop recording)
 * Use when app goes to background if needed
 */
export const shutdownFullStory = () => {
  if (!IS_FULLSTORY_ENABLED) {
    return;
  }

  try {
    FullStory.shutdown();
  } catch (error) {
    console.error('[FullStory] Shutdown error:', error);
  }
};

/**
 * Restart FullStory (resume recording)
 * Use when app returns to foreground if needed
 */
export const restartFullStory = () => {
  if (!IS_FULLSTORY_ENABLED) {
    return;
  }

  try {
    FullStory.restart();
  } catch (error) {
    console.error('[FullStory] Restart error:', error);
  }
};

/**
 * Check if FullStory is enabled
 * Useful for conditional rendering or feature flags
 */
export const isFullStoryEnabled = () => {
  return IS_FULLSTORY_ENABLED;
};

/**
 * Track a screen view in FullStory
 * Call this when navigating to a new screen
 *
 * @param {string} screenName - Name of the screen being viewed
 * @param {Object} properties - Additional screen properties
 */
export const trackScreenView = (screenName, properties = {}) => {
  if (!IS_FULLSTORY_ENABLED) {
    return;
  }

  try {
    // Log screen view as a custom event
    FullStory.event('Screen View', {
      screenName,
      ...properties,
    });
    console.log('[FullStory] Screen viewed:', screenName);
  } catch (error) {
    console.error('[FullStory] Screen tracking error:', error);
  }
};

/**
 * Get the current FullStory session URL
 * Useful for debugging or sharing session links
 *
 * @returns {Promise<string|null>} Session URL or null if not available
 */
export const getCurrentSessionURL = async () => {
  if (!IS_FULLSTORY_ENABLED) {
    return null;
  }

  try {
    const url = await FullStory.getCurrentSessionURL();
    return url;
  } catch (error) {
    console.error('[FullStory] Error getting session URL:', error);
    return null;
  }
};

/**
 * Get the current FullStory session ID
 * Useful for debugging or correlating with other systems
 *
 * @returns {Promise<string|null>} Session ID or null if not available
 */
export const getCurrentSession = async () => {
  if (!IS_FULLSTORY_ENABLED) {
    return null;
  }

  try {
    const sessionId = await FullStory.getCurrentSession();
    return sessionId;
  } catch (error) {
    console.error('[FullStory] Error getting session ID:', error);
    return null;
  }
};
