import {useSelector} from 'react-redux';

/**
 * Custom hook to select UI-related state from the Redux store.
 *
 * Provides access to the global loading flag and current toast configuration.
 *
 * @returns {{
 *   isLoading: boolean,
 *   toast: {
 *     visible: boolean,
 *     message: string,
 *     type: string
 *   }
 * }}
 */
const useUIState = () => {
  const {loading: isLoading, toast} = useSelector(state => state.ui);

  return {isLoading, toast};
};

export default useUIState;
