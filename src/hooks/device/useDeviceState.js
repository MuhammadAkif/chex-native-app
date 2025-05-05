import {useSelector} from 'react-redux';

/**
 * Custom hook to access the connected Bluetooth device state.
 *
 * @returns {object} Device state including:
 *  - name
 *  - advertisementMode
 *  - isBonded
 *  - rssi
 *  - batteryHealth
 *  - deviceAddress
 *  - isConnected
 */
const useDeviceState = () => {
  return useSelector(state => state.device);
};

export default useDeviceState;
