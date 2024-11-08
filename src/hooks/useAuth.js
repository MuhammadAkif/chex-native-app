import {useSelector} from 'react-redux';

/**
 *
 * @returns {{isSessionExpired: boolean, user: any, token: any}}
 */
const useAuth = () => {
  const {
    sessionExpire: isSessionExpired,
    user: {token, data: user},
  } = useSelector(state => state.auth);

  return {isSessionExpired, token, user};
};

export default useAuth;
