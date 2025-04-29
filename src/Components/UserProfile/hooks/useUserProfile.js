import {useAuthState} from '../../../hooks';

const useUserProfile = () => {
  const {
    user: {username, email},
  } = useAuthState();

  return {username, email};
};

export default useUserProfile;
