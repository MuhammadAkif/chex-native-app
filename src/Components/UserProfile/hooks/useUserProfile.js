import {useAuthState} from '../../../hooks';
import {useDeviceState} from '../../../hooks/device';

const useUserProfile = () => {
  const {
    user: {username, email},
  } = useAuthState();
  const {isConnected, deviceAddress} = useDeviceState();

  return {
    username,
    email,
    isConnected,
    deviceAddress,
  };
};

export default useUserProfile;
