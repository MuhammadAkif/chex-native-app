import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './styles';
import ConnectionStatus from './ConnectionStatus';

const {container, text} = styles;

const DeviceDetails = ({name = '#12345'}) => (
  <View style={container}>
    <Text style={text} numberOfLines={1} ellipsizeMode={'tail'}>
      Device Tag {name}
    </Text>
    <ConnectionStatus />
  </View>
);

export default DeviceDetails;
