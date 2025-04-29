import React from 'react';
import {View} from 'react-native';

import styles from './styles';
import {colors} from '../../../Assets/Styles';
import AddressBlock from './AddressBlock';

const {red, brightGreen} = colors;
const {
  statusListContainer,
  statusContainer,
  dot,
  verticalLine,
  addressContainer,
  zeroMargin,
} = styles;

const AddressStatusList = ({
  primaryLocation = {title: 'Home', address: '456 Business Ave'},
  secondaryLocation = {title: 'Downtown Office', address: '789 Commerce Rd'},
}) => (
  <View style={statusListContainer}>
    <View style={statusContainer}>
      <View style={[dot, {backgroundColor: brightGreen}]} />
      <View style={verticalLine} />
      <View style={[dot, {backgroundColor: red}]} />
    </View>
    <View style={addressContainer}>
      <AddressBlock
        title={primaryLocation.title}
        address={primaryLocation.address}
      />
      <AddressBlock
        title={secondaryLocation.title}
        address={secondaryLocation.address}
        containerStyle={zeroMargin}
      />
    </View>
  </View>
);

export default AddressStatusList;
