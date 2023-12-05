import React from 'react';
import {View, Text} from 'react-native';

import {errorStyle} from '../Assets/Styles';

const ErrorIndicator = ({error}) => (
  <View style={errorStyle.errorsContainer}>
    <Text style={errorStyle.errorsTextStyle}>{error}</Text>
  </View>
);

export default ErrorIndicator;
