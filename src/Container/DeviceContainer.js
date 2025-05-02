import React from 'react';
import {DeviceScreen} from '../Screens';
import {useSafetyTagInitializer} from '../hooks';

const DeviceContainer = () => {
  const {getConnectedDeviceInfo} = useSafetyTagInitializer();
  return <DeviceScreen handleDisconnect={getConnectedDeviceInfo} />;
};
export default DeviceContainer;
