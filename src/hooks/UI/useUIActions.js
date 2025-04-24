import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {hideToast, setLoading, showToast} from '../../Store/Actions';

/**
 * Custom hook to dispatch UI-related actions without needing to import `dispatch` directly.
 *
 * This hook provides memoized callbacks for toggling the global loading
 * indicator and controlling toast notifications.
 *
 * @returns {{
 *   toggleLoading: (isLoading: boolean) => void,
 *   toastSuccess: (message: string) => void,
 *   toastError: (message: string) => void,
 *   toastInfo: (message: string) => void,
 *   clearToast: () => void
 * }}
 */
const useUIActions = () => {
  const dispatch = useDispatch();

  /**
   * Show or hide the global loading spinner.
   * @param {boolean} isLoading - true to show, false to hide.
   */
  const toggleLoading = useCallback(
    isLoading => {
      dispatch(setLoading(isLoading));
    },
    [dispatch],
  );

  /**
   * Display a success toast with a green-themed UI.
   * @param {string} message - Text to display in the toast.
   */
  const toastSuccess = useCallback(
    message => {
      dispatch(showToast(message, 'success'));
    },
    [dispatch],
  );

  /**
   * Display an error toast with a red-themed UI.
   * @param {string} message - Text to display in the toast.
   */
  const toastError = useCallback(
    message => {
      dispatch(showToast(message, 'error'));
    },
    [dispatch],
  );

  /**
   * Display an informational toast with a neutral-themed UI.
   * @param {string} message - Text to display in the toast.
   */
  const toastInfo = useCallback(
    message => {
      dispatch(showToast(message, 'info'));
    },
    [dispatch],
  );

  /**
   * Hide any currently visible toast.
   */
  const clearToast = useCallback(() => {
    dispatch(hideToast());
  }, [dispatch]);

  return {toggleLoading, toastSuccess, toastError, toastInfo, clearToast};
};

export default useUIActions;
