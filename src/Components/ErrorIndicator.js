import React from 'react';
import {View, Text} from 'react-native';

import {errorStyle} from '../Assets/Styles';

const {errorsContainer, errorsTextStyle} = errorStyle;

const ErrorIndicator = ({error}) => (
  <View style={errorsContainer}>
    <Text style={errorsTextStyle}>{error}</Text>
  </View>
);

export default ErrorIndicator;
