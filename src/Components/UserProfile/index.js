import React from 'react';
import {View} from 'react-native';

import {styles} from './styles';
import UserDetails from './Components/UserDetails/UserDetails';
import DeviceDetails from './Components/DeviceDetails/DeviceDetails';
import useUserProfile from './hooks/useUserProfile';

const UserProfile = () => {
  const {username, email, isConnected, deviceAddress} = useUserProfile();
  return (
    <View style={styles.container}>
      <UserDetails name={username} email={email} />
      <DeviceDetails isConnected={isConnected} name={deviceAddress} />
    </View>
  );
};

export default UserProfile;
