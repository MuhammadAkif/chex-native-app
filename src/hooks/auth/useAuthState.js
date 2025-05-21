import {useSelector} from 'react-redux';

/**
 * Custom hook to access authentication-related state from the Redux store.
 *
 * This hook provides access to key auth-related pieces of state, such as
 * - **Session Expiration**: Tracks whether the user’s session has expired, often useful to trigger re-authentication flows.
 * - **Auth Token**: The token used for making authenticated API requests.
 * - **User Object**: Contains user profile or identity data, typically fetched during sign-in.
 *
 * Business Rule:
 * - The `sessionExpire` state is generally set to `true` if the user has logged out,
 * the session has expired, or they were forcibly logged out from another device.
 *
 * @returns {{
 *   isSessionExpired: boolean,  // Indicates if the user's session has expired
 *   token: string|null,         // Auth token used for authenticated API calls (null if no token)
 *   user: any                   // User object containing profile or identity data (can be null or empty if not authenticated)
 * }}
 *
 * Example usage:
 *
 * const { isSessionExpired, token, user } = useAuthState();
 * if (isSessionExpired) {
 *   // Handle session expired logic, e.g., redirect to login page
 * }
 */
const useAuthState = () => {
  const {
    sessionExpire: isSessionExpired, // Determines whether the session has expired
    user: {token, data: user, vehicles}, // Destructures user data and token from the auth state
  } = useSelector(state => state.auth);

  return {isSessionExpired, token, user, vehicles};
};

export default useAuthState;
