import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {
  sessionExpired,
  signIn,
  signOut,
  setVehiclesList as setUserVehiclesList,
} from '../../Store/Actions';

/**
 * Custom hook to provide authentication-related action dispatchers.
 *
 * This hook encapsulates Redux auth actions inside memoized functions,
 * so components can call them directly without handling `dispatch` themselves.
 *
 * Business Rule Note:
 * - `login` should return a Promise to allow UI to handle async states (e.g., spinners, errors).
 *
 * @returns {{
 *   login: (username: string, password: string) => Promise<void>,
 *   logout: () => void,
 *   expireSession: () => void
 * }}
 */
const useAuthActions = () => {
  const dispatch = useDispatch();

  /**
   * Logs the user in by dispatching the signIn Redux thunk.
   *
   * TODO: Consider capturing API errors in a central error handler.
   *
   * @param {string} username - User's login identifier.
   * @param {string} password - User's password.
   * @returns {Promise<any>} - Resolves when login is successful, rejects on error.
   */
  const login = useCallback(
    async (username, password) => {
      return dispatch(signIn(username, password));
    },
    [dispatch],
  );

  /**
   * Logs the user out by dispatching the signOut action.
   *
   * Side Effect: Clears auth token and resets auth state.
   */
  const logout = useCallback(() => {
    dispatch(signOut());
  }, [dispatch]);

  /**
   * Handles session expiration.
   *
   * Business Rule:
   * - This should be triggered by token expiry or a 401 response.
   */
  const expireSession = useCallback(() => {
    dispatch(sessionExpired());
  }, [dispatch]);

  const setVehiclesList = useCallback(
    (vehicles = []) => {
      dispatch(setUserVehiclesList(vehicles));
    },
    [dispatch],
  );

  return {
    login,
    logout,
    setVehiclesList,
    expireSession,
  };
};

export default useAuthActions;
