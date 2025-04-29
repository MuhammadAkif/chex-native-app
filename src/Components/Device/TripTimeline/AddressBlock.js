import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';

const {addressBlock, statusListTitle, address: addressStyle} = styles;

const AddressBlock = ({
  title = 'Downtown Office',
  address = '456 Business Ave',
  containerStyle = {},
}) => (
  <View style={[addressBlock, containerStyle]}>
    <Text style={statusListTitle}>{title}</Text>
    <Text style={addressStyle}>{address}</Text>
  </View>
);

export default AddressBlock;
