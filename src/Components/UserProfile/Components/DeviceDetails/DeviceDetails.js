import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './styles';
import ConnectionStatus from './ConnectionStatus';

const {container, text} = styles;

const DeviceDetails = ({name = 'N/A', isConnected = false}) => (
  <View style={container}>
    <Text style={text} numberOfLines={1} ellipsizeMode={'tail'}>
      Device Tag #{name}
    </Text>
    <ConnectionStatus isConnected={isConnected} />
  </View>
);

export default DeviceDetails;
